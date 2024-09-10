CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Chỉ xử lý khi interaction_type là 'rating'
    IF NEW.interaction_type = 'rating' THEN
        -- Cập nhật số lượng và điểm đánh giá trung bình của sách
        UPDATE books
        SET
            rating_count = COALESCE(rating_count, 0) + 1,
            average_rating = (
                (COALESCE(average_rating, 5) * rating_count) + CAST(NEW.value AS DECIMAL)
            ) / (rating_count + 1)
        WHERE book_id = NEW.book_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_book_rating
AFTER INSERT ON user_interactions
FOR EACH ROW
EXECUTE FUNCTION update_book_rating();