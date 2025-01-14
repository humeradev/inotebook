const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Huma is a good girl';

const router = express.Router();

// Create a user: using POST at "/api/auth/createuser" does not require login/auth
router.post(
  '/createuser',
  [
    // Validation rules
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
      // Check whether a user already exists with the same email
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      let user = await User.create({
        email,
        name,
        password: hashedPassword, // Store the hashed password
      });

      // Generate JWT token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      // Send success response with the auth token
      res.status(201).json({
        message: 'User created successfully',
        authtoken,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
