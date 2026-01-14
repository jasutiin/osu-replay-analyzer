import { Link, Outlet } from '@tanstack/react-router';
import './root.css';

export const Root = () => {
  return (
    <div className="root">
      <nav className="nav">
        <Link
          to="/"
          className="nav-link"
          activeProps={{ className: 'nav-link active' }}
        >
          Upload Replay
        </Link>
        <Link
          to="/analyze"
          className="nav-link"
          activeProps={{ className: 'nav-link active' }}
        >
          Analyze
        </Link>
      </nav>
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
};
