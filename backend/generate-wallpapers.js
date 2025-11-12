// import fs from 'fs';

// const categoriesList = ['Nature', 'Space', 'Abstract'];

// const wallpapers = Array.from({ length: 100 }).map((_, i) => ({
//   id: i + 1,
//   title: `Wallpaper ${i + 1}`,
//   category: categoriesList[i % categoriesList.length],
//   imageUrl: `https://picsum.photos/400/300?random=${i + 1}`,
//   description: `Description for wallpaper ${i + 1}`
// }));

// fs.writeFileSync('./data/wallpapers.json', JSON.stringify(wallpapers, null, 2));
// console.log('wallpapers.json generated with 100 wallpapers');
import fs from 'fs';

const categoriesList = ['Nature', 'Space', 'Abstract'];

// Sample titles for each category
const titles = {
  Nature: [
    'Forest Sunrise',
    'Mountain Peaks',
    'Calm River',
    'Autumn Leaves',
    'Wildflowers',
    'Rainy Forest',
    'Snowy Hills',
    'Tropical Beach',
    'Desert Dunes',
    'Waterfall'
  ],
  Space: [
    'Milky Way Galaxy',
    'Starry Night Sky',
    'Nebula Clouds',
    'Planetary Orbit',
    'Lunar Surface',
    'Comet Trail',
    'Astronaut View',
    'Galaxy Spiral',
    'Supernova Burst',
    'Cosmic Horizon'
  ],
  Abstract: [
    'Color Splash',
    'Geometric Shapes',
    'Digital Waves',
    'Abstract Lines',
    'Vivid Patterns',
    'Modern Art',
    'Neon Glow',
    'Creative Design',
    'Fluid Motion',
    'Minimal Shapes'
  ]
};

// Picsum IDs to ensure unique images
const picsumIds = Array.from({ length: 100 }, (_, i) => 1010 + i);

const wallpapers = picsumIds.map((id, i) => {
  const category = categoriesList[i % categoriesList.length];
  const categoryTitles = titles[category];
  const title = categoryTitles[i % categoryTitles.length];

  return {
    id: i + 1,
    title: title,
    category: category,
    imageUrl: `https://picsum.photos/id/${id}/400/300`,
    description: `A beautiful ${title.toLowerCase()} wallpaper in the ${category} category.`
  };
});

// Ensure data folder exists
if (!fs.existsSync('./data')) fs.mkdirSync('./data');

fs.writeFileSync('./data/wallpapers.json', JSON.stringify(wallpapers, null, 2));

console.log('✅ wallpapers.json generated with meaningful titles for 100 wallpapers');
