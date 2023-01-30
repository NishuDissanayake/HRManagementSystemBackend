const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');
const projects = require('../models/Projects');

chai.use(chaiHttp);

before((done) => {
    projects.deleteMany({}, function (err) { });
    done();
})

describe('Projects Test Collection!', () => {

    it('Verify Projects are initially 0: ', (done) => {

        chai.request(server)
            .get('/projects/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });

    it('Test projects POST operation: ', (done) => {

        let project = {
            Email: 'test@testmail.com',
            ManagerName: 'NishuD',
            ProjectName: 'Papyrus Documentation',
            ProjectDuration: '5 weeks',
            StartDate: '2022-03-04',
            EndDate: '2022-04-15',
            Status: 'Started',
        }

        chai.request(server)
            .post('/projects/add')
            .send(project)
            .end((err, res) => {
                res.should.have.status(200);
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

    it('Verify Projects are now 1: ', (done) => {

        chai.request(server)
            .get('/projects/all')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
    });

});
