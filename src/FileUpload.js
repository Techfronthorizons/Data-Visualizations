// FileUpload.js
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUpload.css";

const FileUpload = () => {
  const [fileNames, setFileNames] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFileNames(acceptedFiles.map(file => file.name));
    console.log("Uploaded files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv, .json",
  });

  return (
    <div className="upload-container">
      <h1>Welcome to GeoVitz</h1>
      <p>Your ultimate data visualization destination</p>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag & drop a dataset file here, or click to upload</p>
        )}
      </div>
      {fileNames.length > 0 && (
        <div className="file-names">
          <p>Uploaded Files:</p>
          <ul>
            {fileNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
