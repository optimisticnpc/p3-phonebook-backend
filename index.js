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


// Create
app.get('/api/persons', (request, response) => {
Person.find({}).then(person => {
    response.json(person)    
  })
})



app.get('/info', async (request, response, next) => {
  try {
    const currentTime = new Date()
    const count = await Person.countDocuments({})

    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${currentTime}</p>
    `)
  } catch (error) {
    next(error)
  }
})


// Get by ID
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Update
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  // validate (match your POST rules)
  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  Person.findById(id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = body.name
      person.number = body.number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })

    })
    .catch(error => next(error))
})

// Delete
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


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
    response.json(person)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log("This is an error");
  
  // console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})