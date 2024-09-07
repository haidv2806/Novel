import db from "../../API_Router/database.js";
import Volume from "./Volume.js";
import Chapter from "./Chapter.js";
import Author from "../Person/author.js";
import Artist from "../Person/Artist.js";


class Book {
    static async create(name, author, artist, status, decription) {
        const query = `
            INSERT INTO books (book_name, author_id, artist_id, status, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING book_id, book_name
        `
        try {
            const checkAuthor = await Author.checkExist(author)
            const author_id = checkAuthor.author_id
            const checkArtist = await Artist.checkExist(artist)
            const artist_id = checkArtist.artist_id
            const result = await db.query(query, [name, author_id, artist_id, status, decription])
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
            WHERE book_id = $1
        `
        try {
            const result = await db.query(query, [id])
            if (!result.rows[0]) {
                throw new Error("Không tồn tại id")
            }
            return result.rows[0];
        } catch (err) {
            console.error('Error finding book by id:', err);
            throw err;
        }
    }

    static async findByName(name) {
        const query = `
            SELECT books.book_id, book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE book_name = $1            
        `
        try {
            const result = await db.query(query, [name])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding book by name:', err);
            throw err;
        }
    }

    static async findByNameCreateVolume(name) {
        const query = `
            SELECT book_id, book_name
            FROM books
            WHERE book_name = $1            
        `
        try {
            const result = await db.query(query, [name])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding book by name:', err);
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
            const result = await db.query(query, [page * 10])
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
            const result = await db.query(query, [page * 10])
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
            const result = await db.query(query, [page * 10])
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
            LIMIT 10 OFFSET $2
        `
        try {
            const result = await db.query(query, [genre, page * 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by genre:', err);
            throw err;
        }
    }

    static async findBySearchName(name, page) {
        // tìm kiếm gần giống
        const trgmQuery = `
            SELECT book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE book_name % $1
            LIMIT 10 OFFSET $2
        `
        //tìm kiếm và chỉnh sửa các lỗi chính tả
        const levenshteinQuery = `
            SELECT book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE LEVENSHTEIN(UPPER(book_name), UPPER($1)) <= 2
            LIMIT 10 OFFSET $2
        `
        // tìm kiếm toàn văn bản 
        const ftsQuery = `
            SELECT book_name, image_path, author_name
            FROM books
                INNER JOIN image ON books.book_id = image.book_id
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE to_tsvector('vietnamese', book_name) @@ plainto_tsquery('vietnamese', $1)
            LIMIT 10 OFFSET $2
        `
        try {
            // Thực hiện truy vấn và bắt lỗi riêng cho từng promise
            const trgmPromise = db.query(trgmQuery, [name, (page * 10) - 10])
                .then(result => result.rows.length > 0 ? result : null)
                .catch(err => null);

            const levenshteinPromise = db.query(levenshteinQuery, [name, (page * 10) - 10])
                .then(result => result.rows.length > 0 ? result : null)
                .catch(err => null);

            const ftsPromise = db.query(ftsQuery, [name, (page * 10) - 10])
                .then(result => result.rows.length > 0 ? result : null)
                .catch(err => null);

            // Sử dụng Promise.race để lấy kết quả của truy vấn hoàn thành trước
            const result = await Promise.race([trgmPromise, levenshteinPromise, ftsPromise]);
            if (!result.rows[0]) {
                throw new Error("Không tìm thấy kết quả nào")
            }
            console.log(result);


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
        `
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
        `
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
        `
        try {
            const result = await db.query(query, [trans, page * 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by trans name:', err);
            throw err;
        }
    }

    static async createVolume(bookName, volumeName) {
        try {
            const result = await Book.findByNameCreateVolume(bookName)

            if (!result) {
                throw new Error(`không tìm thấy sách tên "${bookName}"`);
            }

            const book_id = result.book_id
            const volume = await Volume.create(volumeName, book_id)
            return volume
        } catch (err) {
            console.error('Error create volume:', err);
            throw err;
        }
    }

    static async createChapter(bookName, volumeName, chapterName, content) {
        try {
            const checkBook = await Book.findByNameCreateVolume(bookName)
            if (!checkBook) {
                throw new Error(`không tìm thấy sách tên ${bookName}`);
            }
            const book_id = checkBook.book_id

            const checkVolume = await Volume.findByName(volumeName, book_id)
            if (!checkVolume) {
                throw new Error(`không tìm thấy volume ${volumeName} thuộc sách tên ${bookName}`);
            }
            const volume_id = checkVolume.volume_id

            const chapter = await Chapter.create(chapterName, content, volume_id)
            return chapter
        } catch (err) {
            console.error('Error create Chapter:', err);
            throw err;
        }
    }
}

export default Book