const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.company = require("../models/company.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.order = require("../models/order.model.js")(sequelize, Sequelize);


// Define associations
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.role.belongsToMany(db.company, {
  through: "company_roles",
  foreignKey: "roleId",
  otherKey: "companyId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.company.belongsToMany(db.role, {
  through: "company_roles",
  foreignKey: "companyId",
  otherKey: "roleId"
});

db.company.hasMany(db.product, { foreignKey: 'companyId', as: 'products' });
db.product.belongsTo(db.company, { foreignKey: 'companyId', as: 'company' });



db.user.hasMany(db.company, { foreignKey: 'connectedTo' });
db.company.belongsTo(db.user, { foreignKey: 'connectedTo' });

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});
db.company.hasOne(db.refreshToken, {
  foreignKey: 'companyId', targetKey: 'id' // Change to companyId
});
db.refreshToken.belongsTo(db.company, {
  foreignKey: 'companyId', targetKey: 'id' // Change to companyId
});

db.order.belongsTo(db.company, { // Use lowercase 'company'
  foreignKey: "companyId", // Field name in the Order table
  as: "companyOrder", // Alias for the association
  onDelete: "CASCADE", // Delete orders when a company is deleted
  onUpdate: "CASCADE", // Update orders when a company is updated
});


db.ROLES = ["user", "admin", "moderator", "company"];

module.exports = db;
