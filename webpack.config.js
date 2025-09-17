const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // Define Firebase environment variables that can be accessed in the browser
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY || ''),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN || ''),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID || ''),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET || ''),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID || ''),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID || '')
    })
  ]
};