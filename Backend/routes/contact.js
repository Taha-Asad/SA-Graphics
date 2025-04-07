const express = require('express');
const router = express.Router();
const { createContact, getAllContact, deleteContact } = require('../Controllers/contact.controller');
const { auth, isAdmin } = require('../middleware/auth');

// Public route for submitting contact forms
router.post('/', createContact);

// Admin routes - protected
router.get('/', auth, isAdmin, getAllContact);
router.delete('/:id', auth, isAdmin, deleteContact);

module.exports = router; 