CREATE TABLE books_categories (
    book_id INT,
    category_id INT,
    PRIMARY KEY (novel_id, category_id),

    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
)