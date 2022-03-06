'use strict';
const {
  Model
} = require('sequelize');
const {hashingPassword} = require("../helpers/bcrypt")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product, {foreignKey: 'userId'})
      User.hasMany(models.Order, {foreignKey: 'userId'})
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "email cannot Empty"
        },
        notNull: {
          msg: "email cannot null"
        },
        isEmail: {
          msg: "wrong email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "password cannot Empty"
        },
        notNull: {
          msg: "password cannot null"
        },
        isLength(value) {
          if (value.length < 5) {
            throw new Error('minimum password length 5');
          }
        }
      }
    },
    role: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashingPassword(user.password)
  })
  User.beforeCreate((user) => {
    if(!user.role){
      user.role = 'admin'
    }
  })
  return User;
};