import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container" style={{ margin: '2rem auto', maxWidth: '800px' }}>
      <h1 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '2rem' }}>About My Block Roots</h1>
      
      <div style={{ backgroundColor: 'var(--tertiary-color)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Our Mission</h2>
        <p>My Block Roots was created with a simple mission: to help people preserve their family history for generations to come using blockchain technology.</p>
        <p>We believe that your family history is precious and deserves to be preserved in a format that can withstand the test of time, free from the risks of data loss, corruption, or centralized control.</p>
      </div>
      
      <div style={{ backgroundColor: 'var(--tertiary-color)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Why Blockchain?</h2>
        <p>Traditional digital storage solutions have limitations:</p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>They can be lost when services shut down</li>
          <li>They rely on companies that may not exist in the future</li>
          <li>They can be subject to censorship or data manipulation</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>By storing your family tree on the blockchain, you gain several advantages:</p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li><strong>Permanence</strong>: Once stored on Arweave, your data remains accessible forever</li>
          <li><strong>Immutability</strong>: Your data cannot be altered or deleted</li>
          <li><strong>Decentralization</strong>: No single entity controls your family history</li>
          <li><strong>Verifiability</strong>: You can prove the authenticity and timeline of your data</li>
        </ul>
      </div>
      
      <div style={{ backgroundColor: 'var(--tertiary-color)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--secondary-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>1</div>
            <div>
              <p><strong>Upload or Create:</strong> Start by uploading a GEDCOM file or creating a family tree from scratch.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--secondary-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>2</div>
            <div>
              <p><strong>Edit and Refine:</strong> Use our interactive tools to edit and enhance your family tree.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--secondary-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>3</div>
            <div>
              <p><strong>Save to Blockchain:</strong> When you're ready, save your family tree to the blockchain with one click.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-color)', color: 'var(--secondary-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>4</div>
            <div>
              <p><strong>Access Forever:</strong> Your family history is now permanently preserved and can be accessed by future generations.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Ready to Preserve Your Family History?</h2>
        <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>Get Started</Link>
        <Link to="/upload-gedcom" className="btn btn-outline">Upload GEDCOM</Link>
      </div>
    </div>
  );
};

export default About; 