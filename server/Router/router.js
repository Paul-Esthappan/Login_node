const express = require('express');
const router = express.Router();
const userss = require('../Models/models');
const Cryptojs = require('crypto-js')
const jsonwebtoken = require('jsonwebtoken');
const CryptoJS = require('crypto-js')


router.post('/login', async (req, res) => {

    try {
        const { email, password : inputpassword } = req.body;
        const user = await userss.findOne({ email: email });
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.psw_KEY).toString(CryptoJS.enc.Utf8);
        console.log('decpassword id ', decryptedPassword);
        console.log(user.password);
        console.log("inpass", inputpassword);


        if (decryptedPassword !== inputpassword) {
            return res.status(401).json({ message: 'Invalid password ' });
            // console.log('dpass',decryptedPassword,'orgpass',passwordin);
        }

        const accessToken = jsonwebtoken.sign(
            { id: user._id },
            process.env.psw_KEY,
            { expiresIn: '1d' }
        );

        const { password, ...other } = user._doc;
        console.log(user);

        res.status(200).json({ ...other, accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.route('/signup').post(async (req, res) => {
    const { email, password, name, phonenumber } = req.body;

    try {
        const existingUser = await userss.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = CryptoJS.AES.encrypt(password, process.env.psw_KEY).toString();

        const newUser = new userss({
            name: name,
            phonenumber: phonenumber,
            email: email,
            password: hashedPassword, 
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
        console.log('saved user', newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add routes for getting, updating, and deleting user details as needed
router.route('/:id').get(async (req, res) => {
    try {
        const user = await userss.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude sensitive information like the password from the response
        const { password, ...other } = user._doc;

        res.status(200).json(other);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update user details by ID
router.route('/:id').put(async (req, res) => {
    try {
        const updatedUser = await userss.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Returns the updated document
        });
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude sensitive information like the password from the response
        const { password, ...other } = updatedUser._doc;

        res.status(200).json(other);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete user by ID
router.route('/:id').delete(async (req, res) => {
    try {
        const deletedUser = await userss.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Exclude sensitive information like the password from the response
        const { password, ...other } = deletedUser._doc;

        res.status(200).json({ message: 'User deleted successfully', deletedUser: other });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;




