CREATE TABLE novels_categories (
    novel_id INT,
    category_id INT,
    PRIMARY KEY (novel_id, category_id),
    FOREIGN KEY (novel_id) REFERENCES novels(novel_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
)

