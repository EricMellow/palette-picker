// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palette',
    migrations: {
      directory: '.db/migrations'
    },
    useNullAsDefault: true
  },
};
