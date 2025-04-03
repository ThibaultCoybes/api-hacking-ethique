const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const { username, password } = req.body;

            // Validation des données
            if (!username || !password) {
                return res.status(400).json({ message: 'Username et password requis' });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
            }

            const user = await authService.register(username, password);
            res.status(201).json(user);
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validation des données
            if (!username || !password) {
                return res.status(400).json({ message: 'Username et password requis' });
            }

            const result = await authService.login(username, password);
            res.json(result);
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(401).json({ message: error.message });
        }
    }
}

module.exports = new AuthController(); 