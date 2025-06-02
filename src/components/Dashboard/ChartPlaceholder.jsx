import React from 'react';

const ChartPlaceholder = ({ title, type }) => {
  const placeholderStyle = {
    backgroundColor: 'var(--primary-white)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    margin: '20px 0',
    height: '300px', // Example height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed var(--border-color)',
    flex: 1,
    marginRight: '10px',
    marginLeft: '10px'
  };
  return (
    <div style={placeholderStyle}>
      <p style={{ textAlign: 'center', color: '#777' }}>
        <strong>{title}</strong>
        <br />({type} Chart Placeholder)
        <br />
        <em>Integrate Recharts or Chart.js here</em>
      </p>
    </div>
  );
};

export default ChartPlaceholder;
