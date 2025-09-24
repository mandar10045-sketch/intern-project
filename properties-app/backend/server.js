const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use((req, res, next) => {
  if (req.method === 'POST' && req.url === '/api/properties') {
    console.log('Incoming request Content-Length:', req.headers['content-length']);
  }
  next();
});
app.use(express.json({ limit: '10mb' }));

// SQLite database
const db = new sqlite3.Database('/tmp/database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Create properties table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      price REAL,
      description TEXT,
      images TEXT,
      owner_name TEXT,
      owner_email TEXT,
      owner_phone TEXT,
      documents TEXT,
      available_for_visit INTEGER DEFAULT 1
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Properties table created or already exists.');
      }
    });
  }
});

// GET /api/properties/:id - Retrieve a single property
app.get('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM properties WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    try {
      row.images = JSON.parse(row.images);
    } catch (e) {
      console.error(`Error parsing images for property ${row.id}:`, e);
      row.images = [];
    }
    try {
      row.documents = JSON.parse(row.documents);
    } catch (e) {
      console.error(`Error parsing documents for property ${row.id}:`, e);
      row.documents = [];
    }
    row.available_for_visit = row.available_for_visit === 1;
    res.json(row);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// GET /api/properties - Retrieve all properties
app.get('/api/properties', (req, res) => {
  db.all('SELECT * FROM properties', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    rows.forEach(row => {
      try {
        row.images = JSON.parse(row.images);
        console.log(`Retrieved property ${row.id} with ${row.images.length} images`);
      } catch (e) {
        console.error(`Error parsing images for property ${row.id}:`, e);
        row.images = [];
      }
      try {
        row.documents = JSON.parse(row.documents);
      } catch (e) {
        console.error(`Error parsing documents for property ${row.id}:`, e);
        row.documents = [];
      }
      row.available_for_visit = row.available_for_visit === 1;
    });
    res.json(rows);
  });
});

// POST /api/properties - Add a new property
app.post('/api/properties', (req, res) => {
  console.log('Request body size (bytes):', JSON.stringify(req.body).length);
  const { name, address, price, description, images, owner_name, owner_email, owner_phone, documents, available_for_visit } = req.body;
  console.log('Received property:', { name, address, price, description, imagesCount: images ? images.length : 0, owner_name, owner_email, owner_phone, documentsCount: documents ? documents.length : 0, available_for_visit });
  db.run('INSERT INTO properties (name, address, price, description, images, owner_name, owner_email, owner_phone, documents, available_for_visit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, address, price, description, JSON.stringify(images || []), owner_name, owner_email, owner_phone, JSON.stringify(documents || []), available_for_visit ? 1 : 0], function(err) {
    if (err) {
      console.error('Error inserting property:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Inserted property with id:', this.lastID);
    // Retrieve the inserted property
    db.get('SELECT * FROM properties WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error retrieving inserted property:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      try {
        row.images = JSON.parse(row.images);
        console.log('Returning property with images count:', row.images.length);
      } catch (e) {
        console.error('Error parsing images for new property:', e);
        row.images = [];
      }
      try {
        row.documents = JSON.parse(row.documents);
      } catch (e) {
        console.error('Error parsing documents for new property:', e);
        row.documents = [];
      }
      row.available_for_visit = row.available_for_visit === 1;
      res.json(row);
    });
  });
});

// DELETE /api/properties/:id - Delete a property
app.delete('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM properties WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json({ message: 'Property deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});