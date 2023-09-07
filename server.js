
/*


const { db } = require('./models');
const app = require('./routes/app');

const PORT = process.env.PORT || 4000;

const init = async () => {
    try {
        await db.sync();

        app.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`);

        });


    } catch(error){
        console.error('Error starting server:', error)
    }
}; 

init();

*/