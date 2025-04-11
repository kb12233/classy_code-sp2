// Upload.jsx
import React, { useState, useRef } from 'react';
import logoDark from '../assets/images/logo_dark.png';
import { account } from '../appwrite/config'; // Adjust the import path as necessary
import UploadImageSection from './UploadImageSection'; // Import the merged section
import { useAtom } from "jotai";
import {
  uploadedImageAtom,
  imageUploadLoadingAtom,
  processingErrorAtom,
  selectedModelAtom,
  plantUmlCodeAtom, // Import the atom to update
  generatedCodeAtom,
  uploadedFileNameAtom,
} from "../atoms";

const darkbgColor = "#1E1E1E";

const capitalizeFirstLetter = (str) => {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

async function getUserName() {
  try {
    const user = await account.get();
    return capitalizeFirstLetter(user.name);
  } catch (error) {
    console.error("Error fetching user:", error);
    return "[username]";
  }
}

function Upload() {
  const [userName, setUserName] = useState("");
  const fileInputRef = useRef(null);
  const [, setUploadedImage] = useAtom(uploadedImageAtom);
  const [, setIsProcessing] = useAtom(imageUploadLoadingAtom);
  const [, setProcessingError] = useAtom(processingErrorAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const [, setPlantUMLCode] = useAtom(plantUmlCodeAtom); // Get the setter
  const [, setGeneratedCode] = useAtom(generatedCodeAtom);
  const [, setFileName] = useAtom(uploadedFileNameAtom);
  
  React.useEffect(() => {
    getUserName().then(name => setUserName(name));
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setFileName(file.name);
      setIsProcessing(true);
      setProcessingError("");
      setPlantUMLCode(""); // Clear previous UML code
      setGeneratedCode(""); // Clear previous generated code

      const formData = new FormData();
      formData.append("image", file);
      if (selectedModel) {
        formData.append("model", selectedModel);
      }

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.plantUML) {
          setPlantUMLCode(data.plantUML); // Update the PlantUML atom
        } else {
          console.error("Failed to generate PlantUML:", data.error);
          setProcessingError(data.error || "Failed to process image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setProcessingError("Error uploading image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.helloContainer}>
          <img src={logoDark} alt="Logo" style={styles.logo} />
          <h1 style={styles.helloText}>Hello, {userName}</h1>
        </div>
        <div style={styles.uploadBox}>
          <div style={styles.textContainer}>
            <p style={styles.uploadText}>Upload an image of a UML class diagram and convert it to code</p>
            <p style={styles.instructionText}>// Click the "Browse File" button to select an image</p>
          </div>
          <button style={styles.browseButton} onClick={handleBrowseClick}>
            Browse File
          </button>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
        </div>
        <UploadImageSection /> {/* Render UploadImageSection to display the image */}
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
    backgroundColor: darkbgColor,
    fontFamily: 'monospace',
    color: '#eee',
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
  logo: {
    height: 50,
    marginRight: '15px',
  },
  helloText: {
    fontSize: '2.5em',
    margin: 0,
  },
  uploadBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: darkbgColor,
    padding: '50px',
    borderRadius: '10px',
    border: '2px solid #555',
    marginBottom: '20px',
  },
  textContainer: {
    marginRight: '20px',
  },
  uploadText: {
    fontSize: '1em',
    margin: 0,
  },
  instructionText: {
    fontSize: '0.8em',
    color: '#aaa',
    margin: '5px 0 0 0',
  },
  browseButton: {
    backgroundColor: '#303030',
    color: '#eee',
    border: '2px solid #454545',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
  },
  browseButtonHover: {
    backgroundColor: '#777',
  },
};

export default Upload;