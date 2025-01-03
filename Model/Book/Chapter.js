import db from "../../Service/database.js";
import mammoth from "mammoth";
import fs from "fs"
import Book from "./Book.js";

class Chapter {
    chapter_id
    chapter_name
    created_at

    async init(chapterID){
        const chapter = await Chapter.findById(chapterID)

        const chapter_id = chapter.chapter_id
        const chapter_name = chapter.chapter_name
        const created_at = chapter.created_at

        this.chapter_id = chapter_id;
        this.chapter_name = chapter_name;
        this.created_at = created_at;
    }

    static async create(name, content, volumeID, BookID) {
        const query = `
            INSERT INTO chapters (chapter_name, content, volume_id, book_id, chapter_number)
            SELECT
                $1,
                $2,
                $3,
                $4,
                COALESCE(MAX(chapter_number), 0) + 1
            FROM
                chapters
            WHERE
                volume_id = $3
            RETURNING chapter_id, chapter_name, volume_id, created_at
        `
        try {
            const result = await db.query(query, [name, content, volumeID, BookID])
            mammoth.extractRawText({ path: content })
                .then(function (result) {
                    var text = result.value; // The raw text
                    var wordCount = text.trim().split(/\s+/).length;  // Đếm số từ
                    const addTotalIndex = Book.addTotalIndex(BookID, wordCount);
                })
            return result.rows[0]
        } catch (err) {
            if (err.code === '23505') { // PostgreSQL unique violation error code
                throw new Error('Chapter name already exists for this Volume');
            }
            console.error('Error creating chapter:', err);
            throw err;
        }
    }

    static async findById(id) {
        const query = `
            SELECT *
            FROM chapters
            WHERE chapter_id = $1
        `
        try {
            const result = await db.query(query, [id])
            return result.rows[0];
        } catch (err) {
            console.error('Error finding chapter:', err);
            throw err;
        }
    }

    static async findByVolumeId(volumeID) {
        const query = `
            SELECT *
            FROM chapters
            WHERE volume_id = $1
        `
        try {
            const result = await db.query(query, [volumeID])
            return result.rows;
        } catch (err) {
            console.error('Error finding chapter:', err);
            throw err;
        }
    }

    static async getContentById(id) {
        const query = `
            SELECT chapters.book_id, book_name, volume_name, content
            FROM chapters
                INNER JOIN books ON books.book_id = chapters.book_id
                INNER JOIN volumes ON volumes.volume_id = chapters.volume_id
            WHERE chapter_id = $1
        `;

        try {
            const result = await db.query(query, [id]);
            if (result.rows.length === 0) {
                throw new Error('Chapter not found');
            }

            const filePath = result.rows[0].content;

            // Đọc file từ hệ thống file và chuyển đổi sang text
            const fileData = fs.readFileSync(filePath);

            // Sử dụng mammoth để chuyển đổi file Word thành plain text
            const mammothResult = await mammoth.extractRawText({ buffer: fileData });

            // Tách nội dung thành các đoạn văn bằng dấu xuống dòng (\n\n)
            const paragraphs = mammothResult.value
                .split(/\n\s*\n/)  // Regex tách đoạn văn dựa trên dấu xuống dòng kép hoặc khoảng trắng
                .filter(paragraph => paragraph.trim() !== '');  // Bỏ các đoạn rỗng

            return {
                book_id:result.rows[0].book_id,
                book_name: result.rows[0].book_name,
                volume_name: result.rows[0].volume_name,
                content: paragraphs
            };
        } catch (err) {
            console.error('Error retrieving chapter content:', err);
            throw err;
        }
    }
}

export default Chapter