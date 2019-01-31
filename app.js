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
let book
let index
let token
let bookshelf

app.use(express.json())
app.use(cors())

const verifyToken = (req, res, next) => {

  const { headers } = req
  const token = headers['auth-token']
  try {
    jwt.verify(token, SECRET_KEY, { maxAge: 300000 })
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

//GET ALL BOOKSHELF
app.get('/v2/book', (req, res) => {
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
app.put('/v2/book/:id', (req, res) => {
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
app.delete('/v2/book/:id', (req, res) => {
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
  token = {
    token: jwt.sign(user, SECRET_KEY)
  }
  users.set(user.username, user) 
  books.set(user.customer, []) 
  res.setHeader('Content-type', 'application/json')
  res.send(token)
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
    token: jwt.sign(user, SECRET_KEY, { expiresIn: '300000' })
  }
  res.setHeader('Content-type', 'application/json')
  res.send(token)
})

//RENEW TOKEN
app.post('/v2/user/renew', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  }
  token = {
    token: jwt.sign(user, SECRET_KEY, { expiresIn: '300000' })
  }
  res.setHeader('Content-type', 'application/json')
  res.send(token)
})



app.listen(port, hostname, () => console.log(`Example app listening on http://${hostname}:${port}!`))