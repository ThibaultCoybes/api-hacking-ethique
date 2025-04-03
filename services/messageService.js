const pool = require('../config/database');

class MessageService {
    async getAllMessages() {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM user_messages_view');
            return result.rows;
        } finally {
            client.release();
        }
    }

    async sendMessage(senderId, receiverId, content) {
        const client = await pool.connect();
        try {
            // Vérifier si le destinataire existe
            const receiverExists = await client.query(
                'SELECT id FROM internal.users WHERE id = $1',
                [receiverId]
            );

            if (receiverExists.rows.length === 0) {
                throw new Error('Destinataire non trouvé');
            }

            // Insérer le message
            const result = await client.query(
                'INSERT INTO new_messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
                [senderId, receiverId, content]
            );

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async getUserMessages(userId) {
        const client = await pool.connect();
        try {
            const result = await client.query(
                `SELECT * FROM new_messages
                 WHERE receiver_id = $1`,
                [userId]
            );
            return result.rows;
        } finally {
            client.release();
        }
    }
}

module.exports = new MessageService(); 