// Update with your config settings.

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/palette',
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/dev'
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://localhost/palette',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
};
