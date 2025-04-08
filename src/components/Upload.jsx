// Upload.jsx
import React from 'react';
const darkbgColor = "#1E1E1E";

function Upload() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.helloContainer}>
          <span role="img" aria-label="robot" style={styles.robotIcon}>🤖</span>
          <h1 style={styles.helloText}>Hello, Kb</h1>
        </div>
        <div style={styles.uploadBox}>
          <p style={styles.uploadText}>Upload an image of a UML class diagram and convert it to code</p>
          <p style={styles.instructionText}>Click the "Browse File" button to select an image</p>
          <button style={styles.browseButton}>Browse File</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: darkbgColor, // Dark background
    fontFamily: 'monospace', // Similar to the UI
    color: '#eee', // Light text color
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  helloContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  robotIcon: {
    fontSize: '2em',
    marginRight: '10px',
  },
  helloText: {
    fontSize: '2.5em',
    margin: 0,
  },
  uploadBox: {
    backgroundColor: '#333',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  uploadText: {
    fontSize: '1em',
    marginBottom: '10px',
  },
  instructionText: {
    fontSize: '0.8em',
    color: '#aaa',
    marginBottom: '20px',
  },
  browseButton: {
    backgroundColor: '#555',
    color: '#eee',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
  },
  browseButtonHover: {
    backgroundColor: '#777',
  },
};

export default Upload;