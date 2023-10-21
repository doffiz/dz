module.exports = {
    HOST: "localhost",
    USER: "doffiz",
    PASSWORD: "Dankw00f",
    DB: "testdb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };