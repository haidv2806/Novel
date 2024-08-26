CREATE TABLE Image (
    image_id SERIAL PRIMARY KEY,
    novel_id INT,
    image_path VARCHAR(255),

    FOREIGN KEY (novel_id) REFERENCES novels(novel_id) ON DELETE CASCADE
)

