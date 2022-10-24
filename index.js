require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const {cookieJwtAuth} = require('./middleware/cookies.middleware');
const errorHandler = require('./middleware/error.middleware');
const {router: authRoutes, basePath: authBasePath} = require('./routes/auth');
const {router: radiographyRoutes, basePath: radiographyBasePath} = require('./routes/radiographies');
const {router: userRoutes, basePath: userBasePath} = require('./routes/users');
const fs = require('fs')

// SETTINGS
app.use(express.static(__dirname + '/views/public'))
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.json());
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

// ROUTES
app.get('/images', (req, res) => {
    fs.readdir('./public/images/1/', (err, files) => {
        files.forEach(file => console.log(file))
    })
})
app.get('/', cookieJwtAuth, () => {});  

app.use(authBasePath, authRoutes);
app.use(radiographyBasePath, radiographyRoutes);
app.use(userBasePath, userRoutes);

app.use((req, res, next) => {
    console.log(req.path);
    next(createError.NotFound());
});

// ERROR HANDLING
app.use(errorHandler);

// STARTING THE SERVER
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));
