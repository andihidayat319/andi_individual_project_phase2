const productRouter = require('express').Router()
const productController = require('../controllers/productController')
const authenticationMiddleware = require('../middlewares/authenticationMiddleware')

productRouter.use(authenticationMiddleware)

productRouter.get("/",productController.getAllProduct)
productRouter.post("/",productController.createProduct)
productRouter.get("/:id",productController.detailProductById)
productRouter.delete("/:id",productController.deleteProduct)
productRouter.put("/:id",productController.updateProductById)

module.exports = productRouter