const express = require("express");
const app = express();

app.use(express.static("./public"));

let cities = [
    {
        name: "Berlin",
        country: "DE"
    },
    {
        name: "Bucharest",
        country: "RO"
    },
    {
        name: "Budapest",
        country: "HU"
    }
];

app.get("/cities", function(req, res) {
    res.json(cities);
});

//the server;s job now with frameworks is to give our framework (in this case Vue)
//the data it needs to render on screen

//with Multi Page Aplication's the server's job is to figure out what should be renbdered on screen
//in SPA;s the server;s job is to give/post data whenever the framework asks to it. Otherwise the framework is responsible
//for figuring out what should be sgown on screen

app.listen(8080, () => console.log("BAM BAM!"));
