const {Redirect, ApiError} = require('../classes')
const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
    if(req.cookies.access_token) return res.send({redirect: new Redirect('./HomePage.html', 'You are already logged in')})
}

const cookieJwtAuth = (req, res, next) => {
    const access_token = req.cookies.access_token
    
    try {
        const userId = jwt.verify(access_token, process.env.SECRET_KEY).id
        req.userId = userId
        return next()
    }
    catch (err) {
        res.clearCookie('access_token')
        return next(new ApiError(401, err.message))
    }
}

module.exports = {isLoggedIn, cookieJwtAuth}