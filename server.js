const config = require('config');
const express = require('express');
const session = require('express-session');
const cors = require("cors");
const path = require('path');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const chalk = require('chalk');

const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const http = require('http');
const https = require('https');
const fs = require('fs');

const key = fs.readFileSync('./ssl/server.key', 'utf8');
const crt = fs.readFileSync('./ssl/server.crt', 'utf8');

const credentials = { key, cert: crt };

const whitelist = config.WHITELIST_DOMAINS
    ? config.WHITELIST_DOMAINS.split(",")
    : []

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

const app = express();

require('./config/db');

const serverLog = (req, res, next) => {
    if(process.env.NODE_ENV !== 'production') {
        let method = req.method === "POST" ? chalk.blue(`[${req.method}]`) : chalk.green(`[${req.method}]`);
        let msg = chalk.gray(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]`)
            + method
            + `: ${req.originalUrl}`;
        console.log(msg);
        // next();
    }
    next();
}

if(process.env.NODE_ENV !== 'production') {
    app.use(cors(corsOptions));
    app.use(serverLog);
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(session({
    secret: config.SECRET_KEY,
    maxAge: new Date(Date.now() + 3600000),
    store: MongoStore.create({ mongoUrl: "mongodb://" + config.db.host + "/" + config.db.database}),
}));

const PORT = process.env.PORT || config.PORT || 3010;

const DocumentRouter = require('./routes/document.router');
const FaqRouter = require('./routes/faq.router');
const ServiceRouter = require('./routes/service.router');
const ProjectRouter = require('./routes/project.router');
const BidRouter = require('./routes/bid.router');
const UserRouter = require('./routes/user.router');

const ApiRouter = express.Router();

ApiRouter.use('/document', DocumentRouter);
ApiRouter.use('/faq', FaqRouter);
ApiRouter.use('/service', ServiceRouter);
ApiRouter.use('/project', ProjectRouter);
ApiRouter.use('/bid', BidRouter);
ApiRouter.use('/user', UserRouter);

// app.all('*', csrf({ cookie: true }), function (req, res) {
//     res.cookie('XSRF-TOKEN', req.csrfToken())
// })

app.use('/api', ApiRouter)

app.use('/', serveStatic(path.join(__dirname, '/client/index.html')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'))
})

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/client/index.html'))
// })

// app.listen(PORT, () => {
//     console.log(`Server listen on http://localhost:${PORT}/`);
// })

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT);
httpsServer.listen(8443);