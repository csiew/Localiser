CREATE TABLE shop_category(
    id              	VARCHAR(32)     PRIMARY KEY,
	category_name		VARCHAR(128),
	date_added			TIMESTAMP		WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE shop(
	id					VARCHAR(32)		PRIMARY KEY,
	category_id			VARCHAR(32)		REFERENCES shop_category(id),
	shop_name			VARCHAR(128),
	street_address		VARCHAR(256),
	suburb				VARCHAR(128),
	postcode			VARCHAR(8),
	date_added			TIMESTAMP		WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE user_account(
	username			VARCHAR(128)	PRIMARY KEY,
	date_added			TIMESTAMP		WITH TIME ZONE NOT NULL DEFAULT NOW()
);
