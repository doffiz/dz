const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken, company: Company } = db;
const generateQRCode = require("../../generateQR");

const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    fornavn: req.body.fornavn,
    etternavn: req.body.etternavn,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the User model
  User.findOne({
    where: {
      username: username,
    },
  })
    .then(async (user) => {
      if (user) {
        // User found in the User model
        if (bcrypt.compareSync(password, user.password)) {
          // Password is valid
          const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
          });
          console.log(token);
          let refreshToken = await RefreshToken.createToken(user);

          let authorities = [];
          user.getRoles()
            .then((roles) => {
              if (roles) {
                for (let i = 0; i < roles.length; i++) {
                  authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
              }

              res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                fornavn: user.fornavn,
                etternavn: user.etternavn,
                aktiv: user.aktiv,
                roles: authorities,
                accessToken: token,
                refreshToken: refreshToken,
              });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        } else {
          // Invalid password
          res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }
      } else {
        // User not found in the User model, check the Company model
        Company.findOne({
          where: {
            username: username,
          },
        })
          .then(async (company) => {
            if (company && bcrypt.compareSync(password, company.password)) {
              // Define the token variable here
              const token = jwt.sign({ id: company.id }, config.secret, {
                expiresIn: config.jwtExpiration,
              });

              console.log(token);

              // Retrieve the "company" role from the database
              Role.findOne({
                where: {
                  name: "company",
                },
              })
                .then((role) => {
                  if (role) {
                    // Associate the role with the company
                    company.setRoles([role.id]).then(() => {
                      // Retrieve and include company roles
                      let authorities = ["ROLE_COMPANY"];
                      res.status(200).send({
                        id: company.id,
                        username: company.username,
                        email: company.email,
                        roles: authorities,
                        accessToken: token,
                      });
                    });
                  } else {
                    res.status(500).send({ message: "Company role not found." });
                  }
                })
                .catch((err) => {
                  res.status(500).send({ message: err.message });
                });
            } else {
              // User/Company not found
              res.status(404).send({ message: "User/Company Not found." });
            }
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


  exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
  
    if (requestToken == null) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
  
    try {
      let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
  
      console.log(refreshToken)
  
      if (!refreshToken) {
        res.status(403).json({ message: "Refresh token is not in database!" });
        return;
      }
  
      if (RefreshToken.verifyExpiration(refreshToken)) {
        RefreshToken.destroy({ where: { id: refreshToken.id } });
        
        res.status(403).json({
          message: "Refresh token was expired. Please make a new signin request",
        });
        return;
      }
  
      const user = await refreshToken.getUser();
      let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
  
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  };
 
  exports.companysignup = (req, res) => {
    Company.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      fullname: req.body.fullname,
      address: req.body.address,
      phone: req.body.phone,
      connectedTo: req.body.connectedTo
    })
    .then(company => {
      generateQRCode(company.id)
     .then(() => {
      console.log('QR code generated successfully!');
  })
  .catch((err) => {
    // Handle QR code generation error
    console.error('Error generating QR code:', err);
    res.status(500).send({ message: 'Error generating QR code.' });
  });
      // Retrieve the "company" role from the database
      Role.findOne({
        where: {
          name: "company"
        }
      })
      .then(role => {
        // Check if the role exists
        if (role) {
          // Associate the role with the new company
          company.setRoles([role.id]).then(() => {
            res.send({ message: "Company was registered successfully!" });
          });
        } else {
          res.status(500).send({ message: "Company role not found." });
        }
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  }
  
