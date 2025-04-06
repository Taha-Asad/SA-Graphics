import React from 'react';
import Dashboard from '../components/Dashboard';
import Users from '../components/Users';
import Orders from '../components/Orders';
import Reviews from '../components/Reviews';
import Testimonials from '../components/Testimonials';
import Books from '../components/Books';
import Projects from '../components/Projects';

const AdminRoutes = [
  {
    path: '/admin/dashboard',
    element: <Dashboard />
  },
  {
    path: '/admin/users',
    element: <Users />
  },
  {
    path: '/admin/orders',
    element: <Orders />
  },
  {
    path: '/admin/reviews',
    element: <Reviews />
  },
  {
    path: '/admin/testimonials',
    element: <Testimonials />
  },
  {
    path: '/admin/books',
    element: <Books />
  },
  {
    path: '/admin/projects',
    element: <Projects />
  }
];

export default AdminRoutes; 