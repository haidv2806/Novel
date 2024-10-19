import db from "../../Service/database.js";
import Category from "./Category.js";
import Volume from "./Volume.js";
import Chapter from "./Chapter.js";
import Author from "../Person/author.js";
import Artist from "../Person/Artist.js";


class Book {
    book_id
    book_name
    book_image
    book_genre
    volumes
    author
    artist
    trans_name
    status
    description
    total_index
    average_rating
    rating_count
    views
    follow
    latest_update

    constructor() {
        this.volumes = []
    }

    async init(BookID) {
        const book = await Book.findById(BookID)

        if (book) {
            const author_name = await Author.findById(book.author_id)
            const artist_name = await Artist.findById(book.artist_id)
            const total_views = await Book.countView(book.book_id)
            const rating = await Book.ratingStatus(book.book_id)
            const total_follows = await Book.countFollow(book.book_id)
            const last_update = await Book.checkLastUpdate(book.book_id)
            const bookGenre = await Category.findAllCategoriessByBookId(book.book_id)


            this.book_id = book.book_id
            this.book_name = book.book_name
            this.book_image = book.book_image
            this.book_genre = bookGenre
            this.author = author_name
            this.artist = artist_name
            this.status = book.status
            this.description = book.description
            this.total_index = book.total_index
            
            this.average_rating = rating.average_rating.toFixed(2)
            this.rating_count = rating.total_rating
            this.views = total_views
            this.follow = total_follows
            this.latest_update = last_update

            // Lấy tất cả volumes và khởi tạo chúng bất đồng bộ
            const allVolumes = await Volume.findByBookId(BookID);
            for (const volumeData of allVolumes) {
                const volume = new Volume(); // Tạo volume
                await volume.init(volumeData.volume_id); // Khởi tạo bất đồng bộ cho volume
                this.volumes.push(volume); // Thêm volume vào danh sách
            }

            return this;
        } else {
            throw new Error("Book not found");
        }
    }

    static async create(name, book_image, author, artist, status, decription) {
        const query = `
            INSERT INTO books (book_name, book_image, author_id, artist_id, status, description)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING book_id, book_name
        `
        try {
            const checkAuthor = await Author.checkExist(author)
            const author_id = checkAuthor.author_id
            const checkArtist = await Artist.checkExist(artist)
            const artist_id = checkArtist.artist_id
            const result = await db.query(query, [name, book_image, author_id, artist_id, status, decription])
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
            SELECT books.book_id, book_name, book_image, author_name, 
                COUNT(user_interactions.interaction_id) AS total_views
            FROM books
            INNER JOIN authors ON books.author_id = authors.author_id
            LEFT JOIN user_interactions ON books.book_id = user_interactions.book_id
                AND user_interactions.interaction_type = 'view'
            GROUP BY books.book_id, book_name, book_image, author_name
            ORDER BY total_views DESC
            LIMIT 10 OFFSET $1
        `
        try {
            const result = await db.query(query, [(page * 10) - 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by view:', err);
            throw err;
        }
    }

    static async findByLike(page) {
        const query = `
            SELECT books.book_id, book_name, book_image, author_name, 
                   COUNT(user_interactions.interaction_id) AS total_likes
            FROM books
            INNER JOIN authors ON books.author_id = authors.author_id
            LEFT JOIN user_interactions ON books.book_id = user_interactions.book_id
                AND user_interactions.interaction_type = 'like'
            GROUP BY books.book_id, book_name, book_image, author_name
            ORDER BY total_likes DESC
            LIMIT 10 OFFSET $1
        `;
        try {
            const result = await db.query(query, [(page * 10) - 10]);
            return result.rows;
        } catch (err) {
            console.error('Error finding books by like:', err);
            throw err;
        }
    }

    static async findByRating(page) {
        const query = `
            SELECT books.book_id, book_name, book_image, author_name, 
                   AVG(CAST(user_interactions.value AS FLOAT)) AS average_rating
            FROM books
                INNER JOIN authors ON books.author_id = authors.author_id
                LEFT JOIN user_interactions ON books.book_id = user_interactions.book_id
                AND user_interactions.interaction_type = 'rating'
            GROUP BY books.book_id, book_name, book_image, author_name
            ORDER BY average_rating DESC
            LIMIT 10 OFFSET $1
        `;
        try {
            const result = await db.query(query, [(page * 10) - 10]);
            return result.rows;
        } catch (err) {
            console.error('Error finding books by rating:', err);
            throw err;
        }
    }

    static async findByGenre(genre, page) {
        const query = `
            SELECT books.book_id, book_name, book_image, author_name
            FROM books 
                INNER JOIN authors ON books.author_id = authors.author_id
                INNER JOIN books_categories ON books.book_id = books_categories.book_id
                INNER JOIN categories ON books.category_id = categories.category_id
            WHERE category_name = $1
            LIMIT 10 OFFSET $2
        `
        try {
            const result = await db.query(query, [genre, (page * 10) - 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by genre:', err);
            throw err;
        }
    }

    static async findByIdForSearch(id) {
        const query = `
            SELECT books.book_id, book_name, book_image, author_name
            FROM books
                INNER JOIN authors ON books.author_id = authors.author_id
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

    static async findBySearchName(name, page) {
        // tìm kiếm toàn văn bản 
        const query = ` 
            SELECT book_id, ts_rank(search_text_vector, plainto_tsquery('vietnamese', $1)) AS rank
            FROM search
            WHERE search_text_vector @@ plainto_tsquery('vietnamese', $1)
            OR search_text %> $1
            ORDER BY rank
            LIMIT 10 OFFSET $2;
        `
        try {
            const search = await db.query(query, [name, (page * 10) - 10])
            if (!search.rows[0]) {
                throw new Error("Không tìm thấy kết quả nào")
            }

            const result = [];
            for (let i = 0; i < search.rows.length; i++) {
                const book = await Book.findByIdForSearch(search.rows[i].book_id);
                result.push(book);
            }

            return result
        } catch (err) {
            console.error('Error finding book by name:', err);
            throw err;
        }
    }

    static async findByAuthor(author, page) {
        const query = `
            SELECT books.book_id, book_name, book_image, author_name
            FROM books
                INNER JOIN authors ON books.author_id = authors.author_id
            WHERE author_name = $1
            LIMIT 10 OFFSET $2
        `
        try {
            const result = await db.query(query, [author, (page * 10) - 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by author name:', err);
            throw err;
        }
    }

    static async findByArtist(artist, page) {
        const query = `
            SELECT books.book_id, book_name, book_image, author_name, artist_name
            FROM books 
                INNER JOIN authors ON books.author_id = authors.author_id
                INNER JOIN artists ON books.artist_id = artists.artist_id
            WHERE author_name = $1
            LIMIT 10 OFFSET $2
        `
        try {
            const result = await db.query(query, [artist, (page * 10) - 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by artist name:', err);
            throw err;
        }
    }

    static async findByTrans(trans, page) {
        const query = `
        SELECT books.book_id, book_name, book_image, author_name, artist_name
        FROM books 
            INNER JOIN authors ON books.author_id = authors.author_id
            INNER JOIN users ON books.user_id = users.user_id
        WHERE author_name = $1
        LIMIT 10 OFFSET $2
        `
        try {
            const result = await db.query(query, [trans, (page * 10) - 10])
            return result.rows
        } catch (err) {
            console.error('Error finding book by trans name:', err);
            throw err;
        }
    }

    static async addTotalIndex(id, indexNumber) {
        const query = `
            UPDATE books
            SET total_index = COALESCE(total_index, 0) + $2
            WHERE book_id = $1
            RETURNING * 
        `
        try {
            console.log(id, indexNumber);

            const result = await db.query(query, [id, indexNumber])
            return result.rows[0]
        } catch (err) {
            console.error('Error update tolal index', err);
            throw err;
        }
    }

    static async countView(id) {
        const query = `
            SELECT COUNT(*) AS total_views
            FROM user_interactions
            WHERE interaction_type = 'view'
            AND book_id = $1
        `
        try {
            const result = await db.query(query, [id])
            return result.rows[0].total_views
        } catch (err) {
            console.error('Error count View', err);
            throw err;
        }
    }

    static async countFollow(id){
        const query = `
            SELECT COUNT(*) AS total_follows
            FROM user_interactions
            WHERE interaction_type = 'follow'
            AND book_id = $1
        `
        try {
            const result = await db.query(query, [id])
            return result.rows[0].total_follows
        } catch (err) {
            console.error('Error count follow', err);
            throw err;
        }
    }

    static async ratingStatus(id) {
        const query = `
            SELECT COUNT(*) AS total_rating, AVG(CAST(value AS FLOAT)) AS average_rating
            FROM user_interactions
            WHERE interaction_type = 'rating'
            AND book_id = $1
        `;
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (err) {
            console.error('Error handler rating', err);
            throw err;
        }
    }

    static async checkLastUpdate(bookId) {
        const query = `
            SELECT MAX(created_at) AS last_update
            FROM chapters
            WHERE book_id = $1
        `;
        try {
            const result = await db.query(query, [bookId]);
            return result.rows[0].last_update;
        } catch (err) {
            console.error('Error checking last update', err);
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

            const chapter = await Chapter.create(chapterName, content, volume_id, book_id)
            return chapter
        } catch (err) {
            console.error('Error create Chapter:', err);
            throw err;
        }
    }
}

export default Book