const express = require('express');
const router = express.Router();
const User = require('../module/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');
const bcrypt = require('bcrypt');
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const user = new User(data);
        const response = await user.save();
        if(!response) return res.status(404).josn({message:'Failed to register user'});
        const payload = {
            _id: response._id,
            email: response.email,
            name: response.name,
            createdAt: response.createdAt
        }
        const token = generateToken(payload);
        res.status(200).json({ message: 'User registered successfully' , token: token });
    } catch (error) {
        console.log(error);
        
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        const payload = {
            _id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        }
        const token = generateToken(payload);
        res.status(200).json({ message: 'User logged in successfully', token: token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const response = req.user ;
        if(!response) return res.status(404).json({ message: 'User not found, plz login' });
        res.status(200).json({ message: 'User profile', user: response });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.put('/updateprofile', jwtAuthMiddleware, async (req, res) => {
    try{
        const updated_data = req.body ;
        const {email} = req.user ;
        if (updated_data.password) {
            const salt = await bcrypt.genSalt(10);
            updated_data.password = await bcrypt.hash(updated_data.password, salt);
        }
        const response = await User.findOneAndUpdate({email}, updated_data, {new: true});
        if(!response) return res.status(404).json({ message: 'User not found, plz login' });
        const payload = {
            _id: response._id,
            email: response.email,
            name: response.name,
            createdAt: response.createdAt
        }
        const token = generateToken(payload);
        res.status(200).json({ message: 'User profile updated', user: response, token: token });
    } catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.delete('/deleteaccount', jwtAuthMiddleware, async (req, res) => {
    try{
        const {email} = req.user ;
        const response = await User.findOneAndDelete({email});
        if(!response) return res.status(404).json({ message: 'User not found, plz login' });
        res.status(200).json({ message: 'User deleted successfully', user: response });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;