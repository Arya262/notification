import React from 'react';
import CustomFileInput from './CustomFileInput';
import MediaPreview from './MediaPreview';

const RegularMessage = ({ formData, handleInputChange, handleMediaChange }) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full">
      <div className="w-full lg:w-2/3 pt-4">
        <select
          name="regularMessageType"
          value={formData.regularMessageType}
          onChange={handleInputChange}
          className="w-full lg:w-[120%] p-2 border border-[#606060] rounded mb-2"
          required
        >
          <option value="Select Regular Message Type">
            Select Regular Message Type
          </option>
          <option value="Text Message">Text Message</option>
          <option value="Image Message">Image Message</option>
          <option value="Video Message">Video Message</option>
        </select>
        {(formData.regularMessageType === "Image Message" ||
          formData.regularMessageType === "Video Message") && (
          <div className="w-full lg:w-[100%] mt-2">
            <CustomFileInput
              mediaType={
                formData.regularMessageType === "Image Message"
                  ? "image"
                  : "video"
              }
              accept={
                formData.regularMessageType === "Image Message"
                  ? "image/*"
                  : "video/*"
              }
              handleMediaChange={handleMediaChange}
            />
          </div>
        )}
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleInputChange}
          className="w-full lg:w-[120%] h-36 p-2 border border-[#606060] rounded resize-none mt-2"
          required
        />
      </div>
      <MediaPreview formData={formData} />
    </div>
  );
};

export default RegularMessage; 