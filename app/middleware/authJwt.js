const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

const User = db.user;
const Company = db.company;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.companyId = decoded.companyId;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};

isCompany = (req, res, next) => {
  console.log('Request Body:', req.body); // Log the request body
  console.log('Request File:', req.file); // Log the request file (image)

  const companyId = req.body.companyId || req.params.companyId || req.body.name.companyId || req.query.companyId;
  if (companyId) {
    Company.findByPk(companyId).then((company) => {
      if (!company) {
        return res.status(404).send({
          message: "Company Not Found",
        });
      }

      company.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "company") {
            next();
            return;
          }
        }
        res.status(403).send({
          message: "Require Company Role!",
        });
      });
    });
  } else {
    res.status(403).send({
      message: "Require Company Role!",
    });
  }
};

isCompanyEdit = (req, res, next) => {
  const companyId = req.body.companyId || req.params.companyId || req.body.name.companyId || req.query.companyId;
  if (companyId) {
    Company.findByPk(companyId).then((company) => {
      if (!company) {
        return res.status(404).send({
          message: "Company Not Found",
        });
      }

      company.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "company") {
            next();
            return;
          }
        }
        res.status(403).send({
          message: "Require Company Role!",
        });
      });
    });
  } else {
    res.status(403).send({
      message: "Require Company Role!",
    });
  }
};

isCompanyDelete = (req, res, next) => {
  const companyId = req.query.companyId;
  if (companyId) {
    Company.findByPk(companyId).then((company) => {
      if (!company) {
        return res.status(404).send({
          message: "Company Not Found",
        });
      }

      company.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "company") {
            next();
            return;
          }
        }
        res.status(403).send({
          message: "Require Company Role!",
        });
      });
    });
  } else {
    res.status(403).send({
      message: "Require Company Role!",
    });
  }
};
     



isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

isAdminDoSearch = (req, res, next) => {
  const usernameToSearch = req.body.username;

  let userResults, companyResults;
  User.findAll({
    where: {
      username: usernameToSearch
    }
  })
    .then(userRes => {
      userResults = userRes;

      return Company.findAll({
        where: {
          username: usernameToSearch
        }
      });
    })
    .then(companyRes => {
      companyResults = companyRes;

      const results = {
        users: userResults,
        companies: companyResults
      };
      res.status(200).send(results);
    })
    .catch(err => {
      console.error("Error in isAdminDoSearch:", err); // Log the error for debugging
      res.status(500).send({ message: err.message });
    });
};




const hasRoles = (roles) => {
  return (req, res, next) => {
    // Check if the user or company exists and has the 'roles' property
    if ((req.user && req.user.roles) || (req.company && req.company.roles)) {
      // Determine the object to check based on the request
      const objectToCheck = req.user ? req.user : req.company;

      // Check if the user or company has any of the specified roles
      for (const role of roles) {
        if (objectToCheck.roles.includes(role)) {
          return next();
        }
      }
    }

    // User or company does not have the required roles or is not defined
    return res.status(403).json({ message: 'Permission denied' });
  };
};


const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  isAdminDoSearch: isAdminDoSearch,
  isCompany: isCompany,
  hasRoles: hasRoles,
  isCompanyEdit: isCompanyEdit,
  isCompanyDelete: isCompanyDelete,

};

module.exports = authJwt;