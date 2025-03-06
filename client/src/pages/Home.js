import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">My Block Roots</h1>
        <p className="hero-subtitle">Preserving Your Legacy on the Blockchain</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Create Account</Link>
          <Link to="/about" className="btn btn-outline">Learn More</Link>
        </div>
      </section>

      <section className="container">
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', margin: '4rem 0' }}>
          <div className="feature-box">
            <h3 className="feature-title">Secure Storage</h3>
            <p>Store your family history securely on the blockchain, ensuring it's preserved for generations to come.</p>
          </div>
          <div className="feature-box">
            <h3 className="feature-title">Easy Import</h3>
            <p>Import your existing GEDCOM files with a single click and visualize your family tree instantly.</p>
          </div>
          <div className="feature-box">
            <h3 className="feature-title">Family Verification</h3>
            <p>Verify family connections and create a tamper-proof record of your genealogy.</p>
          </div>
        </div>
      </section>

      <section className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>How It Works</h2>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p>With My Block Roots, you can easily upload your family tree data, visualize it with our interactive diagram tool, and securely store it on the blockchain.</p>
          <p>We use Arweave for permanent storage and Polygon for low-cost transaction recording, making it affordable and reliable.</p>
          <Link to="/upload-gedcom" className="btn btn-primary" style={{ marginTop: '1rem' }}>Try Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 