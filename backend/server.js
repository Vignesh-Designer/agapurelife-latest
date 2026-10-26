const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage setup for Multer file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'agapure-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Helper to read and write JSON files
const getFilePath = (fileName) => path.join(__dirname, 'data', fileName);

const readData = (fileName) => {
  try {
    const file = getFilePath(fileName);
    if (!fs.existsSync(file)) return null;
    const content = fs.readFileSync(file, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return null;
  }
};

const writeData = (fileName, data) => {
  try {
    const file = getFilePath(fileName);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
    return false;
  }
};

// Helper to safely delete file from uploads if exists
const removeUploadedFile = (fileUrl) => {
  if (!fileUrl) return;
  try {
    const fileName = path.basename(fileUrl);
    const filePath = path.join(__dirname, 'uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[Agápure Cleanup] Deleted unneeded file: ${fileName}`);
    }
  } catch (e) {
    console.warn(`[Agápure Cleanup] Could not delete file: ${fileUrl}`, e.message);
  }
};

// --- ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'Agápure', time: new Date().toISOString() });
});

// 1. PRODUCTS
app.get('/api/products', (req, res) => {
  const products = readData('products.json') || [];
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readData('products.json') || [];
  const product = products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const products = readData('products.json') || [];
  const newProduct = {
    id: req.body.id || 'prod-' + Date.now(),
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: req.body.category || 'Refined Palm Oil',
    description: req.body.description || '',
    price: Number(req.body.price) || 200,
    volume: req.body.volume || '1',
    weight: req.body.weight || 'gm',
    package: req.body.package || 'Bottle',
    image: req.body.image || '/images/refined-oil.jpg',
    inStock: req.body.inStock !== false,
    options: req.body.options || [
      { size: req.body.volume || '1 Litre', price: Number(req.body.price) || 200 }
    ]
  };
  products.unshift(newProduct);
  writeData('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readData('products.json') || [];
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  // If image changed, clean up previous uploaded image
  if (req.body.image && products[index].image && req.body.image !== products[index].image) {
    if (products[index].image.includes('/uploads/')) {
      removeUploadedFile(products[index].image);
    }
  }

  products[index] = { ...products[index], ...req.body, id: products[index].id };
  writeData('products.json', products);
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData('products.json') || [];
  const productToDelete = products.find((p) => p.id === req.params.id);
  if (!productToDelete) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Remove uploaded image from disk if applicable
  if (productToDelete.image && productToDelete.image.includes('/uploads/')) {
    removeUploadedFile(productToDelete.image);
  }

  products = products.filter((p) => p.id !== req.params.id);
  writeData('products.json', products);
  res.json({ success: true, message: 'Product deleted permanently and memory cleaned.' });
});

// 2. HERO BANNER
app.get('/api/banner', (req, res) => {
  const banner = readData('banner.json') || {};
  res.json(banner);
});

app.put('/api/banner', (req, res) => {
  const existing = readData('banner.json') || {};
  const updated = { ...existing, ...req.body };
  writeData('banner.json', updated);
  res.json(updated);
});

// Update an individual banner slide
app.put('/api/banner/slide/:id', (req, res) => {
  const banner = readData('banner.json') || { slides: [] };
  const index = (banner.slides || []).findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Banner slide not found' });
  }

  // Clean up previous uploaded desktop image if replaced
  if (req.body.image && banner.slides[index].image && req.body.image !== banner.slides[index].image) {
    if (banner.slides[index].image.includes('/uploads/')) {
      removeUploadedFile(banner.slides[index].image);
    }
  }

  // Clean up previous uploaded mobile image if replaced
  if (req.body.mobileImage && banner.slides[index].mobileImage && req.body.mobileImage !== banner.slides[index].mobileImage) {
    if (banner.slides[index].mobileImage.includes('/uploads/')) {
      removeUploadedFile(banner.slides[index].mobileImage);
    }
  }

  banner.slides[index] = { ...banner.slides[index], ...req.body, id: banner.slides[index].id };
  writeData('banner.json', banner);
  res.json({ success: true, banner, slide: banner.slides[index] });
});

// Delete a banner slide and its image file
app.delete('/api/banner/slide/:id', (req, res) => {
  const banner = readData('banner.json') || { slides: [] };
  const slideToDelete = (banner.slides || []).find((s) => s.id === req.params.id);
  if (slideToDelete) {
    if (slideToDelete.image && slideToDelete.image.includes('/uploads/')) {
      removeUploadedFile(slideToDelete.image);
    }
    if (slideToDelete.mobileImage && slideToDelete.mobileImage.includes('/uploads/')) {
      removeUploadedFile(slideToDelete.mobileImage);
    }
    banner.slides = banner.slides.filter((s) => s.id !== req.params.id);
    writeData('banner.json', banner);
  }
  res.json({ success: true, banner });
});

// 3. SETTINGS
app.get('/api/settings', (req, res) => {
  const settings = readData('settings.json') || {};
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  const existing = readData('settings.json') || {};
  const updated = { ...existing, ...req.body };
  writeData('settings.json', updated);
  res.json(updated);
});

// 4. FAQS
app.get('/api/faqs', (req, res) => {
  const faqs = readData('faqs.json') || [];
  res.json(faqs);
});

app.put('/api/faqs', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected array of FAQs' });
  }
  writeData('faqs.json', req.body);
  res.json(req.body);
});

// 5. BLOGS
app.get('/api/blogs', (req, res) => {
  const blogs = readData('blogs.json') || [];
  res.json(blogs);
});

app.post('/api/blogs', (req, res) => {
  const blogs = readData('blogs.json') || [];
  const newBlog = {
    id: req.body.id || 'blog-' + Date.now(),
    slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: req.body.title || 'Untitled Article',
    category: req.body.category || 'Traditional Science',
    categoryColor: req.body.categoryColor || 'gold',
    readTime: req.body.readTime || '4 min read',
    date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    image: req.body.image || '/images/blog-cooking.jpg',
    excerpt: req.body.excerpt || '',
    content: req.body.content || ''
  };
  blogs.unshift(newBlog);
  writeData('blogs.json', blogs);
  res.status(201).json(newBlog);
});

app.put('/api/blogs/:id', (req, res) => {
  const blogs = readData('blogs.json') || [];
  const index = blogs.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Blog not found' });

  if (req.body.image && blogs[index].image && req.body.image !== blogs[index].image) {
    if (blogs[index].image.includes('/uploads/')) {
      removeUploadedFile(blogs[index].image);
    }
  }

  blogs[index] = { ...blogs[index], ...req.body, id: blogs[index].id };
  writeData('blogs.json', blogs);
  res.json(blogs[index]);
});

app.delete('/api/blogs/:id', (req, res) => {
  let blogs = readData('blogs.json') || [];
  const toDelete = blogs.find((b) => b.id === req.params.id);
  if (toDelete && toDelete.image && toDelete.image.includes('/uploads/')) {
    removeUploadedFile(toDelete.image);
  }
  blogs = blogs.filter((b) => b.id !== req.params.id);
  writeData('blogs.json', blogs);
  res.json({ success: true, message: 'Blog deleted permanently' });
});

app.put('/api/blogs', (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected array of blogs' });
  }
  writeData('blogs.json', req.body);
  res.json(req.body);
});

// 6. ORDERS
app.get('/api/orders', (req, res) => {
  const orders = readData('orders.json') || [];
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const orders = readData('orders.json') || [];
  const newOrder = {
    id: 'AGA-' + Date.now().toString(36).toUpperCase(),
    customerName: req.body.customerName || 'WhatsApp Customer',
    customerPhone: req.body.customerPhone || '',
    customerAddress: req.body.customerAddress || '',
    items: req.body.items || [],
    subtotal: req.body.subtotal || 0,
    shippingFee: req.body.shippingFee || 0,
    total: req.body.total || 0,
    status: req.body.status || 'Pending WhatsApp Confirmation',
    createdAt: new Date().toISOString(),
    source: req.body.source || 'WhatsApp Cart'
  };
  orders.unshift(newOrder);
  writeData('orders.json', orders);
  res.status(201).json(newOrder);
});

// Delete an order record permanently from server source
app.delete('/api/orders/:id', (req, res) => {
  let orders = readData('orders.json') || [];
  const initialCount = orders.length;
  orders = orders.filter((o) => o.id !== req.params.id);
  if (orders.length === initialCount) {
    return res.status(404).json({ error: 'Order record not found' });
  }
  writeData('orders.json', orders);
  res.json({ success: true, message: 'Order record deleted permanently from server source.' });
});

// Delete all order records permanently from server source
app.delete('/api/orders', (req, res) => {
  writeData('orders.json', []);
  res.json({ success: true, message: 'All order records deleted permanently from server source.' });
});

// 7. FILE UPLOAD (Single file)
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('[Upload Error]', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  });
});

// 8. ADMIN AUTH VERIFY
app.post('/api/admin/login', (req, res) => {
  const settings = readData('settings.json') || {};
  const { pin } = req.body;
  const correctPassword = settings.adminPin || 'agapure2026@';
  if (pin === correctPassword) {
    res.json({ success: true, token: 'agapure-admin-token-' + Date.now() });
  } else {
    res.status(401).json({ success: false, error: 'Invalid Admin Password' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[Agápure Backend] Server running on http://localhost:${PORT}`);
});
