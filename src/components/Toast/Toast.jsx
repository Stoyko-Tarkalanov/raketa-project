import { useEffect } from 'react';
import './Toast.css';

// eslint-disable-next-line react/prop-types
const Toast = ({ showToast, handleClose, message }) => {
  useEffect(() => {
    let timeoutId;

    if (showToast) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showToast, handleClose]);

  if (!showToast) return null;

  return (
    <>
      {showToast && (
        <div className="toast">
          <div className="toast-header">
            <strong className="me-auto">Message</strong>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            >
              X
            </button>
          </div>
          <div className="toast-body">{message}</div>
        </div>
      )}
    </>
  );
};

export default Toast;
