import React, { ChangeEvent, useState, useCallback, useRef } from "react";
import { GeoJsonObject } from "geojson";

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files ? event.target.files[0] : null;
      if (selectedFile) {
        if (selectedFile.type !== "application/json") {
          setMessage("Please upload a valid GeoJSON file.");
          setFile(null);
        } else {
          setFile(selectedFile);
          onUpload(null);
          setMessage("");
        }
      }
    },
    [onUpload]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setMessage("No file selected or file format is incorrect.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const token = localStorage.getItem("token");
        const text = e.target?.result as string;

        const response = await fetch("/api/geojson", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            geojson: text,
          }),
        });

        const result = await response.json();
        if (response.status === 200) {
          const data = JSON.parse(text);
          onUpload(data as GeoJsonObject);
          setMessage("");
          setEmail("");
          setFile(null);
          alert(result.message);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setMessage(result.message);
        }
      } catch (error) {
        setMessage("Failed to parse the GeoJSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border-0 bg-purple-50 lg:w-56 px-2 py-2 ml-8 text-sm font-semibold text-purple-700"
        />
      </div>
      <div>
        <label htmlFor="geojson">GeoJSON:</label>
        <input
          type="file"
          ref={fileInputRef}
          id="geojson"
          onChange={handleFileChange}
          accept=".json, .geojson"
          className="file:rounded-lg file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700"
        />
        <p className="text-xs">
          You can download a template to help format your GeoJSON data
          correctly.{" "}
          <a
            className="text-red-800 hover:text-red-300"
            href="/templates/geojson-template.json"
            download="GeoJSON-Template.json"
          >
            Download GeoJSON Template
          </a>
        </p>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload Data
      </button>
      {message && <div className="text-sm text-red-500">{message}</div>}
    </form>
  );
};

export default FileUploader;
