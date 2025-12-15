
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function CameraCapture({ onCapture }) {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setCapturedImage(imageSrc);
    onCapture(imageSrc);
  };

  return (
    <div className="flex flex-col gap-3 items-center">

      {!capturedImage ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-lg w-48 h-48 object-cover"
          videoConstraints={{
            width: 400,
            height: 400,
            facingMode: "user",
          }}
        />
      ) : (
        <img
          src={capturedImage}
          alt="Captured"
          className="rounded-lg w-48 h-48 object-cover border"
        />
      )}

      {!capturedImage && (
        <button
          className="px-4 py-2 bg-white text-azraq-400 rounded-lg cursor-pointer"
          onClick={capture}
        >
          Capture
        </button>
      )}

      {capturedImage && (
        <button
          onClick={() => setCapturedImage(null)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Retake
        </button>
      )}
    </div>
  );
}