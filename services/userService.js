const pool = require('../config/database');

class UserService {
    async getAllUsers() {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT id, username FROM user_public');
            return result.rows;
        } finally {
            client.release();
        }
    }

    async getUserById(userId) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT id, username FROM user_public WHERE id = $1',
                [userId]
            );
            
            if (result.rows.length === 0) {
                throw new Error('Utilisateur non trouvé');
            }
            
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async updateUserLocation(userId, latitude, longitude) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO internal.user_map (user_id, latitude, longitude)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (user_id) 
                 DO UPDATE SET latitude = $2, longitude = $3
                 RETURNING *`,
                [userId, latitude, longitude]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }
}

module.exports = new UserService(); 