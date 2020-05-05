CREATE TABLE shop_category(
    id              	VARCHAR(36)     PRIMARY KEY,
	category_name		VARCHAR(128),
	date_added			TIMESTAMP		WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE shop(
	id					VARCHAR(36)		PRIMARY KEY,
	category_id			VARCHAR(32)		REFERENCES shop_category(id),
	shop_name			VARCHAR(128),
	street_address		VARCHAR(256),
	suburb				VARCHAR(128),
	postcode			VARCHAR(8),
	date_added			TIMESTAMP		WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE user_account(
	id					VARCHAR(36)		PRIMARY KEY,
	email				VARCHAR(128)	NOT NULL,
	given_name			VARCHAR(128),
	family_name			VARCHAR(128),
	date_added			TIMESTAMP		WITH TIME ZONE NOT NULL DEFAULT NOW()
);
