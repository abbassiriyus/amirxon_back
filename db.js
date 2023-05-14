const { Pool } = require("pg")

//  const pool = new Pool({
//     user: 'postgres',
//     password: "abbas123",
//     host: "localhost",
//     port: 5432,
//      database: "news"
// }) 

const pool = new Pool({
    user: 'postgres',
    password: "JPFVIKl85801bkpWse8N",
    host: "containers-us-west-109.railway.app",
    port: 7934,
    database: "railway"
})

pool.connect((err) => {
    if (!err) {
        console.log("Connect To SQL");
    } else {
        console.log(err);
    }
})





module.exports = pool