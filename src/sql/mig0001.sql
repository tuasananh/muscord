DROP TABLE IF EXISTS r34_presets;

CREATE TABLE
    r34_presets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE CHECK (LENGTH (name) BETWEEN 1 AND 100),
        discord_user_id TEXT NOT NULL,
        content TEXT NOT NULL CHECK (LENGTH (content) BETWEEN 1 AND 4000)
    );