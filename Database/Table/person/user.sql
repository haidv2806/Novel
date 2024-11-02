CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(500) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    user_name VARCHAR(500) NOT NULL,
    avatar VARCHAR(500) NOT NULL
)

-- avatar là dạng base 64