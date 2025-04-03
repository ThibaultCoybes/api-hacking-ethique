const userService = require('../services/userService');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }

    async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const user = await userService.getUserById(userId);
            res.json(user);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            res.status(404).json({ message: error.message });
        }
    }

    async updateUserLocation(req, res) {
        try {
            const userId = req.user.id;
            const { latitude, longitude } = req.body;

            // Validation des données
            if (latitude === undefined || longitude === undefined) {
                return res.status(400).json({ message: 'Latitude et longitude requis' });
            }

            if (latitude < -90 || latitude > 90) {
                return res.status(400).json({ message: 'Latitude invalide' });
            }

            if (longitude < -180 || longitude > 180) {
                return res.status(400).json({ message: 'Longitude invalide' });
            }

            const location = await userService.updateUserLocation(userId, latitude, longitude);
            res.json(location);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la position:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}

module.exports = new UserController(); 