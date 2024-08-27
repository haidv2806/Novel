import db from "../API_Router/database.js";

class Book {
    static async create(name, author, artist, status, decription) {
        const query = `
            INSERT INTO books (book_name, author_id, artist_id, status, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING book_id, book_name
        `;
        try {
            const result = await db.query(query, [name, author, artist, status, decription])
            return result.rows[0];
        } catch (err) {
            console.error('Error creating book:', err);
            throw err;
        }
    }

    static async findById(id) {
        const query = `
            SELECT *
            FROM books
            WWHERE book_id = $1
        `
        try {
            const result = await db.query(query, id)
            return result.rows[0];
        } catch (err) {
            console.error('Error finding book by id:', err);
            throw err;
        }
    }

    static async findByView(page) {
        const query = `
            SELECT book_name, image_path, author_name
            FROM books 
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            ORDER BY views DESC
            LIMIT 10 OFFSET $1
        `
        try {
            const result = await db.query(query, page * 10)
            return result.rows
        } catch (err) {
            console.error('Error finding book by view:', err);
            throw err;
        }
    }

    static async findByLike(page) {
        const query = `
            SELECT book_name, image_path, author_name
            FROM books 
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            ORDER BY likes DESC
            LIMIT 10 OFFSET $1
        `
        try {
            const result = await db.query(query, page * 10)
            return result.rows
        } catch (err) {
            console.error('Error finding book by like:', err);
            throw err;
        }
    }

    static async findByRating(page) {
        const query = `
            SELECT book_name, image_path, author_name
            FROM books 
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            ORDER BY average_rating DESC
            LIMIT 10 OFFSET $1
        `
        try {
            const result = await db.query(query, page * 10)
            return result.rows
        } catch (err) {
            console.error('Error finding book by rating:', err);
            throw err;
        }
    }

    static async findByGenre(genre, page) {
        const query = `
            SELECT book_name, image_path, author_name
            FROM books 
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
                INNER JOIN books_categories ON books.book_id = books_categories.book_id
                INNER JOIN categories ON books.category_id = categories.category_id
            WHERE category_name = $1
            LIMIT 10 OFFSET $1
        `
        try {
            const result = await db.query(query, [genre, page * 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by genre:', err);
            throw err;
        }
    }

    static async findByName(name, page) {
        // tìm kiếm gần giống
        const trgmQuery = `
            SELECT book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE book_name % $1
            LIMIT 10 OFFSET $2
        `;
        //tìm kiếm và chỉnh sửa các lỗi chính tả
        const levenshteinQuery = `
            SELECT book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE LEVENSHTEIN(UPPER(book_name), UPPER($1)) <= 2
            LIMIT 10 OFFSET $2
    `;
        // tìm kiếm toàn văn bản 
        const ftsQuery = `
            SELECT book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE to_tsvector('vietnamese', book_name) @@ plainto_tsquery('vietnamese', $1)
            LIMIT 10 OFFSET $2
    `;
        try {
            const trgmPromise = db.query(trgmQuery, [name, page * 10]);
            const levenshteinPromise = db.query(levenshteinQuery, [name, page * 10]);
            const ftsPromise = db.query(ftsQuery, [name, page * 10]);
            // Sử dụng Promise.race để lấy kết quả của truy vấn hoàn thành trước
            const result = await Promise.race([trgmPromise, levenshteinPromise, ftsPromise]);
            return result.rows
        } catch (err) {
            console.error('Error finding book by name:', err);
            throw err;
        }
    }

    static async findByAuthor(author, page) {
        const query = `
            SELECT book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE author_name = $1
            LIMIT 10 OFFSET $2
        `;
        try {
            const result = await db.query(query, [author, page * 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by author name:', err);
            throw err;
        }
    }

    static async findByArtist(artist, page) {
        const query = `
            SELECT book_name, image_path, author_name, artist_name
            FROM books 
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
                INNER JOIN artists ON books.artist_id = artists.artist_id
            WHERE author_name = $1
            LIMIT 10 OFFSET $2
        `;
        try {
            const result = await db.query(query, [artist, page * 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by artist name:', err);
            throw err;
        }
    }

    static async findByTrans(trans, page) {
        const query = `
        SELECT book_name, image_path, author_name, artist_name
        FROM books 
            INNER JOIN image ON books.book_id = image.book_id
            INNER JOIN authors ON books.author_id = authors.author_id
            INNER JOIN users ON books.user_id = users.user_id
        WHERE author_name = $1
        LIMIT 10 OFFSET $2
    `;
    try {
        const result = await db.query(query, [trans, page * 10])
        return result.rows
    } catch (err) {
        console.error('Error finding book by trans name:', err);
        throw err;
    }
    }
}