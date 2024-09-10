CREATE OR REPLACE FUNCTION update_book_likes()
RETURNS TRIGGER AS $$
BEGIN
    -- Chỉ xử lý khi interaction_type là 'like'
    IF NEW.interaction_type = 'like' THEN
        -- Cập nhật số lượng likes của sách
        UPDATE books
        SET
            likes = COALESCE(likes, 0) + 1
        WHERE book_id = NEW.book_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_book_likes
AFTER INSERT ON user_interactions
FOR EACH ROW
WHEN (NEW.interaction_type = 'like')
EXECUTE FUNCTION update_book_likes();