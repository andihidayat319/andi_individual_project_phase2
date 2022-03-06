const {User} = require("../models")

class registerController {

    static register(req, res, next){
        const { email, password, phoneNumber, address} = req.body    
        User.create({email, password, phoneNumber, address})
        .then((user) => {
            res.status(201).json({
                id: user.id,
                email: user.email
            })
        })
        .catch ((error) => {
            console.log(error)
            next(error)
        })
    }

    

}

module.exports = registerController