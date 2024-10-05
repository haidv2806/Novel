CREATE TABLE search(
    search_id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    search_text TEXT,
    search_text_vector TSVECTOR,

    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

CREATE INDEX idx_gin_search_text_vector ON search USING GIN(search_text_vector);
CREATE INDEX idx_trgm_search_text ON search USING GIN (search_text gin_trgm_ops);