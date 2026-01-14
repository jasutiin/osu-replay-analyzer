import { Link, Outlet } from '@tanstack/react-router';

const activeProps = {
  className: 'font-bold',
};

export const Root = () => {
  return (
    <div className="p-2">
      <h1 className="text-3xl font-semibold mb-2">
        TanStack Router - Code Based
      </h1>
      <nav>
        <ul className="flex gap-2">
          <li>
            <Link to="/" activeProps={activeProps}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" activeProps={activeProps}>
              About
            </Link>
          </li>
        </ul>
      </nav>
      <div className="my-2">
        <Outlet />
      </div>
    </div>
  );
};
