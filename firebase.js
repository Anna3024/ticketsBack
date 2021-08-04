const firebase = require('firebase')

require('dotenv/config')

const { API_KEY, PROJECT_ID, DATABASE_URL, AUTH_DOMAIN } = process.env

const configFB = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID
}

firebase.initializeApp(configFB)

module.exports = firebase.firestore()