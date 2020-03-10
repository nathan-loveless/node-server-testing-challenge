const db = require('./db.js');
const request = require('supertest');
const server = require('../server');

describe('Profiles Methods', () => {
    afterAll(async () => {
        await db.migrate.rollback();
            await db.migrate.latest();
            await db.seed.run();
        })

    describe('db-router calls', () => {
        describe('GET Methods', () => {
            it('Should return a length of 9', async() => {
                const res = await request(server).get('/api/posts');
                expect(res.body.length).toBe(9);
                
            })


            it('Should return status 200 (OK)', async() => {
                const res = await request(server).get('/api/posts');
                expect(res.status).toBe(200); 
            })

            it('Should return a length of 9', async() => {
                const res = await request(server).get('/api/posts/1');
                expect(res.body).toEqual([
                    {
                        id: 1,
                        title: "I wish the ring had never come to me. I wish none of this had happened.",
                        contents: "Guess who said this",
                        created_at: "2020-03-10 14:49:17",
                        updated_at: "2020-03-10 14:49:17"
                    }
                ]);                
            })

            it('Should return status 200 (OK)', async() => {
                const res = await request(server).get('/api/posts/1');
                expect(res.status).toBe(200); 
            })
        })
        describe('POST Methods', () => {
            it('Should post and return the object and suceed status', async() => {
                const data = {                    
                    title: "I never had the ring.",
                    contents: "I didn't say hi",
                    created_at: "2020-03-10 14:49:17",
                    updated_at: "2020-03-10 14:49:17"
                }

                const res = await request(server).post('/api/posts').send(data)
                expect(res.body.success).toEqual(true);
            })

            it('Should post and return failure message', async() => {
                const data = {                    
                    contents: "I didn't say hi",
                    created_at: "2020-03-10 14:49:17",
                    updated_at: "2020-03-10 14:49:17"
                }

                const res = await request(server).post('/api/posts').send(data)
                expect(res.body.success).toEqual(false);
            })




            it('Should post and return the comment object and suceed status', async() => {
                const data = {                    
                    "text": "This is horrible",
                    "post_id": 1,
                    "created_at": "2020-03-10 14:49:17",
                    "updated_at": "2020-03-10 14:49:17",
                }

                const res = await request(server).post('/api/posts/1/comments').send(data)
                expect(res.body.success).toEqual(true);
            })

            it('Should post and return a 404 message', async() => {
                const data = {                    
                    contents: "I didn't say hi",
                    created_at: "2020-03-10 14:49:17",
                    updated_at: "2020-03-10 14:49:17"
                }

                const res = await request(server).post('/api/posts/44/comments').send(data)
                expect(res.status).toBe(404);
            })
        })

        describe('PUT Requests', () => {            
            const data = {
                title: "I wish the ring had never come to me. I wish none of this had happened.",
                contents: "Guess who said this",
                created_at: "2020-03-10 14:49:17",
                updated_at: "2020-03-10 14:49:17"
            }

            it('Should return the object', async() => {
                
                const res = await request(server).put('/api/posts/1').send(data);
                expect(res.status).toBe(200);
            })

            it('Should return a 404 error', async() => {
                res = await request(server).put('/api/posts/1').send({created_at: "2020-03-10 14:49:17",
                updated_at: "2020-03-10 14:49:17"});
                expect(res.status).toBe(400);                
            })
        })

        describe('DELETE reqeusts', () => {
            it('Should delete the object and return 1', async() => {
                
                const res = await request(server).delete('/api/posts/1');
                expect(res.body).toBe(1);
            })

            it('Should return a 404 error', async() => {
                res = await request(server).delete('/api/posts/44');
                expect(res.status).toBe(404);                
            })

        })
    })
})