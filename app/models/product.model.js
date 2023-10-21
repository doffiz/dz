module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, 
      }
    });


    Product.associate = (models) => {
      Product.belongsTo(models.Company, {
        foreignKey: 'companyId', 
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE',
      });
    };
  
    return Product;
  };
  