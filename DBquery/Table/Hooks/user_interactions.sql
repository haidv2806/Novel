CREATE TABLE user_interactions (
    interaction_id SERIAL PRIMARY KEY,
    novel_id INT,
    user_id INT,
    interaction_type VARCHAR(50),
    value TEXT,
    interaction_date DATE,

    FOREIGN KEY (novel_id) REFERENCES novels(novel_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)