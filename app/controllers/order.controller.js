const db = require('../models');
const Order = db.order;


exports.createOrder = (req, res) => {
  // Extract order details from the request body
  const { userName, roomNumber, cart, companyId } = req.body;

  // Create the order in the database
  Order.create({
    userName: userName,
    roomNumber: roomNumber,
    products: cart,
    status: 'pending',
    payment: 'unpaid',
    companyId: companyId,
  })
    .then((order) => {
      // Send a response with the created order
      res.status(201).json(order);
    })
    .catch((error) => {
      // Handle errors and send an error response
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order' });
    });
};


exports.getOrdersByCompany = (req, res) => {
    // Retrieve orders for the current company
    Order.find({ companyId: req.companyId }, (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving orders', error: err });
        }
        res.status(200).json(orders);
    });
};

exports.updateOrderStatus = (req, res) => {
    const { orderId, status } = req.body;

    // Update the status of the order in the database
    Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true },
        (err, order) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating order status', error: err });
            }
            res.status(200).json(order);
        }
    );
};

exports.deleteOrder = (req, res) => {
    const orderId = req.params.orderId;

    // Delete the order from the database
    Order.findByIdAndRemove(orderId, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting order', error: err });
        }
        res.status(204).send();
    });
};

exports.confirmPayPalPayment = (req, res) => {
    const { orderId, paymentId } = req.body;
  
    // Check if orderId and paymentId are provided
    if (!orderId || !paymentId) {
      return res.status(400).json({ message: 'Both orderId and paymentId are required.' });
    }
  
    // Update the payment status of the order in the database
    Order.findByIdAndUpdate(
      orderId,
      { payment: 'paid' }, // Update payment status to 'paid' (or your desired status)
      { new: true },
      (err, order) => {
        if (err) {
          console.error('Error updating payment status:', err);
          return res.status(500).json({ message: 'Error updating payment status', error: err });
        }
  
        if (!order) {
          return res.status(404).json({ message: 'Order not found.' });
        }
  
        res.status(200).json(order);
      }
    );
  };