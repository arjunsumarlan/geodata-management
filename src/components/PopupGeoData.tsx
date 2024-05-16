import React, { useState } from "react";
import MapDisplay from "./MapDisplay";

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, content }) => {
  const [showMap, setShowMap] = useState<boolean>(true);
  if (!isOpen) return null;

  const handleChangeDataDisplay = () => {
    setShowMap((prevState) => !prevState);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white py-5 px-8 rounded-lg shadow-lg max-w-md w-full">
        <button onClick={closeModal} className="float-right font-bold">
          X
        </button>
        <div className="mt-2">
          <h2 className="text-xl font-bold mb-4">GeoJSON Data</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white text-xs py-1 px-2 mb-3 rounded"
            onClick={handleChangeDataDisplay}
          >
            {showMap ? "Show JSON" : "Show Map"}
          </button>
          {showMap ? (
            content && <MapDisplay geojsonData={JSON.parse(content)} />
          ) : (
            <pre className="whitespace-pre-wrap text-sm">{content}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
