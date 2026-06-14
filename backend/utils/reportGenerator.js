const { createObjectCsvStringifier } = require('csv-writer');

const generateVolunteerReport = async (data, format) => {
  if (format === 'csv') {
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'status', title: 'Status' },
        { id: 'skills', title: 'Skills' },
        { id: 'hoursContributed', title: 'Hours Contributed' },
        { id: 'createdAt', title: 'Registration Date' }
      ]
    });

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);
  }
  
  return data;
};

module.exports = { generateVolunteerReport };