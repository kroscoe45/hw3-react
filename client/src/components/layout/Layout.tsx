import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

// Layout component wraps all pages with common elements like navbar
// prevents duplication of these elements across different pages
const Layout = (): JSX.Element => {
  // This is WAY cleaner than passing children props around
  return (
    <div className="app-layout">
      <header className="header">
        <Navbar />
      </header>
      
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      
      {/* 
        I should probably add a footer here eventually.
        Maybe with links to my GitHub and stuff.
        TODO: Add this before submission
      */}
    </div>
  );
};

export default Layout;