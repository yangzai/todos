var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://yangzai@localhost:5432/tododb'
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('DROP TABLE users; DROP TABLE todos; \
                     CREATE TABLE users (\
                        id SERIAL PRIMARY KEY, \
                        name TEXT NOT NULL UNIQUE\
                    ); \
                    CREATE TABLE todos (\
                        user_id SERIAL, \
                        todo TEXT NOT NULL, \
                        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
                        PRIMARY KEY(user_id, todo), \
                        FOREIGN KEY(user_id) REFERENCES users(id) \
	                       ON UPDATE CASCADE \
	                       ON DELETE RESTRICT \
                    );');
query.on('end', function() { client.end(); });