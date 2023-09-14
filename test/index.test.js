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

    test('can create an entry', async () => {
        const newEntry1 = await Entry.create({title: "New test entry 1", date: "1945-08-04", text: "does indoor plumbing exist yet?"});
        expect(newEntry1.title).toBe("New test entry 1");
    })

    test('test eager loading', async () => {
        const newEntry2 = await Entry.create({title: "New test entry 2", date: "1946-08-04", text: "The year is 1946"});
        const newUser2 = await User.create({username: "username2", name: "jane doe", "email": "janedoe@example.com"});
        
        const foundUser = await User.findAll({ include: [{model: Entry, as: 'entries'}]});
        const foundEntry = await Entry.findAll({include: [{model: User, as: 'user'}]});


       console.log(foundUser);
       console.log(foundEntry);

       const user2 = foundUser[1];
       const entry2 = foundEntry[1];

       await user2.addEntry(entry2);

       const getUser2Entries = await user2.getEntries();
       const loadedUser = await User.findOne({
        where: {
            id: user2.id
        },
        include: Entry
       });

       const numberOfEntries = loadedUser.entries.length;
       console.log(numberOfEntries);

       console.log(loadedUser.entries[numberOfEntries - 1]);

        expect(loadedUser.entries[0].title).toBe('New test entry 2');
        expect(loadedUser.entries.length).toBe(1);

    })
})