'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Type, {
        foreignKey: "typeId"
      })
      Product.belongsTo(models.User, {
        foreignKey: "userId"
      })
      Product.hasMany(models.Order, {
        foreignKey: "productId"
      })
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "name cannot Empty"
        },
        notNull: {
          msg: "name cannot null"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "description cannot Empty"
        },
        notNull: {
          msg: "description cannot null"
        }
      }
    },
    imgUrl: DataTypes.STRING,
    typeId: DataTypes.INTEGER,
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "price cannot Empty"
        },
        notNull: {
          msg: "price cannot null"
        },
        min: {
          args: 1000,
          msg: "price minimum 1000"
        }
      }
    },
    quantity: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};