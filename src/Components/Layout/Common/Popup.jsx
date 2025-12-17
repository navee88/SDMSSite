import React from 'react';
import './popup.css';
import { MdOutlineClear } from "react-icons/md";

const Popup = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
const onCloseopup=()=>{
onClose();
}
  return (
    <div className="popup-overlay" >
      <div className="popup-container">
        <div className="popup-header">
          <h3 className="popup-title">{title}</h3>
          {showCloseButton && (
            <button className="popup-close-btn" onClick={onClose}>
              <MdOutlineClear />
            </button>
          )}
        </div>
        <div className="popup-content">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Popup;
