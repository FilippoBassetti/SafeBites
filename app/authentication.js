const express = require('express');
const router = express.Router();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        // audience: GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If the request specified a Google Workspace domain:
	// const domain = payload['hd'];
    return payload;
    
}


router.post('', async function (req, res) {

    var user = {};

    if (req.body.googleToken) {
        const payload = await verify(req.body.googleToken).catch(console.error);
        console.log(payload);

        user = await User.findOne({ email: payload['email'] }).exec();
        if (!user) {
            user = new User({
                password: 'default-google-password-to-be-changed',
                email: payload['email'],
                user_name: payload['name'],
                name: payload['given_name'],
                family_name: payload['family_name'],
                user_type: req.body.user_type || false
            });
            await user.save().exec();
            console.log('Student created after login with google');

        }

    }
    else {

        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ success: false, message: 'Authentication failed: Email and password are required.' });
        }


        const user = await User.findOne({ email: req.body.email }).exec();
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Authentication failed: User not found.' });
        }


        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Authentication failed: Invalid credentials' });
        }
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

