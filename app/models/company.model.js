module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define("company", {
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      connectedTo: {
        type: Sequelize.INTEGER
      },
      logo: {
        type: Sequelize.STRING
      },
      });
    Company.associate = (models) => {
      Company.hasMany(models.Product, {
        foreignKey: "companyId", // Add a companyId field to the Product model
        as: "products",         // Define an alias for the association
        onDelete: "SET NULL",    // This ensures cascading deletion
        onUpdate: "CASCADE",    // This ensures cascading update
      });
    };
  
    return Company;
  };