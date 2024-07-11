const pg = require("pg")
const uuid = require("uuid")
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/acme_reservation_db")

const createTables = async() => {
    return "Does this work";
};

module.exports = {
    createTables
};