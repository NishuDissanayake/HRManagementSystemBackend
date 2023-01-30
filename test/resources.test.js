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

});
