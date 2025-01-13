const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create a user: using POST at "/api/auth/createuser" does not require login/auth
router.post(
  '/createuser',
  
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('name').isLength({ min: 3 }).withMessage('Your name must be at least 3 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
      // Check whether the user exists with the same email
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Sorry, a user with this email already exists' });
      }

      // Create a new user
      let user = await User.create({
        email,
        name,
        password, 
      });

      // Send a success response
      res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
