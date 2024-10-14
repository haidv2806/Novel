CREATE TABLE chapters (
    chapter_id SERIAL PRIMARY KEY,
    chapter_name VARCHAR(500) NOT NULL,
    chapter_number INT,
    content VARCHAR(255),  -- Hoặc BLOB tùy thuộc vào DBMS
    volume_id INT NOT NULL,
    book_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_chapter_per_Volume UNIQUE (volume_id, chapter_name),
    FOREIGN KEY (volume_id) REFERENCES volumes(volume_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE  
);


--------------------------------------------------------------
Column Name     | Data Type                           | Description
--------------------------------------------------------------
id              | SERIAL PRIMARY KEY                  | Unique identifier for each chapter.
volume_id       | INTEGER NOT NULL                    | Foreign key referencing the volume table.
title           | VARCHAR(255)                        | Title of the chapter.
content         | VARCHAR(255)                        | Content of the chapter stored as binary data.
created_at      | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Creation timestamp.

FOREIGN KEY (volume_id) | REFERENCES volume(id) ON DELETE CASCADE | Ensures referential integrity with volume.