INSERT INTO roles (role_id) VALUES ('ADMIN');
INSERT INTO roles (role_id) VALUES ('STANDARD');

INSERT INTO account (id, role_id, email, password) VALUES ('1dbbdd8b-134b-43b2-8f73-b95b891f4cb6', 'ADMIN', 'clarence.siew@gmail.com', 'practice');
INSERT INTO account (id, role_id, email, password) VALUES ('ed8f069b-7c1f-4b3d-b8ea-8014bb9dd128', 'STANDARD', 'kenneth.bailey@gmail.com', 'pineapple');
INSERT INTO account (id, role_id, email, password) VALUES ('f3f7fde0-1825-4bcc-969f-faef9c8bfb9b', 'STANDARD', 'bella.northwood@gmail.com', 'strawberry');

INSERT INTO user_account (id, email, given_name, family_name) VALUES ('1dbbdd8b-134b-43b2-8f73-b95b891f4cb6', 'clarence.siew@gmail.com', 'Clarence', 'Siew');
INSERT INTO user_account (id, email, given_name, family_name) VALUES ('ed8f069b-7c1f-4b3d-b8ea-8014bb9dd128', 'kenneth.bailey@gmail.com', 'Kenneth', 'Bailey');
INSERT INTO user_account (id, email, given_name, family_name) VALUES ('f3f7fde0-1825-4bcc-969f-faef9c8bfb9b', 'bella.northwood@gmail.com', 'Bella', 'Northwood');