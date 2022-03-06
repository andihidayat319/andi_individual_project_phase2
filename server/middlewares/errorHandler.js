function errorHandler(error, req, res, next) {
    if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map(el => {
            return el.message
        })
        res.status(400).json({
            messages
        })
    } else if (error.name === "Bad Request") {
        res.status(400).json({
            messages: "Bad Request"
        })
    } else if (error.name === "FailedAccessToken"){
        console.log(req.headers,req.headers.access_token)
        res.status(401).json({messages: "Failed Access Token"})
    } else if (error.name === "unauthorized") {
        res.status(401).json({
            message: "Invalid Email or Password"
        })
    }else if (error.name === "Forbidden") {
        res.status(403).json({
            messages: 'Forbidden'
        })
    }else if(error.name === "Not Found"){
        res.status(404).json({
            messages: "error not found"
        })
    } else if (error.name === "SequelizeUniqueConstraintError") {
        const messages = error.errors.map(el => {
            return el.message
        })
        res.status(409).json({
            messages
        })
    } else {
        console.log(error)
        res.status(500).json({
            messages: 'Internal Server Error',
            error
        })
    }
}

module.exports = errorHandler