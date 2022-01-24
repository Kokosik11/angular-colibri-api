const Document = require('../models/document.model');

module.exports.getAll = (req, res, next) => {
    Document.find({}, (err, documents) => {
        if(err) return res.status(411).json({ err });
        if(documents.length === 0) return res.status(502).json({ "message": "documents is empty" });
        return res.status(200).json({ documents })
    })
}


module.exports.create = (req, res, next) => {
    if(!req.body.title) return res.status(411).json({ "err": "Title is required" });
    if(!req.files['document'][0]) return res.status(411).json({ "err": "Document is required" });
    if(!req.files['prev-screen'][0]) return res.status(411).json({ "err": "Prev screen is required" });
    if(!req.files['document-icon'][0]) return res.status(411).json({ "err": "Document icon is required" });

    let _document = new Document({
        title: req.body.title,
        documentURL: req.files['document'][0].path.replace("static", ""),
        prevURL: req.files['prev-screen'][0].path.replace("static", ""),
        documentIconURL: req.files['document-icon'][0].path.replace("static", ""),
    })

    _document.save((err, _doc) => {
        if(err) return res.status(411).json({ "err": err });
        console.log(_doc);
        res.status(200).json({ "message": _doc });
    })
}


