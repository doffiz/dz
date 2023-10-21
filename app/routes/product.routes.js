const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authJwt, upload } = require('../middleware');
// Create a new product (only accessible by logged-in companies)
router.post(
    '/create',
    [
      authJwt.verifyToken,
      upload.single('productImage'),
      authJwt.isCompany,
    ],
    productController.createProduct
  );
// Get all products of a specific company
router.get('/company/:companyId', productController.getProductsByCompany);

// Get a specific product by ID
router.get('/:productId', productController.getProductById);

// Update a product by ID (only accessible by the company that owns the product)
router.put('/:productId', [authJwt.verifyToken, authJwt.isCompanyEdit], productController.updateProduct);
router.put('/admin/:productId', [authJwt.verifyToken, authJwt.isAdmin], productController.updateProduct);

// Delete a product by ID (only accessible by the company that owns the product)
router.delete('/:productId', [authJwt.verifyToken, authJwt.isCompanyDelete], productController.deleteProduct);
router.delete('/admin/:productId', [authJwt.verifyToken, authJwt.isAdmin], productController.deleteProduct);

module.exports = router;