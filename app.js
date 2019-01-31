const express = require('express')
const app = express()
// const app = require('cors')
const port = 3001
const hostname = '127.0.0.1'
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const SECRET_KEY = 'wutup'

// let books = [{'name': 'x', 'author': 'x'}]

let books = new Map()
let users = new Map()

app.use(express.json())

const verifyToken = (req, res, next) => {

  const { headers } = req
  const token = headers['auth-token']
  try {
    jwt.verify(token, SECRET_KEY, {maxAge: 300000})
    next()
  } catch (err) { 
    res.status(401).end()
  }
}

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/v2', (req, res) => {
  res.send('Hello !')
})

app.post('/v2', (req, res) => {
  res.send('Hello !')
}) 

app.get('/v2/book', (req, res) => {
  const { headers } = req
  const token = headers['auth-token']
  const decoded = jwt.decode(token)
  const customer = decoded.customer
  id = req.body.id
  console.log(customer)
  customer_bookshelf = books.get(customer)
  console.log(customer_bookshelf)
  res.setHeader('Content-type', 'application/json')
  res.send(customer_bookshelf)
})

app.post('/v2/book', (req, res) => {
  const { headers } = req
  const token = headers['auth-token']
  const decoded = jwt.decode(token)
  const customer = decoded.customer
  const id = uuid()
  const book = {
    id: id,
    name: req.body.name,
    author: req.body.author
  }
  console.log(books.get(customer))
  books.get(customer).push(book) 
  res.setHeader('Content-type', 'application/json')
  res.send(books)
}) 

app.put('/v2/book/', (req, res) => {
  const { headers } = req
  const token = headers['auth-token']
  const decoded = jwt.decode(token)
  const customer = decoded.customer
  id = req.body.id
  bookshelf = books.get(customer)
  res.setHeader('Content-type', 'application/json')
  res.send(bookshelf)
})


//REGISTER A USER
app.post('/v2/user', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    customer: req.body.customer
  }
  let token = {
    token: jwt.sign(user, SECRET_KEY)
  }
  users.set(user.username, user)
  console.log(user.customer)
  books.set(user.customer, [])
  console.log(books.get(user.customer))
  res.setHeader('Content-type', 'application/json')
  res.send(token)
})

app.post('/v2/user/login', (req, res) => {
  console.log(req.body.username)
  const customer = users.get(req.body.username).customer
  console.log('login customer: ' + customer)
  const user = {
    // username: req.body.username,
    // password: req.body.password,
    customer: customer
  }
  let token = {
    token: jwt.sign(user, SECRET_KEY, { expiresIn: '300000' })
  } 
  res.setHeader('Content-type', 'application/json')
  res.send(token)
})

app.post('/v2/user/renew', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  }
  let token = {
    token: jwt.sign(user, SECRET_KEY, { expiresIn: '300000' })
  } 
  res.setHeader('Content-type', 'application/json')
  res.send(token)
})



app.listen(port, hostname, () => console.log(`Example app listening on http://${hostname}:${port}!`))