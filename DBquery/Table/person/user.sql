CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    avatar TEXT NOT NULL
)

-- avatar là dạng base 64