import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token }) => {
  const [dashboard, setDashboard] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchVolunteers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboard(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/volunteers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteers(response.data.volunteers);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/volunteers/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchVolunteers();
      fetchDashboard();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics Cards */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Total Volunteers</h3>
            <p className="text-3xl font-bold">{dashboard.statistics.totalVolunteers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Active Volunteers</h3>
            <p className="text-3xl font-bold text-green-600">{dashboard.statistics.activeVolunteers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Pending Approvals</h3>
            <p className="text-3xl font-bold text-yellow-600">{dashboard.statistics.pendingVolunteers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Total Hours</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboard.statistics.totalHours}</p>
          </div>
        </div>
      )}

      {/* Volunteers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Volunteer List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {volunteers.map(volunteer => (
                <tr key={volunteer._id}>
                  <td className="px-6 py-4">
                    {volunteer.firstName} {volunteer.lastName}
                  </td>
                  <td className="px-6 py-4">{volunteer.email}</td>
                  <td className="px-6 py-4">
                    {volunteer.skills.slice(0, 3).join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      volunteer.status === 'active' ? 'bg-green-100 text-green-800' :
                      volunteer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={volunteer.status}
                      onChange={(e) => updateStatus(volunteer._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="active">Activate</option>
                      <option value="inactive">Deactivate</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
