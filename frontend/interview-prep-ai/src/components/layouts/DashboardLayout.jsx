import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
      <div>
          <Navbar />
          <div>{children}</div>
      </div>
  );
};

export default DashboardLayout