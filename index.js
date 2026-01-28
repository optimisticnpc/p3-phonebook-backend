require('dotenv').config()
const Person = require('./models/person')


const express = require('express')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

const morgan = require('morgan')

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

// Create
app.get('/api/persons', (request, response) => {
Person.find({}).then(person => {
    response.json(person)    
  })
})



app.get('/api/info', (request, response) => {
  const currentTime = new Date()

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
  `)
})

// Get by ID
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.error(error)
      response.status(400).json({ error: 'malformatted id' })
    })
})


app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  // validate (match your POST rules)
  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const existing = persons.find(p => p.id === id)
  if (!existing) {
    return response.status(404).end()
  }

  const updatedPerson = {
    ...existing,
    name: body.name,
    number: body.number,
  }

  persons = persons.map(p => (p.id === id ? updatedPerson : p))

  response.json(updatedPerson)
})

// Delete
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  return `${Math.floor(Math.random()*100000)}`
}

// Create
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }

const person = new Person({
    name: body.name,
    number: body.number,
  })

person.save().then(result => {
  console.log('person saved!')
})

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})