CREATE OR REPLACE FUNCTION update_search()
RETURNS TRIGGER AS $$
BEGIN
    -- Chèn thông tin vào bảng search khi có sách mới
    INSERT INTO search (book_id, search_text, search_text_vector)
    SELECT 
        NEW.book_id,
        (b.book_name || ' ' || b.description || ' ' || a.author_name || ' ' || ar.artist_name),
        to_tsvector(b.book_name || ' ' || b.description || ' ' || a.author_name || ' ' || ar.artist_name)
    FROM 
        books b
    JOIN 
        authors a ON b.author_id = a.author_id
    JOIN 
        artists ar ON b.artist_id = ar.artist_id
    WHERE 
        b.book_id = NEW.book_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để cập nhật bảng search sau khi có INSERT vào bảng books
CREATE TRIGGER trigger_update_search
AFTER INSERT ON books
FOR EACH ROW
EXECUTE FUNCTION update_search();