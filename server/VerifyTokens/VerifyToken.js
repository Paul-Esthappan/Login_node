const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    console.log('header', req.headers);
    
    let authheader = req.headers.token
    console.log('header token', authheader);


    if (authheader) {
        const token = authheader.split(" ")[1];
        jwt.verify(token,process.env.psw_KEY, (err, user) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(403).json('Token not valid');
            }

            console.log("MongoDB ID", user);
            next();
        });
    } else {
        // No authorization header
        return res.status(403).json('You are not authenticated');
    }
};
module.exports = {verifyToken}