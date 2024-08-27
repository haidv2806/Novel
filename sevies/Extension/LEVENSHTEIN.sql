-- Hàm `LEVENSHTEIN` trong PostgreSQL tính khoảng cách chỉnh sửa giữa các chuỗi, và nó hoạt động trên tất cả các ngôn ngữ, bao gồm cả tiếng Việt. Đây là một công cụ mạnh mẽ cho việc tìm kiếm gần giống khi bạn cần tính toán khoảng cách chỉnh sửa giữa các chuỗi văn bản, bất kể ngôn ngữ.

-- ### **Sử Dụng `LEVENSHTEIN` với Tiếng Việt**

-- Khi sử dụng hàm `LEVENSHTEIN`, bạn có thể tìm các chuỗi gần giống với chuỗi tìm kiếm, bất kể có dấu hoặc không có dấu. Đây là cách thực hiện cơ bản:

-- 1. **Cài Đặt Tiện Ích `fuzzystrmatch`**

--    Đầu tiên, đảm bảo rằng tiện ích `fuzzystrmatch` đã được cài đặt trong cơ sở dữ liệu của bạn:


   CREATE EXTENSION fuzzystrmatch;


-- 2. **Thực Hiện Tìm Kiếm Gần Giống**

--    Bạn có thể sử dụng hàm `LEVENSHTEIN` để so sánh độ tương đồng giữa chuỗi tìm kiếm và các chuỗi trong cơ sở dữ liệu:


   SELECT book_name, image_path, author_name
   FROM books
   INNER JOIN image ON books.book_id = image.book_id
   INNER JOIN authors ON books.author_id = authors.author_id
   WHERE LEVENSHTEIN(UPPER(book_name), UPPER($1)) <= 2
   LIMIT 10;


--    - **`LEVENSHTEIN`**: Tính khoảng cách chỉnh sửa giữa hai chuỗi. Bạn có thể điều chỉnh ngưỡng (ở đây là `<= 2`) để tìm các chuỗi gần giống.

-- ### **Ưu Điểm và Nhược Điểm**

-- - **Ưu Điểm**:
--   - Đơn giản để sử dụng và hiểu.
--   - Có thể xử lý các chuỗi có dấu và các lỗi chính tả.
--   - Hữu ích cho các tìm kiếm gần giống với độ chính xác cao.

-- - **Nhược Điểm**:
--   - Tính toán khoảng cách chỉnh sửa có thể tốn thời gian, đặc biệt là với tập dữ liệu lớn.
--   - Hiệu suất có thể kém hơn so với các phương pháp tìm kiếm gần giống khác như `pg_trgm`.
