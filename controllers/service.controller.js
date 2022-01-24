const Service = require('../models/service.model');

module.exports.getAll = (req, res, next) => {
    Service.find({}, (err, service) => {
        if(err) return res.status(411).json({ "err": err });
        if(service.length === 0) return res.status(502).json({ "message": "services is empty" });
        return res.status(200).json({ "services": service })
    })
}

module.exports.create = (req, res, next) => {
    if(!req.body.title) return res.status(411).json({ "err": "Title is required" })
    if(!req.body.description) return res.status(411).json({ "err": "Description is required" })
    if(!req.body.term) return res.status(411).json({ "err": "Term is required" })
    if(!req.body.priceLevel) return res.status(411).json({ "err": "Price Level is required" })
    
    let service = new Service({
        title: req.body.title,
        description: req.body.description,
        term: req.body.term,
        priceLevel: req.body.priceLevel,
        details: req.body.details
    })

    service.save((err, service) => {
        if(err) return res.status(411).json({ "err": err });
        console.log(service);
        res.status(200).json({ "message": service });
    })
}