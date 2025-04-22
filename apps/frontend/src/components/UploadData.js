import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './UploadData.scss';

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processExcel = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const result = {};
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Process Excel file
      const excelData = await processExcel(file);
      
      // Prepare payload matching your API structure
      const payload = {
        sheets: excelData
      };

      // Send to backend
    //   const response = await fetch('http://localhost:3000/upload-json', {
      const response = await fetch('https://consolidated-backend-tan.vercel.app/api/upload-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setMessage(result.message || 'Data uploaded successfully!');
      setFile(null);
      document.getElementById('file-upload').value = '';
    } catch (error) {
      setMessage(error.message || 'Error processing Excel file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Excel Data Upload</h2>
      <p className="instructions">
        Upload Excel files (.xlsx, .xls) to update system data. 
        The file should contain sheets matching your data structure.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
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
          {isLoading ? 'Processing...' : 'Upload Data'}
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