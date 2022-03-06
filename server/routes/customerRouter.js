const customerController = require('../controllers/customerController')
const authenticationMiddleware = require('../middlewares/authenticationMiddleware')
const customerRouter = require('express').Router()

customerRouter.post("/google-login", customerController.googleLogin)
customerRouter.post("/register", customerController.register)
customerRouter.post("/login", customerController.login)
customerRouter.get("/products", customerController.showProduct)
customerRouter.get("/products/:id", customerController.getProductById)

customerRouter.post("/products/:id/order",authenticationMiddleware, customerController.orderProduct)
customerRouter.get("/myorder",authenticationMiddleware, customerController.myOrder)


module.exports = customerRouter