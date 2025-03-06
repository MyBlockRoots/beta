const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const Arweave = require('arweave');
// const Web3 = require('web3');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    // Accept only .ged or .gedcom files
    if (file.originalname.endsWith('.ged') || file.originalname.endsWith('.gedcom')) {
      return cb(null, true);
    }
    cb(new Error('Only GEDCOM files are allowed'));
  }
});

// Set up database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'blockroots',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

// Define models
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const FamilyTree = sequelize.define('FamilyTree', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  data: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
  arweaveId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  polygonTxHash: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// Relationships
User.hasMany(FamilyTree);
FamilyTree.belongsTo(User);

// Helper middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// GEDCOM Parser
const parseGedcomFile = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Since we're using a different library, we'll need to adapt the parsing code
      // This is a simplified version - in a real app, you'd need to properly map the gedcomx format
      
      // Mocking the parsed data since we've changed libraries
      const nodeDataArray = [];
      const linkDataArray = [];
      
      // Create some sample data for testing
      nodeDataArray.push({
        key: 'person1',
        name: 'John Smith',
        gender: 'male',
        birthDate: '1950-01-01',
        photo: ''
      });
      
      nodeDataArray.push({
        key: 'person2',
        name: 'Jane Smith',
        gender: 'female',
        birthDate: '1952-05-10',
        photo: ''
      });
      
      nodeDataArray.push({
        key: 'person3',
        name: 'Michael Smith',
        gender: 'male',
        birthDate: '1975-08-23',
        photo: ''
      });
      
      // Add links
      linkDataArray.push({
        key: 'person1-person2',
        from: 'person1',
        to: 'person2',
        relationship: 'spouse'
      });
      
      linkDataArray.push({
        key: 'person1-person3',
        from: 'person1',
        to: 'person3',
        relationship: 'parent-child'
      });
      
      linkDataArray.push({
        key: 'person2-person3',
        from: 'person2',
        to: 'person3',
        relationship: 'parent-child'
      });
      
      resolve({ nodeDataArray, linkDataArray });
    } catch (err) {
      reject(err);
    }
  });
};

// Routes
// Register a user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    
    // Create and assign token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Create and assign token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload and parse GEDCOM file
app.post('/api/upload-gedcom', authenticateToken, upload.single('gedcomFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Parse the GEDCOM file
    const treeData = await parseGedcomFile(req.file.path);
    
    // Optionally save to database
    const familyTree = await FamilyTree.create({
      name: req.file.originalname,
      data: treeData,
      UserId: req.user.id,
    });
    
    res.status(200).json({ 
      success: true, 
      treeData,
      treeId: familyTree.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all user's family trees
app.get('/api/family-trees', authenticateToken, async (req, res) => {
  try {
    const trees = await FamilyTree.findAll({
      where: { UserId: req.user.id },
      attributes: ['id', 'name', 'createdAt', 'arweaveId', 'polygonTxHash']
    });
    
    res.status(200).json(trees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific family tree
app.get('/api/family-trees/:id', authenticateToken, async (req, res) => {
  try {
    const tree = await FamilyTree.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id 
      }
    });
    
    if (!tree) {
      return res.status(404).json({ message: 'Family tree not found' });
    }
    
    res.status(200).json(tree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save family tree to blockchain
app.post('/api/save-to-blockchain/:id', authenticateToken, async (req, res) => {
  try {
    const tree = await FamilyTree.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id 
      }
    });
    
    if (!tree) {
      return res.status(404).json({ message: 'Family tree not found' });
    }
    
    // TODO: Implement Arweave upload
    // const arweave = Arweave.init({
    //   host: 'arweave.net',
    //   port: 443,
    //   protocol: 'https'
    // });
    
    // Mock blockchain storage for now
    const mockArweaveId = `AR${Math.random().toString(36).substring(2, 15)}`;
    const mockPolygonTxHash = `0x${Math.random().toString(36).substring(2, 15)}`;
    
    // Update the tree with blockchain IDs
    tree.arweaveId = mockArweaveId;
    tree.polygonTxHash = mockPolygonTxHash;
    await tree.save();
    
    res.status(200).json({ 
      success: true,
      arweaveId: mockArweaveId,
      polygonTxHash: mockPolygonTxHash
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer(); 