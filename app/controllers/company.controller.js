const db = require('../models');
const Company = db.company;

// Update a company by ID
exports.updateCompany = (req, res) => {
  const companyId = req.params.companyId;

  // Update the company details
  Company.update(req.body, {
    where: { id: companyId }
  })
    .then(() => {
      res.status(200).send({ message: 'Company updated successfully.' });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error updating company.' });
    });
};

// Delete a company by ID
exports.deleteCompany = (req, res) => {
  const companyId = req.params.companyId;

  // Delete the company
  Company.destroy({
    where: { id: companyId }
  })
    .then(() => {
      res.status(200).send({ message: 'Company deleted successfully.' });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error deleting company.' });
    });
};

exports.getCompanyById = (req, res) => {
    const companyId = req.params.companyId;
  
    Company.findByPk(companyId)
      .then((company) => {
        if (!company) {
          return res.status(404).send({ message: 'Company not found.' });
        }
  
        res.status(200).send(company);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ message: 'Error retrieving company.' });
      });
  };