import { createRootRoute, createRoute } from '@tanstack/react-router';
import { Root } from './components/root';
import Home from './pages/Home';
import About from './pages/About';

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

export const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);
