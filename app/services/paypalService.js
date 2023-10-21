// paypalService.js

const paypal = require('@paypal/checkout-server-sdk');
const paypalConfig = require('../config/paypalConfig');

// Initialize PayPal SDK with credentials
const environment = new paypal.core.SandboxEnvironment(
  paypalConfig.clientId,
  paypalConfig.clientSecret
);

const client = new paypal.core.PayPalHttpClient(environment);

// Create a PayPal order
async function createOrder(orderDetails) {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody(orderDetails);

    const response = await client.execute(request);
    return response.result.id; // Return the order ID
  } catch (error) {
    throw error;
  }
}

// Capture a PayPal payment
async function capturePayment(orderId) {
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  capturePayment,
};
