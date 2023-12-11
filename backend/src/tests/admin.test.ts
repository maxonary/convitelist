// // src/tests/admin.test.ts
// import { describe, expect, it } from 'vitest'
// import request from 'supertest'
// import app from '../lib/createServer'
// import prisma from './helpers/prisma'

// describe('/auth', async () => {
//     describe('POST /api/admin/register', async () => {
//         it('should respond with a `200`status code and user details', async () => {
//             // generate invitation code first and get the code
//             const invitationResponse = await request(app).post('/api/invitation/generate-invitation-code').send()
//             expect(invitationResponse.body.code).not.toBeNull()
//             const invitationCode = invitationResponse.body.code

//             const { body, status } = await request(app).post('/api/admin/register').send({
//                 username: 'testuser',
//                 password: 'testpassword',
//                 email: 'test@mail.com',
//                 invitationCode: invitationCode
//             })
//             const createAdminUser = prisma.admin.findFirst()

//             expect(status).toBe(200)
//             expect(createAdminUser).not.toBeNull()
//             expect(body).toStrictEqual({
//                 username: 'testuser',
//                 email: 'test@mail.com',
//                 id: createAdminUser.id
//             })

//         })
//     })
// })