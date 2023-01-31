const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');
const resources = require('../models/Resources');

chai.use(chaiHttp);

before((done) => {
    resources.deleteMany({}, function (err) { });
    done();
})

describe('Resources Test Collection!', () => {

    it('Verify Rsources are initially 0: ', (done) => {

        chai.request(server)
            .get('/resources/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });

    it('Test resources POST operation: ', (done) => {

        let resource= {
            Email: 'test@testmail.com',
            ResourcesType: 'Software',
            ResourcesName: 'Redmine permission',
            Description: 'Added to selected workspaces',
            IssuedDate: '2022-02-12',
            Status: 'Active',
        }

        chai.request(server)
            .post('/resources/add')
            .send(resource)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Test resources GET operation: ', (done) => {

        chai.request(server)
            .get('/resources/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                // const myVal = res.body.message;
                // expect(myVal).to.be.equal('Message specified in the index.js');
                done();
            });
    });

    it('Verify resources are now 1: ', (done) => {

        chai.request(server)
            .get('/resources/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('Add 1 more record for filtering: ', (done) => {

        let resource= {
            Email: 'test2@testmail.com',
            ResourcesType: 'Hardware',
            ResourcesName: 'Mouse',
            Description: 'Logitech wireless',
            IssuedDate: '2022-02-14',
            Status: 'Not returned',
        }

        chai.request(server)
            .post('/resources/add')
            .send(resource)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Test Software resources GET by email operation: ', (done) => {

        chai.request(server)
            .get('/resouces/software/by-email?email=test@testmail.com')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('Test Hardware resources GET by email operation: ', (done) => {

        chai.request(server)
            .get('/resouces/hardware/by-email?email=test2@testmail.com')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('Test Hardware resources GET all operation: ', (done) => {

        chai.request(server)
            .get('/resouces/software/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

    it('Test Hardware resources GET all operation: ', (done) => {

        chai.request(server)
            .get('/resouces/hardware/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

});
