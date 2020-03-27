var express = require('express');
var app = express();
var fs = require("fs");

var shop = {
    "shop4" : {
        "id" : 4,
        "name" : "Albert's Fish and Chips",
        "street_address" : "42 Queensberry St",
        "suburb" : "Carlton",
        "postcode" : "3053"
    }
}

app.get('/listShops', function (req, res) {
    fs.readFile(__dirname + "/" + "testdata/shops.json", 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
});

app.get('/:id', function (req, res) {
    // Check existing shops
    fs.readFile(__dirname + "/testdata/shops.json", 'utf8', function (err, data) {
        var shops = JSON.parse(data);
        var shop = shops["shop" + req.params.id]
        console.log(shop);
        res.end(JSON.stringify(shop));
    })
})

app.post('/addShop', function (req, res) {
    // Check existing shops
    fs.readFile(__dirname + "/" + "testdata/shops.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        data["shop4"] = shop["shop4"];
        console.log(data);
        res.end(JSON.stringify(data));
    });
});

app.delete('/deleteShop', function (req, res) {
    // Check existing shops
    fs.readFile(__dirname + "/" + "testdata/shops.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        delete data["shop" + 2];
        console.log(data);
        res.end(JSON.stringify(data));
    })
})

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});