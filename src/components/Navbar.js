import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/user-management">User Management</Link></li>
        <li><Link to="/compliance-management">Compliance Management</Link></li>
        <li><Link to="/audit-logs">Audit Logs</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/compliance-reporting">Compliance Reporting</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
