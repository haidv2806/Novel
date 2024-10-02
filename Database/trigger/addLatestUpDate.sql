CREATE OR REPLACE FUNCTION update_books_latest_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Cập nhật cột latest_update trong bảng books
    UPDATE books
    SET latest_update = NOW()
    WHERE book_id = NEW.book_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chapter_insert_trigger
AFTER INSERT ON chapters
FOR EACH ROW
EXECUTE FUNCTION update_books_latest_update();