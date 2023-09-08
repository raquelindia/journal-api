const app = require('./routes/app');
const { sequelize } = require('./db');

const { PORT = 8000} = process.env;

app.listen(PORT, () => {
    sequelize.sync({force: false});
    console.log(`Server running at http://localhost:${PORT}`);
})

