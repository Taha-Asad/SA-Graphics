import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Orders from './components/Orders';
import Reviews from './components/Reviews';
import Settings from './components/Settings';
import ContactList from './components/ContactList';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="orders" element={<Orders />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="contacts" element={<ContactList />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes; 