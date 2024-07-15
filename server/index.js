const express = require("express")
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000;

const {
    createTables,
    createCustomer,
    client,
    createRestaurant,
    createReservation,
    fetchCustomers,
    destroyReservation,
    fetchReservations,
    fetchRestaurants

} = require("./db")


app.post("/api/customers/:id/reservations", async(req, res, next)=>{
    try {
        res.status(201).send(await createReservation({
            customer_id: req.params.id, restaurant_id: req.body.restaurant_id, date: req.body.date, party_count: req.body.party_count,
        }))
    } catch (error) {
        next(error)
    }
})

app.get("/api/customers", async(req, res, next)=>{
    try {
        res.send(await fetchCustomers())
    } catch (error) {
        next(error)
    }
})

app.get("/api/restaurants", async(req, res, next)=>{
    try {
        res.send(await fetchRestaurants())
    } catch (error) {
        next(error)
    }
})

app.get("/api/reservations", async(req, res, next)=>{
    try {
        res.send(await fetchReservations())
    } catch (error) {
        next(error)
    }
})


app.delete("/api/customers/:customer_id/reservations/:id", async(req, res, next)=>{
    try {
        await destroyReservation({customer_id: req.params.customer_id, id: req.params.id})
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
})

app.use((err, req, res, next)=> {
    res.status(err.status || 500).send({ error: err.message || err});
});

const init = async() => {
    await client.connect()
    await createTables()
    const [erin, darcy, catherine, david, addie] = await Promise.all([
        createCustomer({name: 'Erin'}),
        createCustomer({name: 'Darcy'}),
        createCustomer({name: 'Catherine'}),
        createCustomer({name: 'David'}),
        createCustomer({name: 'Addie'}),
    ])
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());

    // const response = await createTables()
    app.listen(PORT, ()=>{
        console.log(`Hello from port number ${PORT}`)
    })
} 

init();