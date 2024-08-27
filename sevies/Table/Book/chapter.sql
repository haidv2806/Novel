CREATE TABLE chapter (
    chapter_id SERIAL PRIMARY KEY,
    volume_id INT NOT NULL,
    chapter_name VARCHAR(255) NOT NULL,
    content BYTEA,  -- Hoặc BLOB tùy thuộc vào DBMS
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (volume_id) REFERENCES volume(id) ON DELETE CASCADE
);


--------------------------------------------------------------
Column Name     | Data Type                           | Description
--------------------------------------------------------------
id              | SERIAL PRIMARY KEY                  | Unique identifier for each chapter.
volume_id       | INTEGER NOT NULL                    | Foreign key referencing the volume table.
title           | VARCHAR(255)                        | Title of the chapter.
content         | BYTEA                               | Content of the chapter stored as binary data.
created_at      | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Creation timestamp.

FOREIGN KEY (volume_id) | REFERENCES volume(id) ON DELETE CASCADE | Ensures referential integrity with volume.