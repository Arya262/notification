import React from 'react';

const PreviewPanel = ({ formData, handleImageChange, handleImageRemove }) => {
  return (
    <div className="col-span-1 row-span-2 hidden sm:block">
      <div className="h-48 w-full bg-cyan-100 rounded flex flex-col items-center justify-center p-2">
        {formData.previewImage ? (
          <>
            <img
              src={formData.previewImage}
              alt="Preview"
              className="h-full w-full object-cover rounded"
            />
            <button
              onClick={handleImageRemove}
              type="button"
              className="text-xs text-red-500 mt-1 hover:underline"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <label className="cursor-pointer text-sm text-cyan-800">
              Upload Preview
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-600 mt-1 text-center">
              Accepted: JPG, PNG
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel; 