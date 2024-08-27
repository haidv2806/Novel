CREATE TABLE image (
    image_id SERIAL PRIMARY KEY,
    book_id INT,
    image_path VARCHAR(255),

    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
)

