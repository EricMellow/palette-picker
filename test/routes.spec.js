const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('CLIENT routes', () => {
  
  it('should receive a response of a string when we hit the root endpoint', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      })
  })

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/sad')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
  })

})

describe('API routes', () => {
  describe('POST /api/v1/projects', () => {
    before(function (done) {
      knex.migrate.rollback()
        .then(function () {
          knex.migrate.latest()
            .then(function () {
              return knex.seed.run()
                .then(function () {
                  done();
                });
            });
        });
    });

    it('should create a new project', () => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          name: 'Test'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('name')
          response.body.lastname.should.equal('Test')
          done();
        })
    });

    it('should not create a new project if a project already exists with that name', () => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          name: 'Mayhem'
        })
        .end((error, response) => {
          response.should.have.status(304);
          response.body.should.be.a('object');
          response.body.should.have.property('error')
          response.body.lastname.should.equal('Project name already exists.')
          done();
        })
    });
  });

  
  })
