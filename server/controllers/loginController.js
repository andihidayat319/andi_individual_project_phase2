const { comparePassword } = require("../helpers/bcrypt")
const {sign} = require("../helpers/jwt")
const {User} = require("../models")
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class loginController {
    static login(req, res, next){
        try {
            const {email, password} = req.body
            if (!email || !password) throw ({name: "Bad Request"})
            User.findOne({where: {email}})
            .then((user) => {
                if (!user) throw ({name: "unauthorized"})
                const compareUser = comparePassword(password, user.password)
                if (!compareUser) throw ({name: "unauthorized"})
                const access_token = sign({id: user.id, email: user.email})
                res.status(200).json({access_token})
            })
            .catch ((error)=> {
                next(error)
            })
        } catch (error) {
            next(error)
        }
    }
    static async googleLogin(req, res, next){
        try {
            const ticket = await client.verifyIdToken({
                idToken: req.body.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const {email} = payload

            const [user, isCreated] = await User.findOrCreate({
                where: {email},
                defaults: {
                    password: "jfvodfkqwofqwojfqwjpoqwfqkfwpo",
                    role: "staff",
                    phoneNumber:"", 
                    address:""
                }
            })
            let code = 200
            if(isCreated) {code = 201}
            const access_token = sign({id: user.id, email: user.email})
            res.status(code).json({ access_token })

        } catch (error) {
            next(error)
        }   
    }
}

module.exports = loginController