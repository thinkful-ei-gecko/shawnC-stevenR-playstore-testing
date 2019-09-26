const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../index');

describe('GET /apps', () => {
    it('returns 400 when sort value is invalid', () => {
        return supertest(app)
            .get('/apps')
            .query({
                sort: 'Invalid'
            })
            .expect(400)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body.error).to.equal('Oops, something went wrong...')
            })
    });

    it('returns standard success with no query params', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/) 
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1)
                expect(res.body[0]).to.be.an('object');
                expect(res.body[0]).to.include.keys('App', 'Category', 'Rating')
            })
    });

    it('returns sorted array when App value provided', () => {
        return supertest(app)
            .get('/apps')
            .query({
                sort: 'App'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sortedFlag = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    if (res.body[i].App > res.body[i + 1].App) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sortedFlag).to.be.true;
            })

    });

    it('returns sorted array when Rating value provided', () => {
        return supertest(app)
            .get('/apps')
            .query({
                sort: 'Rating'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sortedFlag = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    if (res.body[i].Rating < res.body[i + 1].Rating) {
                        sortedFlag = false;
                        break;
                    }
                    i++;
                }
                expect(sortedFlag).to.be.true;
            })

    });

    it('returns filtered array of apps when search params provided', () => {
        return supertest(app)
            .get('/apps')
            .query({
                genre: 'action'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let filterFlag = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    if (!res.body[i]['Genres'].includes('Action')) {
                        console.log(res.body[i]['Genres'])
                        filterFlag = false;
                        break;
                    }
                    i++;
                }
                expect(filterFlag).to.be.true;
            })
    });
})