INSERT INTO search (book_id, search_text , search_text_vector)
SELECT 
4,
(book_name || ' ' ||  description || ' ' || author_name || ' ' || artist_name ),
to_tsvector('vietnamese', (book_name || ' ' ||  description || ' ' || author_name || ' ' || artist_name ))
FROM books, authors, artists
WHERE book_id = 4
AND artists.artist_id = 1
AND authors.author_id = 1

SELECT book_id
from search
WHERE search_text @@ plainto_tsquery('vietnamese','kumo')

        // tìm kiếm toàn văn bản 
        const query = ` 
            SELECT book_id
            from search
            WHERE search_text @@ plainto_tsquery('vietnamese', $1)
            LIMIT 10 OFFSET $2
        `
        try {
            const search = await db.query(query, [name, (page * 10) - 10])
            if (!search.rows[0]) {
                throw new Error("Không tìm thấy kết quả nào")
            }
            console.log(search.rows);
            
            
            const result = [];

            for (let i = 0; i < search.rows.length; i++) {
                const book = await Book.findById(search.rows[i].book_id);
                result.push(book);
            }
            
            return result