const { sequelize } = require('../db');
const {User, Entry} = require('../models/index');


describe('Test models', () => {
    beforeAll(async () => {
        await sequelize.sync({force: true});
    })


    test('can create user', async () => {
        const newUser1 = await User.create({username: "username1", name: "john doe", "email": "johndoe@example.com"});
        expect(newUser1.username).toBe("username1");
    })
})