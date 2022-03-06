const {User, Product, Type, Order} = require('../models')
const {Op} = require('sequelize')
const { comparePassword } = require("../helpers/bcrypt")
const {sign} = require("../helpers/jwt")
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


class customerController {

    //Register
    static register(req, res, next){
        const { email, password, phoneNumber, address} = req.body    
        User.create({email, password, role:'customer', phoneNumber, address})
            .then((user) => {
                res.status(201).json({
                    id: user.id,
                    email: user.email
                })
            })
            .catch ((error) => {
                next(error)
            })
    }

    //Login
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
                    role: "customer",
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

    //Entitas Utama Product
    static showProduct (req, res, next){
        // console.log('ini dari query', req.query)
        let type = req.query.type || ""
        let name = req.query.name || ""

        let page = Number(req.query.page) || 1
        let offset_count
        if (!page || page === 1) {
            offset_count = 0
        } else {
            offset_count = page - 1
        }

        let page_count

        Product.findAndCountAll({
            include: [{
                model: User,
                attributes: {
                    exclude: ['role','password','createdAt','updatedAt']
                },
            },{
                model: Type,
                attributes: {
                    exclude: ['createdAt','updatedAt']
                },
                where: {
                    name: {
                        [Op.iLike] : `%${type}%`}
                }
            }],
            where : {
                name: {
                    [Op.iLike] : `%${name}%`}
            }, 
            order: [['id', 'ASC']],
            limit: 4,
            offset: offset_count * 4
        })
            .then((data) => {
                page_count =  Math.floor(data.count/4)
                if(data.count % 4){
                    page_count += 1
                }
                res.status(200).json({
                    totalItems: data.count,
                    totalPages: page_count,
                    currentPage: page,
                    products: data
                })
            })
            .catch((error) => {
                console.log(error)
                next(error)
            })
    }
    static getProductById(req, res, next){
        Product.findByPk(+req.params.id)
        .then((data) => {
            if (!data) throw {name: "Not Found"}
            res.status(200).json({
                product: data
            })
        })
        .catch((error) => {
            next(error)
        })
    }

    //Customer Order 
    static orderProduct (req, res, next){
        let productOrder = []
        Product.findByPk(+req.params.id)
        .then((data) => {
            if(req.user.role !== 'customer') throw {name: "unauthorized"}
            if (!data) throw {name: "Not Found"}
            productOrder.push(data)
            return Order.create({
                productId: data.id, 
                userId: req.user.id
            })
        })
        .then((data) => {
            res.status(201).json({
                data,
                role: req.user.role
            })
        })
        .catch((error) => {
            next(error)
        })
    }
    static myOrder (req, res, next){
        Order.findAll({
            include: [{
                model: User,
                attributes: {
                    exclude: ['role','password','createdAt','updatedAt']
                },
            },{
                model: Product,
                attributes: {
                    exclude: ['createdAt','updatedAt']
                }
            }],
            where: {userId : req.user.id}
        })
        .then((data) => {
            if(req.user.role === 'customer' ) {
                res.status(200).json({
                    data
                })
            }else {
                res.status(401).json({ message: "only customer"})
            }
            
        })
        .catch((error) => {
            next(error)
        })
    }
}

module.exports = customerController