CREATE TABLE roles(
	role_id			VARCHAR(64)		PRIMARY KEY
);

CREATE TABLE account(
	username		VARCHAR(128)		PRIMARY KEY,
	role_id			VARCHAR(64)			REFERENCES roles(role_id),
	password		VARCHAR(64)			NOT NULL
);
