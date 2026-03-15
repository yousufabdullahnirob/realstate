import React from "react";

const AdminHeader = ({ title }) => {
  return (
    <header className="admin-header" aria-label="Admin Header">
      <div className="header-left">
        <h3>{title}</h3>
      </div>
      <div className="header-right">
        <span className="admin-label">Admin</span>
        <div className="admin-avatar" aria-label="Admin Avatar"></div>
      </div>
    </header>
  );
};

export default AdminHeader;
