CREATE TABLE volumes (
    volume_id SERIAL PRIMARY KEY,
    volume_name VARCHAR (50) NOT NULL,
    book_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
)



--------------------------------------------------------------
Column Name     | Data Type                           | Description
--------------------------------------------------------------
id              | SERIAL PRIMARY KEY                  | Unique identifier for each volume.
title           | VARCHAR(255)                        | Title of the volume.
description     | TEXT                                | Description of the volume.
created_at      | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Creation timestamp.

