const router = require('express').Router()
const loginController = require('../controllers/loginController')
const registerController = require('../controllers/registerController')
const errorHandler = require('../middlewares/errorHandler')
const customerRouter = require('./customerRouter')
const productRouter = require('./productRouter')

router.post("/google-login",loginController.googleLogin)
router.post("/register",registerController.register)
router.post("/login",loginController.login)
router.use("/products", productRouter)
router.use("/pub",customerRouter)

router.use(errorHandler)

module.exports = router