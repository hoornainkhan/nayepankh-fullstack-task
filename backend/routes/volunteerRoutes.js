const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Volunteer = require('../models/Volunteer');
const auth = require('../middleware/auth');

// @route   POST /api/volunteers
// @desc    Register a new volunteer
router.post('/', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isDate().withMessage('Valid date of birth is required'),
  body('address.street').trim().notEmpty(),
  body('address.city').trim().notEmpty(),
  body('address.state').trim().notEmpty(),
  body('address.zipCode').trim().notEmpty(),
  body('availability').isIn(['weekdays', 'weekends', 'both', 'flexible']),
  body('emergencyContact.name').trim().notEmpty(),
  body('emergencyContact.relationship').trim().notEmpty(),
  body('emergencyContact.phone').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingVolunteer = await Volunteer.findOne({ email: req.body.email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'Volunteer with this email already exists' });
    }

    const volunteer = new Volunteer(req.body);
    await volunteer.save();

    res.status(201).json({
      message: 'Volunteer registered successfully',
      volunteer
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers
// @desc    Get all volunteers (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { status, skill, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (skill) query.skills = { $in: [skill] };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Volunteer.countDocuments(query);

    res.json({
      volunteers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalVolunteers: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/:id
// @desc    Get volunteer by ID (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/volunteers/:id
// @desc    Update volunteer status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    res.json({
      message: 'Volunteer updated successfully',
      volunteer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/volunteers/:id
// @desc    Delete volunteer (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    res.json({ message: 'Volunteer removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;