DROP TABLE IF EXISTS r34_presets;
CREATE TABLE r34_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    discord_user_id TEXT, -- null for owner-only presets
    content TEXT NOT NULL
);