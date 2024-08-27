CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    book_name VARCHAR (100) NOT NULL,
    author_id VARCHAR (50),
    artist_id VARCHAR (50),
    trans_id VARCHAR (50),
    status VARCHAR (10) NOT NULL,
    description TEXT NOT NULL,
    total_index INT NOT NULL,
    average_rating DECIMAL(3, 2),
    rating_count SERIAL,
    views SERIAL,
    likes SERIAL,

    FOREIGN KEY (author_id) REFERENCES authors(author_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
    FOREIGN KEY (trans_id) REFERENCES users(user_id),
)




Column Name     | Data Type           | Description
------------------------------------------------------------------------------------------
manga_id        | SERIAL PRIMARY KEY  | Unique identifier for each manga.
title           | VARCHAR(255)        | Title of the manga.
author_id       | INTEGER             | Foreign key referencing the authors table.
artist_id       | INTEGER             | Foreign key referencing the artists table.
status          | VARCHAR(50)         | Status of the manga (e.g., “Completed”).
summary         | TEXT                | Summary of the manga.
last_updated    | DATE                | Date when the manga was last updated.
total_chapters  | INTEGER             | Total number of chapters.
average_rating  | DECIMAL(3, 2)       | Average rating of the manga.
rating_count    | INTEGER             | Total number of ratings received.
views           | BIGINT              | Total number of views.
likes           | INTEGER             | Total number of likes.