import React from 'react';

const CustomFileInput = ({ mediaType, accept, handleMediaChange }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (
      file &&
      file.type.startsWith(mediaType === "image" ? "image/" : "video/")
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleMediaChange({ target: { files: [file] } }, mediaType);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="w-full lg:w-[120%] mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label
        htmlFor={mediaType === "image" ? "imageMessage" : "videoMessage"}
        className="cursor-pointer"
      >
        <div className="flex flex-col items-center">
          <svg
            className="w-8 h-8 text-gray-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <span className="text-gray-500 text-sm">
            Choose a {mediaType === "image" ? "file" : "video"} or drag it here.
          </span>
        </div>
        <input
          id={mediaType === "image" ? "imageMessage" : "videoMessage"}
          type="file"
          name={mediaType === "image" ? "imageMessage" : "videoMessage"}
          accept={accept}
          onChange={(e) => handleMediaChange(e, mediaType)}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default CustomFileInput; 