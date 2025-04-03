-- Création de l'utilisateur
CREATE USER dvwa WITH PASSWORD 'moktu5';

-- Création de la base
CREATE DATABASE dvwadb OWNER dvwa;

-- Connexion à la base (à faire manuellement dans psql)
-- \c dvwadb

-- Création des tables dans le schéma internal
CREATE SCHEMA internal AUTHORIZATION dvwa;

CREATE TABLE internal.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255)
);

CREATE TABLE internal.messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES internal.users(id),
    receiver_id INTEGER REFERENCES internal.users(id),
    content TEXT
);

CREATE TABLE internal.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL
);

CREATE TABLE internal.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES internal.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE internal.order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES internal.orders(id),
    product_id INTEGER REFERENCES internal.products(id),
    quantity INTEGER
);

CREATE TABLE internal.user_map (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES internal.users(id),
    latitude FLOAT,
    longitude FLOAT
);

-- Création des vues dans le schéma public

CREATE OR REPLACE VIEW user_public AS
SELECT id, username, password FROM internal.users;

CREATE OR REPLACE VIEW user_register AS
SELECT username, password FROM internal.users;

CREATE OR REPLACE VIEW user_messages_view AS
SELECT u.username AS sender, u2.username AS receiver, m.content
FROM internal.messages m
JOIN internal.users u ON m.sender_id = u.id
JOIN internal.users u2 ON m.receiver_id = u2.id;

CREATE OR REPLACE VIEW new_messages AS
SELECT id, sender_id, receiver_id, content FROM internal.messages;

CREATE OR REPLACE VIEW user_orders_view AS
SELECT u.username, o.id as order_id, p.name, p.price, oi.quantity, o.created_at
FROM internal.orders o
JOIN internal.users u ON o.user_id = u.id
JOIN internal.order_items oi ON oi.order_id = o.id
JOIN internal.products p ON oi.product_id = p.id;

CREATE OR REPLACE VIEW user_map_view AS
SELECT u.username, um.latitude, um.longitude
FROM internal.user_map um
JOIN internal.users u ON um.user_id = u.id;

-- Permissions
GRANT USAGE ON SCHEMA internal TO dvwa;

GRANT SELECT ON user_public TO dvwa;
GRANT INSERT ON user_register TO dvwa;
GRANT SELECT ON user_messages_view TO dvwa;
GRANT INSERT ON new_messages TO dvwa;
GRANT SELECT ON user_orders_view TO dvwa;
GRANT SELECT ON user_map_view TO dvwa;

-- (optionnel) accès sélectif aux séquences si besoin de debug ou inserts directs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA internal TO dvwa;