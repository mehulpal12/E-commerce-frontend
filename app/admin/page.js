"use client"
import { useState } from 'react';
import Image from 'next/image';

export default function AdminUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        // Upload to Cloudinary via API
        const response = await fetch('http://localhost:7000/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();

        if (data.success) {
          setUploadedUrl(data.url);
          alert('Image uploaded successfully!');
          
          // Reset form
          setSelectedFile(null);
          setPreview(null);
        } else {
          alert('Upload failed!');
        }
      };
    } catch (error) {
      console.log('Upload error:', error);
      alert(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8">Admin - Upload Product Image</h1>

          {/* File Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                <Image
                width={250}
                height={250}
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className={`w-full py-3 rounded-full font-medium transition ${
              uploading || !selectedFile
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </button>

          {/* Uploaded URL */}
          {uploadedUrl && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">
                ✓ Upload Successful!
              </p>
              <p className="text-xs text-gray-600 break-all">
                URL: {uploadedUrl}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(uploadedUrl)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}