const router = require('express').Router();
const userss = require('../Models/models');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { verifyToken } = require('../VerifyTokens/VerifyToken');



router.put('/update/:id',verifyToken, async (req, res) => {
    
    console.log(req.body);
    console.log(req.params.id);
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(password, process.env.psw_KEY).toString();
        console.log(req.body.password);
    }
    try {
        const Userupdated = await userss.findByIdAndUpdate(req.params.id, {
            $set: 
                req.body
        }, { new: true });
        
        res.status(200).json(Userupdated); 
        console.log("userupdatedata : ",Userupdated);
        }
     catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router




// paulesthappan@gmail.com   