const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Volunteer = require('../models/Volunteer');
const auth = require('../middleware/auth');
const { generateVolunteerReport } = require('../utils/reportGenerator');

// @route   POST /api/admin/register
// @desc    Register admin (superadmin only)
router.post('/register', auth, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, email, password, role } = req.body;
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = new Admin({ name, email, password, role });
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/login
// @desc    Login admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments();
    const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' });
    const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });
    const approvedVolunteers = await Volunteer.countDocuments({ status: 'approved' });
    
    const totalHours = await Volunteer.aggregate([
      { $group: { _id: null, total: { $sum: '$hoursContributed' } } }
    ]);

    const volunteersBySkill = await Volunteer.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const volunteersByArea = await Volunteer.aggregate([
      { $unwind: '$preferredAreas' },
      { $group: { _id: '$preferredAreas', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentRegistrations = await Volunteer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email status createdAt');

    const monthlyRegistrations = await Volunteer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      statistics: {
        totalVolunteers,
        pendingVolunteers,
        activeVolunteers,
        approvedVolunteers,
        totalHours: totalHours[0]?.total || 0
      },
      volunteersBySkill,
      volunteersByArea,
      recentRegistrations,
      monthlyRegistrations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/report/:type
// @desc    Generate reports
router.get('/report/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const { format = 'json' } = req.query;
    
    let data;
    
    switch(type) {
      case 'volunteers':
        data = await Volunteer.find();
        break;
      case 'active':
        data = await Volunteer.find({ status: 'active' });
        break;
      case 'pending':
        data = await Volunteer.find({ status: 'pending' });
        break;
      case 'skills':
        data = await Volunteer.aggregate([
          { $unwind: '$skills' },
          { $group: { _id: '$skills', count: { $sum: 1 } } }
        ]);
        break;
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    if (format === 'csv') {
      const csv = await generateVolunteerReport(data, 'csv');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=volunteer-report-${type}.csv`);
      return res.send(csv);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;