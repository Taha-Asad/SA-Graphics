const express = require('express');
const router = express.Router();
const serviceController = require('../Controllers/service.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', serviceController.getServices);

// Admin routes
router.post('/', verifyToken, isAdmin, serviceController.createService);
router.put('/:id', verifyToken, isAdmin, serviceController.updateService);
router.delete('/:id', verifyToken, isAdmin, serviceController.deleteService);

module.exports = router; 