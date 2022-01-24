const Bid = require('../models/bid.model');
const express = require('express');
const config = require('config');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

module.exports.getAll = (req, res, next) => {
    Bid.find({}, (err, bid) => {
        if(err) return res.status(411).json({ "err": err });
        if(bid.length === 0) return res.status(200).json({ "bids": "projects is empty" });
        return res.status(200).json({ "projects": bid })
    })
}


module.exports.create = (req, res, next) => {
    if(!req.body.email) return res.status(411).json({ "err": "email is required" })
    if(!req.body.username) return res.status(411).json({ "err": "Username is required" })
        
    let bidTg = [
        '*** Опа, заявочка:',
        '<b>Email:</b> ' + req.body.email,
        '<b>Username:</b> ' + req.body.username,
    ]

    let msg = '';

    bidTg.forEach(field => {
        msg += field + '\n';
    })

    msg = encodeURI(msg);

    fetch(`https://api.telegram.org/bot${config.bot.TG_TOKEN}/sendMessage?chat_id=${config.bot.CHANNEL_ID}&parse_mode=html&text=${msg}`, {  
    //не забываем обработать ответ
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
    })

    let bid = new Bid({
        username: req.body.username,
        email: req.body.email,
    })

    bid.save((err, bid) => {
        if(err) return res.status(411).json({ "err": err });
        console.log(bid);
        res.status(200).json({ "message": bid });
    })
}

module.exports.csrfToken = (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    res.status(200).json({ csrf: req.csrfToken() });
}