import React, { useState } from 'react';

export default function BulkContactForm({ setCsvUrl, setFile, file, csvUrl }) {
    const [groupName, setGroupName] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            // Optionally, you can create a URL for the file if needed:
            setCsvUrl(URL.createObjectURL(selectedFile)); 
        } else {
            alert("Please upload a valid CSV file.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!groupName || !file) {
            alert("Please provide a group name and upload a file.");
            return;
        }
        // handle the form submission logic here
        console.log("Group Name:", groupName);
        console.log("File uploaded:", file);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Group Name</label>
                <input
                    type="text"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md text-gray-700"
                />
            </div>

            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileUpload"
                />
                <label htmlFor="fileUpload" className="cursor-pointer text-gray-500">
                    <img src="cloud-computing.png" className="w-6 h-6 mx-auto mb-2" alt="Upload" />
                    <p>Choose a file or drag it here.</p>
                    <p className="text-xs mt-1">Max 50MB and 200K contacts allowed.</p>
                    {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
                </label>
            </div>
        </form>
    );
}
