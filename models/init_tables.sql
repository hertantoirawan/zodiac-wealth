CREATE TABLE IF NOT EXISTS sign_type (
    id          SERIAL PRIMARY KEY,
    name        TEXT
);

CREATE TABLE IF NOT EXISTS sign (
    id          SERIAL PRIMARY KEY,
    type_id     INTEGER REFERENCES sign_type (id),  
    name        TEXT,
    start_day   INTEGER,
    start_month INTEGER,
    end_day     INTEGER,
    end_month   INTEGER
);

CREATE TABLE IF NOT EXISTS industry (
    id          SERIAL PRIMARY KEY,
    name        TEXT
);

CREATE TABLE IF NOT EXISTS company (
    id              SERIAL PRIMARY KEY,
    name            TEXT,
    symbol          TEXT,
    industry_id     INTEGER REFERENCES industry (id),
    list_date       TIMESTAMPTZ,
    founded_year    INTEGER,
    sign_id         INTEGER REFERENCES sign (id)
);

CREATE TABLE IF NOT EXISTS company_sign (
    id              SERIAL PRIMARY KEY,
    sign_id         INTEGER REFERENCES sign (id)
);

CREATE TABLE IF NOT EXISTS match (
    id              SERIAL PRIMARY KEY,
    your_sign_id    INTEGER REFERENCES sign (id),
    match_sign_id   INTEGER REFERENCES sign (id),
    rating          INTEGER,
    description     TEXT
);

CREATE TABLE IF NOT EXISTS app_user (
    id              SERIAL PRIMARY KEY,
    name            TEXT,
    birth_month     INTEGER NOT NULL,
    birth_day       INTEGER NOT NULL,
    sign_id         INTEGER REFERENCES sign (id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    edited_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS auth (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES app_user (id),
    username        TEXT,
    password        TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    edited_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS wishlist (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES sign (id),
    company_id      INTEGER REFERENCES company (id),
    match_id        INTEGER REFERENCES match (id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    edited_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS comment (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES app_user (id),
    company_id      INTEGER REFERENCES company (id),
    comment         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    edited_at       TIMESTAMPTZ
);
