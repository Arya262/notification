import React from 'react';

const MediaPreview = ({ formData }) => {
  if (!((formData.regularMessageType === "Image Message" && formData.image) ||
    (formData.regularMessageType === "Video Message" && formData.video))) {
    return null;
  }

  return (
    <div className="w-full lg:w-[40%] lg:mt-2 lg:ml-28 p-2 border border-[#606060] rounded">
      {formData.regularMessageType === "Image Message" && formData.image ? (
        <div className="flex flex-col">
          <img
            src={formData.image}
            alt="Preview"
            className="w-full max-h-[300px] object-contain"
          />
          {formData.message && (
            <div className="w-full p-2 bg-white">{formData.message}</div>
          )}
        </div>
      ) : formData.regularMessageType === "Video Message" && formData.video ? (
        <div className="flex flex-col">
          <video
            src={formData.video}
            controls
            className="w-full max-h-[300px] object-contain"
          />
          {formData.message && (
            <div className="w-full p-2 bg-white">{formData.message}</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MediaPreview; 