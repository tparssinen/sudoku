import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // Send the HTML file
  res.sendFile(path.join(__dirname, 'public', 'sudoku.html'));
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});