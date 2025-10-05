DROP TABLE IF EXISTS r34_presets;

CREATE TABLE r34_presets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
        CHECK(
            name != '' AND
            name GLOB '[A-Za-z0-9_-][A-Za-z0-9_-]*' AND
            length(name) <= 100
        ),
    discord_user_id TEXT NOT NULL,
    content TEXT NOT NULL
);
