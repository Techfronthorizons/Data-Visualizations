// FileUpload.js
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Bar, Pie } from "react-chartjs-2"; // Import charts
import { Chart, registerables } from "chart.js"; // Import chart.js
import "./FileUpload.css";

// Register the required Chart.js components
Chart.register(...registerables);

const FileUpload = () => {
  const [data, setData] = useState([]);
  const [visualizationType, setVisualizationType] = useState("bar"); // Default to bar chart

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("Parsed Data:", result.data);
        setData(result.data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleVisualizationChange = (event) => {
    setVisualizationType(event.target.value);
  };

  const getChartData = () => {
    if (data.length === 0) return {};

    const labels = data.map((row) => row["YourLabelColumn"]); // Replace with your label column
    const values = data.map((row) => row["YourValueColumn"]); // Replace with your value column

    return {
      labels: labels,
      datasets: [
        {
          label: "Dataset Visualization",
          data: values,
          backgroundColor: visualizationType === "bar" ? "rgba(75,192,192,1)" : "rgba(255, 99, 132, 1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div className="upload-container">
      <h1>Welcome to GeoVitz</h1>
      <p>Your ultimate data visualization destination</p>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop a dataset file here, or click to upload</p>
      </div>

      {data.length > 0 && (
        <div className="data-preview">
          <h2>Dataset Preview</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(data[0]).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Visualization Controls */}
          <div className="visualization-controls">
            <h3>Visualize Data</h3>
            <label>
              <input
                type="radio"
                value="bar"
                checked={visualizationType === "bar"}
                onChange={handleVisualizationChange}
              />
              Bar Chart
            </label>
            <label>
              <input
                type="radio"
                value="pie"
                checked={visualizationType === "pie"}
                onChange={handleVisualizationChange}
              />
              Pie Chart
            </label>
            <button onClick={() => console.log("Visualizing data...")}>
              Visualize Data
            </button>
          </div>

          {/* Chart Display */}
          <div className="chart-container">
            {visualizationType === "bar" && (
              <Bar data={getChartData()} options={{ responsive: true }} />
            )}
            {visualizationType === "pie" && (
              <Pie data={getChartData()} options={{ responsive: true }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
