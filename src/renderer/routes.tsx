import { createRootRoute, createRoute } from '@tanstack/react-router';
import { Root } from './root';
import Home from './pages/Home/Home';
import Analyze from './pages/Analyze/Analyze';
import Watch from './pages/Watch/Watch';

const rootRoute = createRootRoute({
  component: Root,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const analyzeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analyze',
  component: Analyze,
});

const watchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/watch',
  component: Watch,
});

export const routeTree = rootRoute.addChildren([indexRoute, analyzeRoute, watchRoute]);
