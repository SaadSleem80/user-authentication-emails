const User = require('../model/user_model');
const jwt = require('jsonwebtoken');

const currentUser = (req, res, next) => {
    const token = req.cookies.loggedin;
    if (token) {
        jwt.verify(token, 'saad secret', async (err, decodedToken) => {
            if (err) {
                req.locals.user = null;
                next()
            } else {
                const user = await User.findById(decodedToken.id);
                req.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {
    currentUser
}