const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;
const mongoURI = `mongodb+srv://gokgokraj:${process.env.MONGODB_PASSWORD}@marvel.gy4ixou.mongodb.net/marvelDB?retryWrites=true&w=majority`;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Define the schema
const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  superpower: { type: String, required: true },
  universe: { type: String, required: true }
});

// Create a model based on the schema
const Character = mongoose.model('Character', characterSchema);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Get all characters
app.get('/characters', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    console.error('Error fetching characters:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new character
app.post('/characters', async (req, res) => {
  const characterData = req.body;

  try {
    const newCharacter = await Character.create(characterData);
    res.status(201).json(newCharacter);
  } catch (err) {
    console.error('Error inserting character:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a character by ID
app.delete('/characters/:id', async (req, res) => {
  const characterId = req.params.id;

  try {
    const result = await Character.deleteOne({ _id: characterId });
    if (result.deletedCount === 0) {
      res.status(404).send('Character not found');
    } else {
      res.status(204).send();
    }
  } catch (err) {
    console.error('Error deleting character:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
