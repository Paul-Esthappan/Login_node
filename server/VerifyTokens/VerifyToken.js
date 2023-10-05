const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    console.log('header', req.header);
    
    let authheader = req.header.verifyToken
    console.log('header token', authheader);

    if (authheader) {
        const token = authheader.split(" ", [1]);
        jwt.verify(token,process.env.psw_KEY, (err, user) => {
            if (err) res.status(403).json('token not valid')
            console.log("MongoDB ID",user);
            next();
        })
    }
    else {
        return res.status(403).jos('you are not authentacated')
    }
}
module.exports = {verifyToken}