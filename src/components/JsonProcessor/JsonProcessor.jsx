import { useState } from 'react';
import { processFile } from '../../utils/processors';
import Toast from '../Toast';
import './JsonProcessor.css';

const JsonProcessor = () => {
  const [imageSize, setImageSize] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const msg = 'File was uploaded!';
    setToastMessage(msg);
    handleShowToast();
    await processFile(file, setImageSize);
  };

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      <Toast
        showToast={showToast}
        handleClose={handleCloseToast}
        message={toastMessage}
      />
      <section className="processor-container">
        <h1>JSON Processor</h1>
        <label htmlFor="file-upload" className="upload-button">
          {selectedFile ? selectedFile.name : 'Upload File'}
        </label>
        <input
          id="file-upload"
          type="file"
          className="file-input"
          onChange={handleFileChange}
          accept=".json"
        />
        {imageSize && <p>Total image size: {imageSize} MB</p>}
      </section>
    </>
  );
};

export default JsonProcessor;
