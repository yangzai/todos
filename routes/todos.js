var express = require('express');
var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res) {
//  //res.send('respond with a resource');
//    res.json({todo: "feed the cat.", name: "bob"});
//});

router.route('/')
.get(function (req, res) {
    res.json({todo: "feed the cat.", name: "bob"});
})
.post(function (req, res) {
    console.dir(req.body);
    res.send(req.body);
});

router.route('/:user')
.get(function (req, res) {
    res.json({todo: "feed the cat.", name: "bob"});
})
.post(function (req, res) {
    console.dir(req.body);
    res.send(req.body);
});
module.exports = router;
