const express = require("express");
const cors = require("cors");
const bp = require('body-parser')
require('dotenv').config()
const app = express();
const emailRouter = require('./app/routes/email.routes');
const productRoutes = require('./app/routes/product.routes');
const companyRoutes = require('./app/routes/company.routes');
const orderRoutes = require('./app/routes/order.routes');
const paymentRoutes = require('./app/routes/payment.routes');

var corsOptions = {
  origin: ["http://localhost:8081", "http://127.0.0.1:8081"],
};

app.use(cors(corsOptions)); 

// parse requests of content-type - application/json
app.use(express.json());
app.use(bp.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.post('/', function (req, res, next) {
  res.send(JSON.stringify(req.body));
});

app.use('/uploads', express.static('uploads'));
app.use('/qrcodes', express.static('qrcodes'));

app.use('/api/email', emailRouter);
app.use('/api/products', productRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Velkommen til dsvdv" });
});
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
const db = require("./app/models");
const Role = db.role;
// db.sequelize.sync({ force: false }).then(() => {
//   console.log("Database synchronized.");
// });

db.sequelize.sync({ alter: true }).then(() => {
  // Your server setup and start code here
}).catch((error) => {
  console.error('Error while syncing the database:', error);
});