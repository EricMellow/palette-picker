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
    beforeEach(function (done) {
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

    it('should create a new project', done => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          name: 'Test'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('projectId')
          response.body.projectId.should.equal(2)
          done();
        })
    });

    it('should not create a new project if a project already exists with that name', done => {
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          name: 'Mayhem'
        })
        .end((error, response) => {
          response.should.have.status(304);
          response.body.should.be.a('object');
          // response.body.should.have.property('error')
          // response.body.error.should.equal('Project name already exists.')
          done();
        })
    });
  });

  describe('GET /api/v1/projects', () => {
    beforeEach(function (done) {
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

    it('should return an array of projects', done => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200)
        response.body.should.be.a('array')
        response.body.length.should.equal(1);
        response.body[0].should.have.a.property('name')
        response.body[0].name.should.equal('Mayhem')
        done()
      })
    });
  });

  describe('POST /api/v1/palettes', () => {
    beforeEach(function (done) {
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

    it('should create a new palette', done => {
      chai.request(server)
        .post('/api/v1/palettes')
        .send({
          name: 'First Palette',
          color1: 'rgba(1, 2, 3)',
          color2: 'rgba(2, 3, 4)',
          color3: 'rgba(3, 4, 5)',
          color4: 'rgba(4, 5, 6)',
          color5: 'rgba(9, 8, 7)',
          projectName: 'Mayhem'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('paletteId')
          response.body.paletteId.should.equal(3)
          done();
        })
    });
    });
  
  describe('GET /api/v1/palettes', () => {
    beforeEach(function (done) {
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

    it('should return an array of palettes', done => {
      chai.request(server)
        .get('/api/v1/palettes')
        .end((error, response) => {
          response.should.have.status(200)
          response.body.should.be.a('array')
          response.body.length.should.equal(2);
          response.body[0].should.have.a.property('name')
          response.body[0].name.should.equal('First Palette')
          response.body[0].should.have.a.property('color1')
          response.body[0].color1.should.equal('rgba(1, 2, 3)')
          response.body[0].should.have.a.property('color2')
          response.body[0].color2.should.equal('rgba(2, 3, 4)')
          response.body[0].should.have.a.property('color3')
          response.body[0].color3.should.equal('rgba(3, 4, 5)')
          response.body[0].should.have.a.property('color4')
          response.body[0].color4.should.equal('rgba(4, 5, 6)')
          response.body[0].should.have.a.property('color5')
          response.body[0].color5.should.equal('rgba(9, 8, 7)')
          response.body[0].should.have.a.property('project_id')
          response.body[0].project_id.should.equal(1)
          done()
        })
    });
  });



  })
