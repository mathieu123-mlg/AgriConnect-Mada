CREATE TABLE "user"
(
    id                SERIAL PRIMARY KEY,
    first_name        VARCHAR(100)        NOT NULL,
    last_name         VARCHAR(100),
    email             VARCHAR(150) UNIQUE NOT NULL,
    phone             VARCHAR(20) UNIQUE  NOT NULL,
    password_hash     VARCHAR(255)        NOT NULL
);

CREATE TABLE product
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description TEXT,
    quantity    NUMERIC(10, 2),
    price       NUMERIC(10, 2)
);

CREATE TABLE reservation
(
    id                    SERIAL PRIMARY KEY,
    buyer_id              INTEGER        NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
    farmer_id             INTEGER        NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
    product_id            INTEGER        NOT NULL REFERENCES product (id) ON DELETE RESTRICT,
    quantity              NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    reservation_date      TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    status                VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed')),
    created_at            TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);