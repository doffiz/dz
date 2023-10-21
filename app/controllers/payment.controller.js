const paypal = require('paypal-rest-sdk');
const paypalConfig = require('../../config/paypalConfig');
console.log(Object.keys(paypal)); // Log available methods

// Initialize PayPal SDK with your credentials
paypal.configure({
  mode: 'sandbox', // Change to 'live' for production
  client_id: paypalConfig.clientId,
  client_secret: paypalConfig.clientSecret,
});

const initiatePayment = async (req, res) => {
    try {
      // Extract order data from the request (e.g., items, total amount, description)
      const { items, totalAmount, description, companyId } = req.body;
  
      // Create a PayPal payment
      const createPayment = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: 'http://localhost:8081/company/' + companyId,
          cancel_url: 'http://localhost:8081/company/' + companyId,
        },
        transactions: [
          {
            item_list: {
              items: items.map((item) => ({
                name: item.name,
                sku: item.sku,
                price: item.price,
                currency: 'USD', // Change to your desired currency
                quantity: item.quantity,
              })),
            },
            amount: {
              currency: 'USD', // Change to your desired currency
              total: totalAmount,
            },
            description: description,
          },
        ],
      };
  
      // Create a PayPal payment
      paypal.payment.create(createPayment, function (error, payment) {
        if (error) {
          console.error('Error creating PayPal payment:', error);
          res.status(500).json({ error: 'Failed to create PayPal payment' });
        } else {
          // Extract the PayPal payment ID from the response
          const paymentID = payment.id;
  
          // Save the PayPal payment ID to your order in the database
          // Update your order status or add a reference to the PayPal payment ID
  
          // Send the PayPal payment approval URL back to the frontend for further processing
          res.json({ approval_url: payment.links[1].href });
        }
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).json({ error: 'Failed to initiate payment' });
    }
  };
  
// Controller function to create a PayPal order
const createOrder = (req, res) => {
    const { currency, totalAmount, items } = req.body; // Extract order details from the client request
  
    const createOrderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: totalAmount,
          },
          items: items,
        },
      ],

    };
  
    paypal.orders.create(createOrderRequest, (error, order) => {
      if (error) {
        console.error('Error creating PayPal order:', error);
        return res.status(500).json({ error: 'Could not create PayPal order' });
      }
  
      // Return the order ID to the client
      res.json({ orderId: order.id });
    });
  };
  
// Controller function to capture a PayPal payment
const capturePayment = (req, res) => {
  const orderId = req.body.orderId; // Get the order ID from the client request

  // Capture the payment using the order ID
  paypal.orders.capture(orderId, (error, capture) => {
    if (error) {
      console.error('Error capturing PayPal payment:', error);
      return res.status(500).json({ error: 'Could not capture payment' });
    }

    // Payment was successfully captured
    res.json({ status: 'Payment captured successfully' });
  });
};

module.exports = {
  initiatePayment,
  createOrder,
  capturePayment,
};