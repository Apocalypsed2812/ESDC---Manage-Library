const path = require('path')
const express = require('express');
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

app = express()

const route = require('./routes')

const db = require('./config/db');
const email = require('./send_email.js')
//const { devNull } = require('os');
const helpers = require("./util/handlebars_helpers.js")
const credentials = require('./config/credentials');
const flash = require('express-flash');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')))

//Template emgine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: helpers
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources','views'))

app.use(cookieParser((credentials.cookieSecret)))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}))

app.use(flash())

//Routes init
route(app);

//Connect to db
db.connect();

//Send Email
email.main();

port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})