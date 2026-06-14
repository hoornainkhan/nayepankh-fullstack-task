import React, { useState } from 'react';
import axios from 'axios';

const Reports = ({ token }) => {
  const [loading, setLoading] = useState(false);

  const downloadReport = async (type, format) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/report/${type}?format=${format}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: format === 'csv' ? 'blob' : 'json'
        }
      );

      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `volunteer-report-${type}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.log('Report data:', response.data);
        alert('JSON report generated. Check console for details.');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Generate Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Volunteers</h2>
          <p className="text-gray-600 mb-4">Download complete list of all registered volunteers</p>
          <div className="space-x-4">
            <button
              onClick={() => downloadReport('volunteers', 'csv')}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Download CSV
            </button>
            <button
              onClick={() => downloadReport('volunteers', 'json')}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              View JSON
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Volunteers</h2>
          <p className="text-gray-600 mb-4">Download list of currently active volunteers</p>
          <div className="space-x-4">
            <button
              onClick={() => downloadReport('active', 'csv')}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Applications</h2>
          <p className="text-gray-600 mb-4">Download list of pending volunteer applications</p>
          <div className="space-x-4">
            <button
              onClick={() => downloadReport('pending', 'csv')}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Skills Summary</h2>
          <p className="text-gray-600 mb-4">Download summary of volunteer skills distribution</p>
          <div className="space-x-4">
            <button
              onClick={() => downloadReport('skills', 'csv')}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;