import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar'; // ADD THIS IMPORT
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux'; // ADD THIS

const Layout = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1 d-flex">
        {isAuthenticated && <Sidebar />}
        <main className="flex-grow-1">
          {children}
        </main>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Layout;