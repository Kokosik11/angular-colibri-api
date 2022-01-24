const Faq = require('../models/faq.model');

module.exports.getAll = (req, res, next) => {
    Faq.find({}, (err, faq) => {
        if(err) return res.status(411).json({ "err": err });
        if(faq.length === 0) return res.status(502).json({ "message": "Faq's is empty" });
        return res.status(200).json({ "faq": faq })
    })
}

module.exports.create = (req, res, next) => {
    if(!req.body.quest) return res.status(411).json({ "err": "Quest is required" })
    if(!req.body.answer) return res.status(411).json({ "err": "Answer is required" })
    
    let faq = new Service({
        title: req.body.title,
        answer: req.body.answer,
    })

    faq.save((err, faq) => {
        if(err) return res.status(411).json({ "err": err });
        console.log(faq);
        res.status(200).json({ "message": faq });
    })
}