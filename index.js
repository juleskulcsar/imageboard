const express = require("express");
const app = (exports.app = express());
const db = require("./utils/db");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const config = require("./config");

// Vue.use(require("vue-moment"));

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));
app.use(express.static("styles"));
app.use("/favicon.ico", (req, res) => res.sendStatus(404));
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(require("body-parser").json());

app.get("/images", function(req, res) {
    db.getImages()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    const url = config.s3Url + req.file.filename;
    db.addNewUpload(
        url,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then(results => {
            res.json(results.rows[0]);
        })
        .catch(err => {
            console.log("error in POST /upload; ", err);
        });
    // res.json({
    //     file: req.file.filename //this is the url
    // });
});

app.get("/singleImage", function(req, res) {
    // console.log("req.body console: ", req.body);
    db.getImageById(req.query.id)
        .then(data => {
            // console.log("getting the id: ", req.query.id);
            res.json(data.rows);
            // console.log("data.rows console: ", data.rows);
        })
        .catch(err => {
            console.log("err in GET /images: ", err);
        });
});

app.post("/comments", (req, res) => {
    console.log("comment stuff: ", req.body.commenter, req.body.comment);
    db.postComment(req.body.image_id, req.body.commenter, req.body.comment)
        .then(data => {
            res.json({
                recentComment: data.rows[0]
            });
        })
        .catch(err => {
            console.log("err in POST /comment: ", err);
        });
});

app.get("/comments", (req, res) => {
    // console.log("get comment by id: ", req.query.id);
    db.getComment(req.query.id)
        .then(data => {
            res.json({
                comments: data.rows
            });
        })
        .catch(err => {
            console.log("err in GET /comments: ", err);
        });
});

app.get("/moreimages/:id", (req, res) => {
    db.getMoreImages(req.params.id)
        .then(data => {
            res.json({
                images: data.rows
            });
        })
        .catch(function(err) {
            console.log("Error in GET /moreimages: ", err);
        });
});

app.listen(8080, () => console.log("It's Britney, bitch!"));
