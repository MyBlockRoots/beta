import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadGedcom, saveToBlockchain } from '../services/api';

const UploadGedcom = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [treeId, setTreeId] = useState(null);
  const [isBlockchainSaving, setIsBlockchainSaving] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Check if file is a GEDCOM file
    if (selectedFile && (selectedFile.name.endsWith('.ged') || selectedFile.name.endsWith('.gedcom'))) {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid GEDCOM file (.ged or .gedcom)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('gedcomFile', file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadGedcom(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Handle successful upload
      if (response.data.success) {
        setTreeId(response.data.treeId);
        // Redirect to family tree page with the data
        navigate('/family-tree', { state: { treeData: response.data.treeData } });
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveToBlockchain = async () => {
    if (!treeId) {
      setError('Please upload a GEDCOM file first');
      return;
    }

    setIsBlockchainSaving(true);
    
    try {
      const response = await saveToBlockchain(treeId);
      
      if (response.data.success) {
        alert(`Successfully saved to blockchain!\nArweave ID: ${response.data.arweaveId}\nPolygon Transaction: ${response.data.polygonTxHash}`);
      } else {
        setError('Failed to save to blockchain. Please try again.');
      }
    } catch (err) {
      console.error('Blockchain save error:', err);
      setError('An error occurred while saving to blockchain. Please try again.');
    } finally {
      setIsBlockchainSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h1 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '2rem' }}>Upload GEDCOM File</h1>
      
      <div className="upload-container" style={{ backgroundColor: 'var(--tertiary-color)', padding: '2rem', borderRadius: '8px' }}>
        <p>Upload your GEDCOM file to visualize your family tree and optionally store it on the blockchain.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gedcom-file" className="form-label">Select GEDCOM File</label>
            <input 
              type="file" 
              id="gedcom-file" 
              accept=".ged,.gedcom"
              onChange={handleFileChange}
              className="form-input"
              style={{ padding: '1rem', backgroundColor: '#2C3E50' }}
            />
            {error && <p style={{ color: '#e74c3c', marginTop: '0.5rem' }}>{error}</p>}
          </div>
          
          {isUploading && (
            <div className="progress-bar-container" style={{ backgroundColor: '#444', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${uploadProgress}%`, 
                  backgroundColor: 'var(--primary-color)', 
                  height: '10px',
                  transition: 'width 0.3s ease'
                }}
              />
              <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>{uploadProgress}% Uploaded</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={isUploading || !file}
          >
            {isUploading ? 'Uploading...' : 'Upload and Visualize'}
          </button>
        </form>
        
        <div className="blockchain-storage" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>Permanent Blockchain Storage</h3>
          <p>After uploading, you can choose to permanently store your family tree on the blockchain for future generations.</p>
          <button 
            className="btn btn-outline" 
            onClick={handleSaveToBlockchain}
            disabled={isUploading || isBlockchainSaving || !treeId}
            style={{ marginTop: '1rem' }}
          >
            {isBlockchainSaving ? 'Saving to Blockchain...' : 'Save to Blockchain'}
          </button>
          <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: '0.7' }}>
            We use Arweave for permanent storage and Polygon for recording transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadGedcom; 