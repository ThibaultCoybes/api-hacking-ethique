const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

class AuthService {
    async register(username, password) {
        const client = await pool.connect();
        try {
            // Vérifier si l'utilisateur existe déjà
            const userExists = await client.query(
                'SELECT * FROM internal.users WHERE username = $1',
                [username]
            );

            if (userExists.rows.length > 0) {
                throw new Error('Cet utilisateur existe déjà');
            }

            // Hasher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insérer le nouvel utilisateur
            const result = await client.query(
                'INSERT INTO internal.users (username, password) VALUES ($1, $2) RETURNING id, username',
                [username, hashedPassword]
            );

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async login(username, password) {
        const client = await pool.connect();
        try {
            // Vérifier si l'utilisateur existe
            const result = await client.query(
                'SELECT * FROM internal.users WHERE username = $1',
                [username]
            );

            if (result.rows.length === 0) {
                throw new Error('Identifiants invalides');
            }

            const user = result.rows[0];

            // Vérifier le mot de passe
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error('Identifiants invalides');
            }

            // Générer le token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET || 'votre_secret_jwt',
                { expiresIn: '24h' }
            );

            return {
                token,
                user: {
                    id: user.id,
                    username: user.username
                }
            };
        } finally {
            client.release();
        }
    }

    async validateToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT ICI');
            return decoded;
        } catch (error) {
            throw new Error('Token invalide');
        }
    }
}

module.exports = new AuthService(); 