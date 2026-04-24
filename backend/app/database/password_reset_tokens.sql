-- Run once on existing MySQL databases (create_all adds this for new installs).

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME NULL,
  UNIQUE KEY uq_password_reset_token_hash (token_hash),
  KEY ix_password_reset_user_id (user_id),
  CONSTRAINT fk_password_reset_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
