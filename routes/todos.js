var express = require('express');
var router = express.Router();

var pg = require('pg');
var conString;

var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
    conString = 'postgres://yangzai@localhost/tododb'
} else if ('production' === env) {
    conString = process.env.DATABASE_URL
}


router.route('/')
.get(function (req, res) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            console.error('could not connect to postgres', err);
            return res.status(500).end();
        }
        client.query('SELECT name, todo FROM users, todos WHERE id = user_id ORDER BY timestamp DESC;',  function(err, result) {
            if(err) {
                console.error('error running query', err);
                return res.status(500).end();
            }

            var body = []
            result.rows.forEach(function (element) {
                body.push({todo: element.todo, name: element.name})
                
            });

            res.json(body);
            done();
        });
    });
})
.post(function (req, res) { // insertion duplicates?
    pg.connect(conString, function(err, client, done) {
        if(err) {
            console.error('could not connect to postgres', err);
            return res.status(500).end();
        }    
        if (!req.body.name || !req.body.todo) {
            return res.status(400).send('Malform request.');
        }
        
        client.query('SELECT id from users WHERE name = $1;', [req.body.name], function (err, result) {
            if(err) {
                console.error('error running query', err);
                return res.status(500).end();
            }

            if (!result.rows.length) {
                client.query('INSERT INTO users VALUES(DEFAULT, $1) RETURNING id;', [req.body.name], function(err, result) {
                    if(err) {
                        console.error('error running query', err);
                        return res.status(500).end();
                    }
                    pgInsertIntoTodoAndFinish(client, done, res, result.rows[0].id, req.body.todo);
                });
            } else {
                pgInsertIntoTodoAndFinish(client, done, res, result.rows[0].id, req.body.todo);
            }            
        });
    });
})
.delete(function (req, res) { // task not exist?
    pg.connect(conString, function(err, client, done) {
        if(err) {
            console.error('could not connect to postgres', err);
            return res.status(500).end();
        }    
        if (!req.body.name || !req.body.todo) {
            return res.status(400).send('Malform request.');
        }
        
        client.query('SELECT name, todo FROM users, todos WHERE name = $1;', [req.body.name], function (err, result) {
            if(err) {
                console.error('error running query', err);
                return res.status(500).end();
            }

            if (!result.rows.length) {
                client.query('INSERT INTO users VALUES(DEFAULT, $1) RETURNING id;', [req.body.name], function(err, result) {
                    if(err) {
                        console.error('error running query', err);
                        return res.status(500).end();
                    }
                    pgDeleteFromTodoAndFinish(client, done, result.rows[0].id, req.body.todo);
                });
            } else {
                pgDeleteFromTodoAndFinish(client, done, result.rows[0].id, req.body.todo);
            }            
        });
    });
});

router.route('/:user') //name not id
.get(function (req, res) {
        pg.connect(conString, function(err, client, done) {
        if(err) {
            console.error('could not connect to postgres', err);
            return res.status(500).end();
        } 
        client.query('SELECT name, todo FROM users, todos WHERE name = $1 AND id = user_id ORDER BY timestamp DESC;'
                     , [req.params.user],  function(err, result) {
            if(err) {
                console.error('error running query', err);
                return res.status(500).end();
            }
            var body = []
            result.rows.forEach(function (element) {
                body.push({todo: element.todo, name: element.name})
                
            });

            res.json(body);
            done();
        });
    });
});

module.exports = router;

//
function pgInsertIntoTodoAndFinish(client, done, res, userId, todo) {
    client.query('INSERT INTO todos VALUES($1, $2)', [userId, todo], function(err, result) {
        if(err) {
            console.error('error running query', err);
            
            if (err.code == 23505) //unique violation
                return res.status(400).send('Task already exist.');

            return res.status(500).end();
        }
        res.status(200).end();
        done();
    });
}

function pgDeleteFromTodoAndFinish(client, done, res, userId, todo) {
    client.query('DELETE FROM todos WHERE user_id = $1 AND todo = $2', [userId, todo], function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        res.status(200).end();
        done();
    });
}