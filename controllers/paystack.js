/**
 * controllers - paystack controller
 *
 * Creates a new paystack instance
 * from the body request recieved
 * and connects with a authenticated user
 * adds the created message to the database
 *
 * An express router (paystackRouter) that routes to a /article endpoints
 */

const paystackRouter = require('express').Router();
// const request = require('request');
const { userExtractor } = require('../utils/middleware');
const https = require('https');

// const { initializePayment, verifyPayment } =
//   require('../utils/paystack')(request);

paystackRouter.get('/', async (req, res) => {
  res.send('Hello from PAYSTACK');
});

paystackRouter.post('/', userExtractor, async (req, res) => {
  const { plan } = req.body;
  const user = req.user;

  if (!user) {
    res.status(400).json({
      error: 'Unauthorized request',
    });
  }

  try {
    // form data
    const formData = JSON.stringify({
      email: user.email,
      fullname: user.fullname,
      amount: plan,
    });

    // options
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    // client request to paystack API
    const clientReq = https
      .request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => {
          data += chunk;
        });
        apiRes.on('end', () => {
          // console.log(JSON.parse(data));
          return res.status(200).json(data);
        });
      })
      .on('error', (error) => {
        console.error(error);
      });
    clientReq.write(formData);
    clientReq.end();
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).json({ error: 'Paystack error' });
  }
});

module.exports = paystackRouter;
