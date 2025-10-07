-- Migration number: 0001 	 2025-10-07T10:08:33.154Z
CREATE TABLE
    r34_presets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE CHECK (LENGTH (name) BETWEEN 1 AND 100),
        description TEXT NOT NULL CHECK (LENGTH (description) BETWEEN 0 AND 1000),
        content TEXT NOT NULL CHECK (LENGTH (content) BETWEEN 1 AND 1000),
        discord_user_id TEXT NOT NULL
    );