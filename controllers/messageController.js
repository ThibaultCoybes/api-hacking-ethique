const messageService = require('../services/messageService');

class MessageController {
    async getAllMessages(req, res) {
        try {
            const messages = await messageService.getAllMessages();
            res.json(messages);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    async sendMessage(req, res) {
        try {
            const { receiver_id, content } = req.body;
            const sender_id = req.user.id;

            // Validation des données
            if (!receiver_id || !content) {
                return res.status(400).json({ message: 'Destinataire et contenu requis' });
            }

            if (content.length > 1000) {
                return res.status(400).json({ message: 'Le message ne doit pas dépasser 1000 caractères' });
            }

            const message = await messageService.sendMessage(sender_id, receiver_id, content);
            res.status(201).json(message);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async getUserMessages(req, res) {
        try {
            const userId = req.user.id;
            const messages = await messageService.getUserMessages(userId);
            res.json(messages);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}

module.exports = new MessageController(); 