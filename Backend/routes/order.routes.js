const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const { sendEmail } = require('../utils/email');
const ejs = require('ejs');
const path = require('path');
const { UPLOAD_PATH, paymentProofUpload } = require('../config/multer');
const fs = require('fs');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  verifyPayment
} = require("../Controllers/order.controller");

// Create a new order with payment proof
router.post('/', authMiddleware, paymentProofUpload.single('transferProof'), createOrder);

// Get all orders for the logged-in user
router.get('/', authMiddleware, getUserOrders);

// Get specific order by ID
router.get('/:orderId', authMiddleware, getOrderById);

// Update order status (Admin only)
router.patch('/:orderId/status', authMiddleware, adminMiddleware, updateOrderStatus);

// Update payment status (Admin only)
router.patch('/:orderId/payment-status', authMiddleware, adminMiddleware, verifyPayment);

// Cancel order
router.post('/:orderId/cancel', authMiddleware, cancelOrder);

// Serve payment proof images
router.get('/:orderId/payment-proof', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Fetching payment proof for order:', orderId);
        
        const order = await Order.findById(orderId);
        console.log('Order found:', order ? 'yes' : 'no');
        
        if (!order) {
            console.log('Order not found');
            return res.status(404).json({ message: 'Order not found' });
        }

        // Log all possible payment proof fields
        console.log('Payment proof fields:', {
            transferProof: order.transferProof,
            paymentProof: order.paymentProof,
            proofOfPayment: order.proofOfPayment,
            paymentProofImage: order.paymentProofImage,
            paymentReceipt: order.paymentReceipt
        });

        // Check for any available payment proof field
        const proofFile = order.transferProof || order.paymentProof || order.proofOfPayment || 
                         order.paymentProofImage || order.paymentReceipt;

        if (!proofFile) {
            console.log('No payment proof found in any field');
            return res.status(404).json({ message: 'Payment proof not found' });
        }

        // Construct file path - make sure it matches the upload path from checkout
        let filePath = path.join(UPLOAD_PATH, 'payment-proofs', proofFile);
        console.log('Looking for file at:', filePath);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('File not found at path:', filePath);
            
            // Try alternative paths
            const alternativePaths = [
                path.join(UPLOAD_PATH, proofFile),
                path.join(UPLOAD_PATH, 'uploads', proofFile),
                path.join(UPLOAD_PATH, 'payment-proofs', path.basename(proofFile))
            ];

            console.log('Trying alternative paths:', alternativePaths);

            const existingPath = alternativePaths.find(p => fs.existsSync(p));
            if (!existingPath) {
                return res.status(404).json({ 
                    message: 'File not found',
                    checkedPaths: [filePath, ...alternativePaths],
                    uploadPath: UPLOAD_PATH,
                    proofFile
                });
            }

            // Use the existing path instead
            console.log('Found file at alternative path:', existingPath);
            filePath = existingPath;
        }

        // Get file extension and set content type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = ext === '.png' ? 'image/png' : 
                          ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                          'application/octet-stream';

        // Set headers for image serving
        res.set({
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31557600',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        });

        // For HEAD requests, just send headers
        if (req.method === 'HEAD') {
            return res.end();
        }

        // For GET requests, send the file
        res.sendFile(filePath);

    } catch (error) {
        console.error('Error serving payment proof:', error);
        res.status(500).json({
            message: 'Error serving payment proof',
            error: error.message,
            stack: error.stack
        });
    }
});

// Also add explicit HEAD route support with the same logic
router.head('/:orderId/payment-proof', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('HEAD request - Checking payment proof for order:', orderId);
        
        const order = await Order.findById(orderId);
        if (!order) {
            console.log('Order not found');
            return res.status(404).end();
        }

        // Log all possible payment proof fields
        console.log('Payment proof fields:', {
            transferProof: order.transferProof,
            paymentProof: order.paymentProof,
            proofOfPayment: order.proofOfPayment,
            paymentProofImage: order.paymentProofImage,
            paymentReceipt: order.paymentReceipt
        });

        // Check for any available payment proof field
        const proofFile = order.transferProof || order.paymentProof || order.proofOfPayment || 
                         order.paymentProofImage || order.paymentReceipt;

        if (!proofFile) {
            console.log('No payment proof found in any field');
            return res.status(404).end();
        }

        // Try all possible file paths
        const possiblePaths = [
            path.join(UPLOAD_PATH, 'payment-proofs', proofFile),
            path.join(UPLOAD_PATH, proofFile),
            path.join(UPLOAD_PATH, 'uploads', proofFile),
            path.join(UPLOAD_PATH, 'payment-proofs', path.basename(proofFile))
        ];

        console.log('Checking possible paths:', possiblePaths);

        const existingPath = possiblePaths.find(p => fs.existsSync(p));
        if (!existingPath) {
            console.log('File not found in any location');
            return res.status(404).end();
        }

        console.log('Found file at:', existingPath);

        const ext = path.extname(existingPath).toLowerCase();
        const contentType = ext === '.png' ? 'image/png' : 
                          ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                          'application/octet-stream';

        res.set({
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31557600',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        });

        res.end();
    } catch (error) {
        console.error('Error checking payment proof:', error);
        res.status(500).end();
    }
});

module.exports = router; 