const dotenv =  require('dotenv')
dotenv.config()



const PORT = process.env.PORT;
const HOST = 'https://shadowsell-wpre.onrender.com';
const PAYPAL_KEY_CLIENT=process.env.PAYPAL_KEY_CLIENT;
const PAYPAL_KEY_SECRET=process.env.PAYPAL_KEY_SECRET;
const PAYPAL_API='https://api-m.sandbox.paypal.com'



module.exports = {
  PORT,
  HOST,
  PAYPAL_KEY_CLIENT,
  PAYPAL_KEY_SECRET,
  PAYPAL_API
};
