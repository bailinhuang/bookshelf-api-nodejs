const express = require('express')
const app = express()
// const app = require('cors')
const cors = require('cors')
const port = 3001
const hostname = '127.0.0.1'
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const SECRET_KEY = 'wutup'
let books = new Map()
let users = new Map()
let sessions = new Map()
let book
let index
let token
let bookshelf

app.use(express.json())
app.use(cors())

const verifyToken = (req, res, next) => {

  try { 
    const { headers } = req
    const token = headers['auth-token']
    jwt.verify(token, SECRET_KEY) 
    const decoded = jwt.decode(token)
    const customer = decoded.customer
    req.customer = customer
    next()
  } catch (err) {
    res.send(err)
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

//GET ALL BOOKSHELF
app.get('/v2/book', verifyToken, (req, res) => {
  const { headers } = req
  const token = headers['auth-token']
  const decoded = jwt.decode(token)
  const customer = decoded.customer
  id = req.body.id
  customer_bookshelf = books.get(customer)
  res.setHeader('Content-type', 'application/json')
  res.send(customer_bookshelf)
})

//ADD A BOOK
app.post('/v2/book', verifyToken, (req, res) => {
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
  books.get(customer).push(book)
  res.setHeader('Content-type', 'application/json')
  res.send(books)
})

//UPDATE A BOOK
app.put('/v2/book/:id', verifyToken, (req, res) => {
  const { headers } = req
  const token = headers['auth-token']
  const decoded = jwt.decode(token)
  const customer = decoded.customer
  id = req.params.id
  bookshelf = books.get(customer)
  index = bookshelf.findIndex(x => x.id === id)
  book = bookshelf[index]
  book.name = req.body.name
  book.author = req.body.author
  bookshelf[index] = book
  res.setHeader('Content-type', 'application/json')
  res.send(bookshelf)
})

//DELETE A BOOK
app.delete('/v2/book/:id', verifyToken, (req, res) => {
  const { headers } = req
  const token = headers['auth-token']
  const decoded = jwt.decode(token)
  const customer = decoded.customer
  id = req.params.id
  bookshelf = books.get(customer)
  index = bookshelf.findIndex(x => x.id === id)
  bookshelf.splice(index, 1)
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
  users.set(user.username, user)
  books.set(user.customer, [])
  let val = sessions.get(user.customer)
  if (val === undefined) {
    sessions.set(user.customer, [])
  }
  res.setHeader('Content-type', 'application/json')
})

//LOGIN A USER AND RETURNS TOKEN
app.post('/v2/user/login', (req, res) => {
  const customer = users.get(req.body.username).customer
  const user = {
    // username: req.body.username,
    // password: req.body.password,
    customer: customer
  }
  token = {
    token: jwt.sign(user, SECRET_KEY, { expiresIn: 60 * 5 })
  }
  sessions.get(customer).push({'token': token.token, 'dateCreated' : new Date().toString()})
  res.setHeader('Content-type', 'application/json')
  res.send(token)
})

//RENEW TOKEN
app.post('/v2/user/renew', verifyToken, (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  }
  token = {
    token: jwt.sign(user, SECRET_KEY, { expiresIn: 60 * 5 })
  }
  sessions.get(customer).push({'token': token.token, 'dateCreated': new Date().toString()})
  res.setHeader('Content-type', 'application/json')
  res.send(token)
})

//ALL TOKENS FROM THE SESSIONS
app.get('/v2/sessions', verifyToken, (req, res) => {
  let customer_sessions = sessions.get(req.customer)
  res.setHeader('Content-type', 'application/json')
  res.send(customer_sessions)
})



app.listen(port, hostname, () => console.log(`Example app listening on http://${hostname}:${port}!`))