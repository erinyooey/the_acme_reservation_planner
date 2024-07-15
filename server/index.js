const express = require("express")
const app = express()
app.use(express.json())


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
            date: req.body.date,
            party_count: req.body.party_count
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
    const [erin, darcy, addie, chipotle, mcdonalds, bjs] = await Promise.all([
        createCustomer({name: 'Erin'}),
        createCustomer({name: 'Darcy'}),
        createCustomer({name: 'Addie'}),
        createRestaurant({name: 'Chipotle'}),
        createRestaurant({name: 'Mcdonalds'}),
        createRestaurant({name: 'Bjs'})

    ])
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());

    const [reservation, reservation2, reservation3] = await Promise.all([
        createReservation({
            customer_id: erin.id,
            restaurant_id: chipotle.id,
            date: '2024-7-20',
            party_count: 3
        }),
        createReservation({
            customer_id: darcy.id,
            restaurant_id: mcdonalds.id,
            date: '2024-7-25',
            party_count: 6
        }),
        createReservation({
            customer_id: addie.id,
            restaurant_id: bjs.id,
            date: '2024-7-22',
            party_count: 2
        }),
    ])

    console.log(await fetchReservations())
    await destroyReservation({id: reservation2.id, customer_id: reservation2.customer_id});
    console.log(await fetchReservations())

    const PORT = process.env.PORT || 3000;
    // const response = await createTables()
    app.listen(PORT, ()=>{
        console.log(`Hello from port number ${PORT}`)
        console.log('Some curl commands to test')
        console.log(`curl localhost: ${PORT}/api/customers`)
        console.log(`curl localhost: ${PORT}/api/restaurants`)
        console.log(`curl localhost: ${PORT}/api/reservations`)
        console.log(`curl -X DELETE localhost: ${PORT}/api/customers/${darcy.id}/reservations/${reservation2.id}`)

    })
} 

init();