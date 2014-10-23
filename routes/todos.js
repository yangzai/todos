var express = require('express');
var router = express.Router();

var pg = require('pg');
var conString;

/* GET users listing. */
//router.get('/', function(req, res) {
//  //res.send('respond with a resource');
//    res.json({todo: "feed the cat.", name: "bob"});
//});

var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
    conString = 'postgres://yangzai@localhost/tododb'
} else if ('production' === env) {
    conString = process.env.DATABASE_URL
}

router.route('/')
.get(function (req, res) {
    
    //db.connect(function(err) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT * FROM todos',  function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            //console.log(result.rows[0].theTime);
            var body = []
            result.rows.forEach(function (element) {
                body.push({todo: element.todo, name: element.name})
                
            });
            //res.send(body)
            console.dir(body)
            res.json(body);
            //res.json(result.rows[0].name)
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
            console.dir("in")
            done();
            //db.end();
        });
    });
    //console.dir(body);
    //res.json(body);
})
.post(function (req, res) { // insertion duplicates?
    console.dir(req.body);
    //db.connect(function(err) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('INSERT INTO todos VALUES($1, $2)', [req.body.name, req.body.todo], function(err, result) {
            if(err) {
                //db.end();
                return console.error('error running query', err);
            }
            //console.log(result.rows[0].theTime);
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
            console.dir("in")
            //db.end();
            done();
        });
    });

    res.send(req.body);
})
.delete(function (req, res) { // task not exist?
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('DELETE FROM todos WHERE name = $1 AND todo = $2', [req.body.name, req.body.todo], function(err, result) {
            if(err) {
                //db.end();
                return console.error('error running query', err);
            }
            //console.log(result.rows[0].theTime);
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
            console.dir("in")
            //db.end();
            done();
        });
    });

    res.send(req.body);
});

router.route('/:user')
.get(function (req, res) {
        pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT * FROM todos', [req.params.user],  function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            //console.log(result.rows[0].theTime);
            var body = []
            result.rows.forEach(function (element) {
                body.push({todo: element.todo, name: element.name})
                
            });
            //res.send(body)
            console.dir(req.params.user)
            res.json(body);
            //res.json(result.rows[0].name)
            //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
            console.dir("in")
            done();
            //db.end();
        });
    });
    //res.json({todo: "feed the cat.", name: "bob"});
});
//.post(function (req, res) {
//    console.dir(req.body);
//    res.send(req.body);
//});
module.exports = router;
