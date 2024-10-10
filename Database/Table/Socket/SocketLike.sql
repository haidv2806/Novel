CREATE TABLE socket_likes (
    socket_likes_id SERIAL PRIMARY KEY,            -- ID duy nhất cho mỗi lượt thích
    socket_id INT,  -- ID của tin nhắn được thích
    replies_id INT,  -- ID của tin nhắn trả lời được thích
    user_id INT NOT NULL,    -- ID của người dùng thích tin nhắn
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian thích

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (socket_id) REFERENCES socket(socket_id) ON DELETE CASCADE,
    FOREIGN KEY (replies_id) REFERENCES socket_replies(replies_id) ON DELETE CASCADE
);