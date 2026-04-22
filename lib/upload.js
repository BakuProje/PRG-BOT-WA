
const { uploadFile } = require('cloudku-uploader');
const fs = require('fs');

module.exports = async function uploadToCloudku(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await uploadFile(fileBuffer, filePath.split('/').pop());

    if (result.status === 'success') {
      return result.data.url; // langsung return URL hasil upload
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  } catch (error) {
    throw new Error(`Upload error: ${error.message}`);
  }
};