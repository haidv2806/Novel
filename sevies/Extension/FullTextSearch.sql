-- PostgreSQL hỗ trợ tìm kiếm toàn văn bản (full-text search) cho nhiều ngôn ngữ khác nhau, 
-- bao gồm cả tiếng Việt. Để thực hiện tìm kiếm toàn văn bản với tiếng Việt, bạn cần sử dụng cấu hình từ điển và ngôn ngữ phù hợp.

-- ### 1. **Cài Đặt Tiện Ích `unaccent`**

-- Trước khi bắt đầu, bạn nên cài đặt tiện ích `unaccent` để loại bỏ dấu trong văn bản. Điều này giúp cải thiện khả năng tìm kiếm với các ký tự có dấu.


CREATE EXTENSION unaccent;


-- ### 2. **Tạo Từ Điển Tìm Kiếm Toàn Văn Bản cho Tiếng Việt**

-- Bạn có thể sử dụng `tsconfig` của PostgreSQL để cấu hình từ điển tìm kiếm cho tiếng Việt. 
-- PostgreSQL không có cấu hình từ điển tiếng Việt tích hợp sẵn, nhưng bạn có thể tạo cấu hình tùy chỉnh.

-- Tạo cấu hình tìm kiếm toàn văn bản cho tiếng Việt
CREATE TEXT SEARCH CONFIGURATION vietnamese ( COPY = pg_catalog.english );

-- Thêm các từ khóa hoặc cấu hình thêm nếu cần
ALTER TEXT SEARCH CONFIGURATION vietnamese
    ALTER MAPPING FOR hword, hword_part, word
    WITH unaccent, simple;


-- ### 3. **Chỉ Mục Tìm Kiếm Toàn Văn Bản**

-- Tạo chỉ mục cho cột văn bản để cải thiện hiệu suất tìm kiếm:


CREATE INDEX idx_books_book_name ON books USING GIST(to_tsvector('vietnamese', book_name));


-- ### 4. **Thực Hiện Tìm Kiếm Toàn Văn Bản**

-- Khi thực hiện tìm kiếm, bạn cần sử dụng cấu hình từ điển tiếng Việt (`vietnamese`):


SELECT book_name, image_path, author_name
FROM books
INNER JOIN image ON books.book_id = image.book_id
INNER JOIN authors ON books.author_id = authors.author_id
WHERE to_tsvector('vietnamese', book_name) @@ plainto_tsquery('vietnamese', $1)
LIMIT 10;


-- ### **Giải Thích**

-- - **`to_tsvector`**: Chuyển đổi văn bản thành dạng tìm kiếm toàn văn bản với cấu hình tiếng Việt.
-- - **`plainto_tsquery`**: Chuyển đổi chuỗi tìm kiếm thành truy vấn toàn văn bản với cấu hình tiếng Việt.

-- ### **Tối Ưu Hóa**

-- - **Chỉ Mục**: Đảm bảo rằng bạn có chỉ mục trên cột văn bản để cải thiện hiệu suất tìm kiếm.
-- - **Cấu Hình Từ Điển**: Điều chỉnh cấu hình từ điển và ánh xạ từ khóa tùy chỉnh theo nhu cầu của bạn.

-- ### **Tóm Tắt**

-- PostgreSQL hỗ trợ tìm kiếm toàn văn bản cho tiếng Việt thông qua việc cấu hình từ điển và sử dụng các
--  tiện ích hỗ trợ như `unaccent`. Đảm bảo rằng bạn đã tạo chỉ mục và cấu hình tìm kiếm phù hợp để đạt được hiệu suất tìm kiếm tốt nhất.


CREATE EXTENSION unaccent;
CREATE TEXT SEARCH CONFIGURATION vietnamese ( COPY = pg_catalog.english );
ALTER TEXT SEARCH CONFIGURATION vietnamese
    ALTER MAPPING FOR hword, hword_part, word
    WITH unaccent, simple;
CREATE INDEX idx_books_book_name ON books USING GIST(to_tsvector('vietnamese', book_name));
