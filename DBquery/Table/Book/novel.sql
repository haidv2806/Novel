CREATE TABLE novels (
    novel_id SERIAL PRIMARY KEY,
    novel_name VARCHAR (100) NOT NULL,
    author_id VARCHAR (50) NOT NULL,
    artist_id VARCHAR (50) NOT NULL,
    status VARCHAR (10) NOT NULL,
    description TEXT NOT NULL,
    total_index INT NOT NULL,
    average_rating DECIMAL(3, 2),
    rating_count SERIAL,
    views SERIAL,
    likes SERIAL
)

