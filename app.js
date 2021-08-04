const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

require('@firebase/firestore')

const PORT =  5000;

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/admin', require('./routes/admin.routes'))
app.use('/api/movie', require('./routes/movie.routes'))

async function start () {
  try {
      app.listen(PORT, ()=>{
          console.log(`Server has been started on port ${PORT}...`)
      })
  } catch (e) {
      console.log('Server error', e.message);
      process.exit(1) //"code": 1 - выход из сервера
  }
}

start();

app.get('/', (req, res) => {
  return res.send('hello server')
})
