const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const auth = require('./middleware/auth');

// Routes
const authRoute = require('./routes/auth');
const messageRoute = require('./routes/messages');
const userRoute = require('./routes/users');

require('dotenv').config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// AUTH ROUTES
app.use('/auth', authRoute);
app.use('/messages', messageRoute);
app.use('/users', userRoute);

app.get('/users', auth, async (req, res) => {
    const result = await pool.query('SELECT id, username FROM user_public');
    res.json(result.rows);
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Route 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
});
