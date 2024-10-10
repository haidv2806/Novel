CREATE TABLE socket_replies (
    replies_id SERIAL PRIMARY KEY,            -- ID duy nhất cho mỗi tin nhắn trả lời
    socket_id INT NOT NULL,  -- ID của tin nhắn gốc
    user_id INT NOT NULL,    -- ID của người dùng trả lời
    content TEXT NOT NULL,            -- Nội dung tin nhắn trả lời
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian trả lời

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (socket_id) REFERENCES socket(socket_id) ON DELETE CASCADE
);