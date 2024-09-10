CREATE TABLE user_interactions (
    interaction_id SERIAL PRIMARY KEY,
    book_id INT,
    user_id INT,
    interaction_type VARCHAR(50),
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)