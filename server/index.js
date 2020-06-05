const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app =express();


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


const port =  process.env.PORT || 3001;

let users = []

app.get('/', (req, res)=> {
    res.send('hello world')
})

app.post('/sign-up', (req, res) => {
    const data = req.body
    const uniqueEmail = users.map(({email})=> email).includes(data.email);
    if(!uniqueEmail) {
        users.push(data);
        res.status(201).send('succes');
        return;
    }
    res.status(409).send('Email alredy exist');
    return;
})



app.listen(port, ()=>{
    console.log('server work on ', port)
})