// import express from 'express';
// import cors from 'cors';
// import { fileURLToPath } from 'url';
// import fs from 'fs';
// import path from 'path';

// const app = express();
// const port = 5000;

// // Enable CORS so Angular frontend can call API
// app.use(cors());
// app.use(express.json());

// // --- Static Data ---

// const categories = [
//   { id: 1, name: 'Nature', primary: '#4CAF50', secondary: '#E8F5E9' },
//   { id: 2, name: 'Space', primary: '#2196F3', secondary: '#E3F2FD' },
//   { id: 3, name: 'Abstract', primary: '#FF5722', secondary: '#FBE9E7' },
//   { id: 4, name: 'Animals', primary: '#FF9800', secondary: '#FFF3E0' },
//   { id: 5, name: 'Cities', primary: '#9C27B0', secondary: '#F3E5F5' },
//   { id: 6, name: 'Travel', primary: '#00BCD4', secondary: '#E0F7FA' },
//   { id: 7, name: 'Technology', primary: '#607D8B', secondary: '#ECEFF1' },
//   { id: 8, name: 'Food', primary: '#FF7043', secondary: '#FFF3E0' },
//   { id: 9, name: 'Sports', primary: '#3F51B5', secondary: '#E8EAF6' },
//   { id: 10, name: 'Music', primary: '#E91E63', secondary: '#FCE4EC' },
//   { id: 11, name: 'Art', primary: '#795548', secondary: '#EFEBE9' },
//   { id: 12, name: 'Cars', primary: '#F44336', secondary: '#FFEBEE' },
//   { id: 13, name: 'Fashion', primary: '#009688', secondary: '#E0F2F1' },
//   { id: 14, name: 'History', primary: '#FFEB3B', secondary: '#FFFDE7' },
//   { id: 15, name: 'Movies', primary: '#673AB7', secondary: '#EDE7F6' }
// ];



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // Load wallpapers from JSON
// const wallpapersFilePath = path.join(__dirname, 'data', 'wallpapers.json');
// let wallpapers = [];

// try {
//   const data = fs.readFileSync(wallpapersFilePath, 'utf8');
//   wallpapers = JSON.parse(data);
//   console.log(`Loaded ${wallpapers.length} wallpapers`);
// } catch (err) {
//   console.error('Error reading wallpapers JSON file', err);
// }

// // Get single wallpaper by ID
// app.get('/api/wallpaper/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const wallpaper = wallpapers.find(w => w.id === id);

//   if (!wallpaper) {
//     return res.status(404).json({ error: 'Wallpaper not found' });
//   }

//   res.json(wallpaper);
// });
// // Search wallpapers by keyword (title or category)
// app.get('/api/search', (req, res) => {
//   const q = (req.query.q || '').toLowerCase();
//   const results = wallpapers.filter(
//     w => w.title.toLowerCase().includes(q) || w.category.toLowerCase().includes(q)
//   );
//   res.json(results);
// });


// // --- Routes ---

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ msg: 'Backend is working ✅' });
// });

// // Get all categories
// app.get('/api/categories', (req, res) => {
//   res.json(categories);
// });

// // Get all wallpapers
// app.get('/api/wallpapers', (req, res) => {
//   res.json(wallpapers);
// });

// // Get wallpapers by category
// app.get('/api/wallpapers/:category', (req, res) => {
//   const categoryName = req.params.category.toLowerCase();
//   const filtered = wallpapers.filter(w => w.category.toLowerCase() === categoryName);
//   res.json(filtered);
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Backend running on http://localhost:${port}`);
// });
