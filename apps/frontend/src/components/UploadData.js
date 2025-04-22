import React, { useState } from 'react';
import './UploadData.scss';

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    // Simulate file upload (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('File uploaded successfully!');
      setFile(null);
      document.getElementById('file-upload').value = '';
    } catch (error) {
      setMessage('Error uploading file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Excel Data Upload</h2>
      <p className="instructions">
        Upload Excel files (.xlsx, .xls) to update system data. 
        Only supervisors can access this feature.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file-upload" className="file-label">
            {file ? file.name : 'Choose Excel File'}
          </label>
        </div>
        
        <button 
          type="submit" 
          className="upload-button"
          disabled={isLoading || !file}
        >
          {isLoading ? 'Uploading...' : 'Upload Data'}
        </button>
      </form>
      
      {message && (
        <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadData;