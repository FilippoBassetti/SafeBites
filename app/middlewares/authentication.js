const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('', async function (req, res) {

        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ success: false, message: 'Authentication failed: Email and password are required.' });
        }

        const user = await User.findOne({ email: req.body.email }).exec();
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Authentication failed: User not found.' });
        }

        console.log("Password:", typeof req.body.password, req.body.password);
        console.log("Hashed Password:", typeof user.password, user.password);

        if (!(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).json({ success: false, message: 'Authentication failed: Invalid credentials' });
        }

    var payload = {
        id: user._id,
		email: user.email
		// other data encrypted in the token	
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}

    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        id: user._id,
        email: user.email,
        self: "api/v1/" + user._id
    });

});

module.exports = router;