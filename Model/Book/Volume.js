import db from "../../Service/database.js";
import Chapter from "./Chapter.js";

class Volume {
    volume_id
    volume_name
    chapters
    created_at

    constructor() {
        this.chapters = []; // Khởi tạo giá trị ban đầu cho thuộc tính cần thiết
    }

    async init(volumeID) {
        const volume = await Volume.findById(volumeID);

        if (volume) {
            this.volume_id = volume.volume_id;
            this.volume_name = volume.volume_name;
            this.created_at = volume.created_at;

            // Lấy tất cả chapters và khởi tạo chúng bất đồng bộ
            const allChapters = await Chapter.findByVolumeId(volumeID);
            for (const chapterData of allChapters) {
                const chapter = new Chapter(); // Tạo chapter
                await chapter.init(chapterData.chapter_id); // Khởi tạo bất đồng bộ cho chapter
                this.chapters.push(chapter); // Thêm chapter vào danh sách
            }
            return this;
        } else {
            throw new Error("Volume not found");
        }
    }

    static async create(name, bookID) {
        const query = `
            INSERT INTO volumes (volume_name, book_id, volume_number)
            SELECT
                $1,
                $2,
                COALESCE(MAX(volume_number), 0) + 1
            FROM
                volumes
            WHERE
                book_id = $2
            RETURNING *
        `
        try {
            if (!name || !bookID) {
                throw new Error('Invalid input: name and bookID are required');
            }

            const result = await db.query(query, [name, bookID])
            return result.rows[0]
        } catch (err) {
            // Xử lý lỗi khi volume_name đã tồn tại
            if (err.code === '23505') { // PostgreSQL unique violation error code
                throw new Error('Volume name already exists for this book');
            }

            console.error('Error creating volume:', err);
            throw err;
        }
    }

    static async findByName(name, bookID) {
        const query = `
            SELECT *
            FROM volumes
            WHERE volume_name = $1
            AND book_id = $2
        `
        try {
            const result = await db.query(query, [name, bookID])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding volume:', err);
            throw err;
        }
    }

    static async findById(id) {
        const query = `
            SELECT *
            FROM volumes
            WHERE volume_id = $1
        `
        try {
            const result = await db.query(query, [id])
            return result.rows[0]
        } catch (err) {
            console.error('Error finding volume:', err);
            throw err;
        }
    }

    static async findByBookId(bookID) {
        const query = `
            SELECT *
            FROM volumes
            WHERE book_id = $1
        `
        try {
            const result = await db.query(query, [bookID])
            return result.rows
        } catch (err) {
            console.error('Error finding volume:', err);
            throw err;
        }
    }
}

export default Volume