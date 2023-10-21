const db = require('../models');
const Product = db.product;


exports.createProduct = (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  console.log('Request File:', req.file); // Log the request file (image)
  const { name, description, price, companyId } = req.body; // Extract fields from req.body
  const productImage = req.file; // Extract the uploaded image from req.file

  if (!companyId) {
    return res.status(400).json({ message: 'companyId is required in the request body' });
  }


  Product.create({
    name: name,
    description: description,
    price: parseFloat(price),
    companyId: companyId,
    image: productImage.filename, // Store the image filename in the database
  })
    .then((product) => {
      res.status(201).json(product);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get all products of a specific company
exports.getProductsByCompany = (req, res) => {
  const companyId = req.params.companyId;

  Product.findAll({
    where: { companyId: companyId },
  })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
exports.getProductById = (req, res) => {
    const productId = req.params.productId;
  
    Product.findByPk(productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  };
  
  // Update a product by ID (only accessible by the company that owns the product)
  exports.updateProduct = (req, res) => {
    const productId = req.params.productId;
    const companyId = parseInt(req.query.companyId, 10) || req.userId;
    // console.log(req)
    Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      console.log(product.companyId, companyId);
      
        // Check if the authenticated company owns this product
        if (product.companyId !== companyId) {
          return res.status(403).json({ message: 'Permission denied' });
        }
  
        // Update the product
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
  
        product
          .save()
          .then(() => {
            res.json(product);
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  };
  
  // Delete a product by ID (only accessible by the company that owns the product)
  exports.deleteProduct = (req, res) => {
    const productId = req.params.productId;
    const companyId = parseInt(req.query.companyId, 10);


    Product.findByPk(productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
  
        console.log(product.companyId)
        // Check if the authenticated company owns this product
        if (product.companyId !== companyId) {
          console.log(product.companyId)
          console.log(companyId == product.companyId);
          return res.status(403).json({ message: 'Permission denied' });
        }
  
        // Delete the product
        product
          .destroy()
          .then(() => {
            res.json({ message: 'Product deleted successfully' });
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  };

module.exports = exports;
