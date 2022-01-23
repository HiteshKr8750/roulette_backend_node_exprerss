DROP DATABASE IF EXISTS test_db;  

CREATE DATABASE IF NOT EXISTS test_db;   

USE test_db; 

DROP TABLE IF EXISTS user; 

CREATE TABLE user 
  ( 
     id BIGINT(20) UNSIGNED PRIMARY KEY AUTO_INCREMENT, 
     unique_id VARCHAR(655) UNIQUE NOT NULL,
     username   VARCHAR(655) UNIQUE NOT NULL, 
     password   VARCHAR(655) NOT NULL, 
     first_name VARCHAR(655) NOT NULL, 
     last_name  VARCHAR(655) NOT NULL, 
     email      VARCHAR(655) UNIQUE NOT NULL, 
     email_verified_at  TIMESTAMP NULL,
     role ENUM('super-admin', 'master','client','user') DEFAULT 'user', 
     avatar VARCHAR(655) NULL,
      is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );   