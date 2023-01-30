const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');

chai.use(chaiHttp);


describe('Projects Test Collection!', () => {

    it('Test projects POST operation: ', (done) => {

        chai.request(server)
        .get('/projects/all')
        .end((err, res) => {
            res.should.have.status(200); 
            res.body.should.be.a('array');
            done();
        });
    });

    it('Test projects GET operation: ', (done) => {

        chai.request(server)
        .get('/projects/all')
        .end((err, res) => {
            res.should.have.status(200); 
            res.body.should.be.a('array');
            // const myVal = res.body.message;
            // expect(myVal).to.be.equal('Message specified in the index.js');
            done();
        });
    });

});
