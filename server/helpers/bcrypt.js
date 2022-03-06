const bcrypt = require("bcryptjs")

function hashingPassword(password){
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(password, salt)
    return hash
}

function comparePassword(passwordUser, passwordHash) {
    return bcrypt.compareSync(passwordUser, passwordHash)
}
module.exports = {
    hashingPassword,
    comparePassword
}