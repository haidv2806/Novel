-- Cài Đặt Tiện Ích pg_trgm
-- Đầu tiên, bạn cần cài đặt tiện ích pg_trgm nếu chưa cài:
CREATE EXTENSION pg_trgm;

-- Tạo Chỉ Mục Trigram
-- Tạo chỉ mục trigram cho cột văn bản để cải thiện hiệu suất tìm kiếm gần giống:
CREATE INDEX idx_books_book_name_trgm ON books USING GIST (book_name gist_trgm_ops);

-- Thực Hiện Tìm Kiếm Gần Giống
SELECT book_name, image_path, author_name
FROM books
INNER JOIN image ON books.book_id = image.book_id
INNER JOIN authors ON books.author_id = authors.author_id
WHERE book_name % $1
LIMIT 10;

-- ùy Chỉnh Tham Số Tìm Kiếm
-- Bạn có thể điều chỉnh tham số pg_trgm để kiểm soát độ chính xác của tìm kiếm:
SET pg_trgm.similarity_threshold = 0.3;
-- •	pg_trgm.similarity_threshold: Thiết lập ngưỡng độ tương tự, giá trị thấp hơn cho phép tìm kiếm rộng hơn.