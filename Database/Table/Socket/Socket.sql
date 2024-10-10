CREATE TABLE socket (
    socket_id SERIAL PRIMARY KEY,      -- ID duy nhất cho mỗi tin nhắn
    room_id INT NOT NULL,
    user_id INT NOT NULL, -- ID của người dùng gửi tin nhắn
    content TEXT NOT NULL,      -- Nội dung của tin nhắn
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian gửi tin nhắn

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);