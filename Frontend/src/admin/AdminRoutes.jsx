import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Orders from './components/Orders';
import Reviews from './components/Reviews';
import Settings from './components/Settings';
import ContactList from './components/ContactList';
import Testimonials from './components/Testimonials';
import Courses from './components/Courses';
import CoursePurchases from './components/CoursePurchases';
import Books from './components/Books';
import Projects from './components/Projects';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="orders" element={<Orders />} />
      <Route path="course-purchases" element={<CoursePurchases />} />
      <Route path="courses" element={<Courses />} />
      <Route path="books" element={<Books />} />
      <Route path="projects" element={<Projects/>} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="testimonials" element={<Testimonials />} />
      <Route path="contacts" element={<ContactList />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes; 