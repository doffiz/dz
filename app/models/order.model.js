module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
        userName: {
            type: Sequelize.STRING
        },
        roomNumber: {
            type: Sequelize.STRING
        },
        products: {
            type: Sequelize.JSON // You can use JSON or other data types as needed
        },
        status: {
            type: Sequelize.STRING
        },
        payment: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE
        },
    });


    Order.belongsTo(sequelize.models.company, {
        foreignKey: "companyId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    
      return Order;
    };
    
