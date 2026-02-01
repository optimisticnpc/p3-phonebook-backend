const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.vr2pg.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

// mongodb+srv://<db_username>:<db_password>@cluster0.vr2pg.mongodb.net/?appName=Cluster0


// const url = 'mongodb://localhost:27017/phonebook?retryWrites=true&w=majority&appName=Cluster0'

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const name= process.argv[3]
  const number= process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})