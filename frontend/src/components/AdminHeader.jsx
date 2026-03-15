import React from "react";

const AdminHeader = ({ title }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h3>{title}</h3>
      </div>

      <div className="header-right">
        <span>Admin</span>
        <div className="admin-avatar"></div>
      </div>
    </header>
  );
};

export default AdminHeader;