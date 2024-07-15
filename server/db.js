const pg = require("pg")
const uuid = require("uuid")
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/acme_reservation_db")

const createTables = async() => {
     // Cascade ensures any dependent objects are also dropped
    const SQL = `
        DROP TABLE IF EXISTS customers CASCADE; 
        DROP TABLE IF EXISTS restaurants CASCADE;
        DROP TABLE IF EXISTS reservations CASCADE;
        CREATE TABLE customers(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        );
        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        );
        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INTEGER NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
            customer_id UUID REFERENCES customers(id) NOT NULL
            
        );
    `;
    await client.query(SQL);
};

const createCustomer = async({name}) => {
    // await client.connect();
    const SQL = `
        INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(),name])
    return response.rows[0]
}

const createRestaurant = async({name }) => {
    const SQL = `
        INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *
    `
    const response = await client.query(SQL, [uuid.v4(), name])
    return response.rows[0]
}

const createReservation = async({date, party_count, restaurant_id, customer_id}) => {
    const SQL = `
        INSERT INTO reservations(id, date, party_count, restaurant_id, customer_id) VALUES($1, $2, $3, $4, $5) RETURNING *
    `
    const response = await client.query(SQL, [uuid.v4(), date, party_count, restaurant_id, customer_id])
    return response.rows[0]
}

const fetchCustomers = async() => {
    const SQL = `SELECT * FROM customers`
    const response = await client.query(SQL)
    return response.rows
}

const fetchRestaurants = async() => {
    const SQL = `SELECT * FROM restaurants`
    const response = await client.query(SQL)
    return response.rows
}

const destroyReservation = async({restaurant_id, customer_id}) => {
    console.log(restaurant_id, customer_id)
    const SQL = `
        DELETE FROM reservations WHERE restaurant_id = $1 AND customer_id = $2
    `
    await client.query(SQL, [restaurant_id, customer_id])
}

const fetchReservations = async()=>{
    const SQL = `
        SELECT * FROM reservations;
    `
    const response = await client.query(SQL)
    return response.rows
}

module.exports = {
    createTables,
    createCustomer,
    client,
    createRestaurant,
    createReservation,
    fetchCustomers,
    destroyReservation,
    fetchReservations,
    fetchRestaurants
};