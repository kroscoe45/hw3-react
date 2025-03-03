// pages/NotFoundPage.tsx
// Super simple 404 page - nothing fancy needed here
import { Link } from 'react-router-dom';

const NotFoundPage = (): JSX.Element => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="home-link">
        Return to Home
      </Link>
      
      {/* 
        I should add a better 404 page
      */}
    </div>
  );
};

export default NotFoundPage;