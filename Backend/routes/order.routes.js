const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const { sendEmail } = require('../utils/email');
const ejs = require('ejs');
const path = require('path');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, userId } = req.body;

        // Check if this is a course order
        const isCourseOrder = items.some(item => item.type === 'course');

        const order = new Order({
            items,
            totalAmount,
            shippingAddress,
            userId,
            status: 'pending'
        });

        await order.save();

        if (isCourseOrder) {
            // For course orders, send email confirmation
            const courseItem = items.find(item => item.type === 'course');
            const emailTemplate = await ejs.renderFile(
                path.join(__dirname, '../views/emails/coursePurchase.ejs'),
                {
                    userName: shippingAddress.name,
                    courseName: courseItem.title,
                    orderId: order._id,
                    amount: totalAmount
                }
            );

            await sendEmail({
                email: shippingAddress.email,
                subject: 'Course Purchase Confirmation - SA Graphics',
                message: emailTemplate
            });

            res.status(201).json({
                status: 'success',
                message: 'Course order placed successfully. Check your email for details.',
                data: { order }
            });
        } else {
            // For regular orders, proceed with normal flow
            res.status(201).json({
                status: 'success',
                message: 'Order placed successfully',
                data: { order }
            });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// ... existing code ...

module.exports = router; 