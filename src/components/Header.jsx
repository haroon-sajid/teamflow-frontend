import React from "react";
import "../styles/Header.css";

export default function Header({ title, subtitle, actionButtonText, onActionClick }) {
  return (
    <div className="header-container">
      <div className="header-content">
        {/* Left side: Title and Subtitle */}
        <div className="header-left">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>

        {/* Right side: Optional Action Button */}
        {actionButtonText && onActionClick && (
          <div className="header-right">
            <button className="primary-btn add-btn" onClick={onActionClick}>
              {actionButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
