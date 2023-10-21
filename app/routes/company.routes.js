const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authJwt } = require('../middleware');

// Get a company by ID
router.get('/:companyId', companyController.getCompanyById);

// Update a company by ID (only accessible by the company itself)
router.put('/:companyId', [authJwt.verifyToken, authJwt.isAdmin], companyController.updateCompany);

// Delete a company by ID (only accessible by the company itself)
router.delete('/:companyId', [authJwt.verifyToken, authJwt.isAdmin], companyController.deleteCompany);



module.exports = router;