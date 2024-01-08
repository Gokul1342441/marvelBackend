import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;
const mongoURI = `mongodb+srv://gokgokraj:${process.env.MONGODB_PASSWORD}@marvel.gy4ixou.mongodb.net/marvelDB?retryWrites=true&w=majority`;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Define the schema
interface Character {
  name: string;
  superpower: string;
  universe: string;
}

const characterSchema = new mongoose.Schema<Character>({
  name: { type: String, required: true },
  superpower: { type: String, required: true },
  universe: { type: String, required: true }
});

// Create a model based on the schema
const CharacterModel = mongoose.model<Character>('Character', characterSchema);

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Get all characters
app.get('/characters', async (req: Request, res: Response) => {
  try {
    const characters = await CharacterModel.find();
    res.json(characters);
  } catch (err) {
    console.error('Error fetching characters:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new character
app.post('/characters', async (req: Request, res: Response) => {
  const characterData: Character = req.body;

  try {
    const newCharacter = await CharacterModel.create(characterData);
    res.status(201).json(newCharacter);
  } catch (err) {
    console.error('Error inserting character:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a character by ID
app.delete('/characters/:id', async (req: Request, res: Response) => {
  const characterId = req.params.id;

  try {
    const result = await CharacterModel.deleteOne({ _id: characterId });
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
