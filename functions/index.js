const { onCall } = require("firebase-functions/v2/https");   // v2 callable trigger
const logger = require("firebase-functions/logger");
const paypal = require("@paypal/paypal-server-sdk");

// Initialise PayPal client (Sandbox for testing)
const client = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Create order
exports.createPayPalOrder = onCall(async (data) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      { amount: { currency_code: "USD", value: data.amount } }
    ]
  });
  const res = await client.execute(request);
  logger.info("Order created", { orderID: res.result.id });
  return { orderID: res.result.id };
});

// Capture order
exports.capturePayPalOrder = onCall(async (data) => {
  const request = new paypal.orders.OrdersCaptureRequest(data.orderID);
  request.requestBody({});
  const res = await client.execute(request);
  logger.info("Order captured", { captureID: res.result.id });
  return { captureID: res.result.purchase_units[0].payments.captures[0].id };
});
