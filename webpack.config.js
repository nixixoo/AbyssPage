const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file (for local development)
const env = dotenv.config().parsed || {};

// For Vercel deployment, use process.env directly
// Combine local .env with process.env (process.env takes precedence)
const envVars = {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || env.FIREBASE_APP_ID,
};

// Convert environment variables to webpack define plugin format
const envKeys = Object.keys(envVars).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(envVars[next]);
  return prev;
}, {});

module.exports = {
  plugins: [
    new webpack.DefinePlugin(envKeys)
  ]
};