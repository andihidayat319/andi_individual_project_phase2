const { verify } = require("../helpers/jwt")
const { User } = require("../models")

function authenticationMiddleware(req, res, next){    
    try {
        if(!req.headers.access_token) throw ({ name: "FailedAccessToken"})
        const payload = verify(req.headers.access_token)
        const {email} = payload
        User.findOne({ where: {email}})
        .then((user)=> {
            if (!user) throw ({name: "unauthorized"})
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role
            }
            next()
        })
        .catch ((error) => {
            next(error)
        })
    } catch (error) {
        next(error)
    }
    
}

module.exports = authenticationMiddleware