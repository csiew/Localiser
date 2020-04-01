CREATE TABLE shop(
	id					VARCHAR(32)	PRIMARY KEY,
	shop_name			VARCHAR(128),
	street_address		VARCHAR(256),
	suburb				VARCHAR(128),
	postcode			VARCHAR(8),
	date_added			DATE
);

CREATE TABLE shop_category(
    id              	VARCHAR(32)     PRIMARY KEY,
	category_name		VARCHAR(128),
	date_added			DATE
);

CREATE TABLE user_account(
	username			VARCHAR(128)		PRIMARY KEY,
	organisation		VARCHAR(128)		REFERENCES organisation(id)		NOT NULL,
	date_created		VARCHAR(128)	    NOT NULL,
	date_last_accessed	VARCHAR(128)
);
