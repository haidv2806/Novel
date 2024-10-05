CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Ràng buộc khóa ngoại để liên kết với bảng users (nếu có)
  CONSTRAINT fk_user
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
    ON DELETE CASCADE
);