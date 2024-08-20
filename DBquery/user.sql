CREATE TABLE users {
    userid SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    displayname VARCHAR(50) NOT NULL,
    picture BYTEA NOT NULL
}

-- picture là dạng base 64