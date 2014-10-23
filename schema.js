var pg = require('pg')
  , connectionString = process.env.DATABASE_URL || 'postgres://yangzai@localhost:5432/tododb'
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE todos (\
                    name TEXT NOT NULL, \
                    todo TEXT NOT NULL, \
                    PRIMARY KEY(name, todo)\
                    );'
);
query.on('end', function() { client.end(); });