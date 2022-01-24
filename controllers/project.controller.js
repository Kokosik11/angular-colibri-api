const Project = require('../models/project.model');

module.exports.getAll = (req, res, next) => {
    Project.find({}, (err, project) => {
        if(err) return res.status(411).json({ "err": err });
        if(project.length === 0) return res.status(502).json({ "message": "projects is empty" });
        return res.status(200).json({ "projects": project })
    })
}


module.exports.create = (req, res, next) => {
    if(!req.body.title) return res.status(411).json({ "err": "Title is required" })
    if(!req.body.link) return res.status(411).json({ "err": "Link is required" })
    if(!req.file) return res.status(411).json({ "err": "File is required"})
   
    let project = new Project({
        title: req.body.title,
        link: req.body.link,
        imageURL: req.file.path.replace("static", ""),
    })

    project.save((err, project) => {
        if(err) return res.status(411).json({ "err": err });
        console.log(project);
        res.status(200).json(project);
    })
}

module.exports.getById = async (req, res) => {
    try {
        let project = await Project.findById({ _id: req.params.id })
        res.status(200).json(project);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error"})
    }
}

module.exports.getByIdAndUpdate = async (req, res) => {
    let updated = {
        title: req.body.title,
        link: req.body.link,
    }

    if(req.file) {
        updated.imageURL = req.file.path.replace('static', '')
    }
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id },
            { $set: updated },
            { new: true }
        )

        return res.status(201).json(project);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error"})
    }
}

module.exports.remove = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findByIdAndRemove({ _id: id });
        console.log(project);
        return res.status(200).json({ message: "Project was deleted"});

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error"})
    }
}