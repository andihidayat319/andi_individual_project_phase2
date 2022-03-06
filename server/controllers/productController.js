const {
    Product, User, Type
} = require("../models");


class productController {

    static getAllProduct(req, res, next) {
        Product.findAll({
            include: [{
                model: User,
                attributes: {
                    exclude: ['role','password','createdAt','updatedAt']
                }
            },{
                model: Type,
                attributes: {
                    exclude: ['createdAt','updatedAt']
                }
            }], order: [['id', 'ASC']]
        })
            .then((data) => {
                res.status(200).json({
                    products: data,
                    user: req.user
                })
            })
            .catch((error) => {
                next(error)
            })
    }

    static createProduct(req, res, next) {
        const { name, description, imgUrl,  price, quantity, typeId } = req.body
        Product.create({
                name,
                description,
                imgUrl,
                price,
                quantity,
                typeId,
                userId: req.user.id
            })
            .then((data) => {
                res.status(201).json({
                    message: data
                })
            })
            .catch((error) => {
                next(error)
            })
    }

    static detailProductById(req, res, next) {
        Product.findByPk(+req.params.id)
            .then((data) => {
                if (!data) throw {name: "Not Found"}
                console.log(data)
                res.status(200).json({
                    product: data
                })
            })
            .catch((error) => {
                next(error)
            })
    }

    static updateProductById(req, res, next) {
        const { name, description, imgUrl, price, quantity } = req.body
        Product.findByPk(req.params.id)
            .then((data) => {
                if(!data) throw ({name: "Not Found"})
                if(data.authorId !== req.user.id && req.user.role !== "admin") throw ({name: "Forbidden"})
                return Product.update({
                    name,
                    description,
                    imgUrl,
                    price,
                    quantity        
                }, {
                    where: {
                        id: req.params.id
                    },
                    returning: true
                })
            })
            .then((data) => {
                res.status(200).json({
                    message: data[1][0]
                })
            })
            .catch((error) => {
                console.log(error)
                next(error)
            })
    }
    static deleteProduct(req, res, next){
        const result = {}
        Product.findByPk(+req.params.id)
        .then((data) => {
            if(!data) throw ({name: "Not Found"})
            if(data.authorId !== req.user.id && req.user.role !== "admin") throw ({name: "Forbidden"})
            result.product = data
            return Product.destroy({
                where: {
                    id: req.params.id
                }
            })
        })
        .then(() => {
            res.status(200).json({"message" : `${result.product.name} success to delete`})
        })
        .catch((err) => {
            next(err)
        });
    }

}

module.exports = productController