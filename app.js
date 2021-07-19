const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const bodyParser = require('body-parser')
const express = require('express');
const config = require('config');
const admin = require('firebase-admin')

const serviceAccount = require("./serviceAccountKey.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tickets-ae4ed-default-rtdb.europe-west1.firebasedatabase.app'
})

const csrfMiddleware = csrf({ cookie: true })

const PORT = config.get('port') || 5000;
const app = express();

// app.engine('html', require('ejs').renderFile)
//app.use(express.static("static")) // - ?

app.use(bodyParser.json())  // - есть ли разница между bodyParser и express.json
// app.use(express.json({extended: true}))
app.use(cookieParser());
app.use(csrfMiddleware)

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

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

app.post(
    '/register',
    async (req, res) => {
    try {
        console.log(req.body)
        const idToken = req.body.idToken.toString();
  
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
  
        admin
        .auth()
        .createSessionCookie(idToken, {expiresIn})
        .then(
          (sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true}
            res.cookie('session', sessionCookie, options);
            res.end(JSON.stringify({status: "ура"}))
          }
        )
      } catch (error) {
        console.log(e.message)
        res.status(500).json({ message: 'Что-то пошло не так при входе в систему, попробуйте снова' })
      }
    }
)