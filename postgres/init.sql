CREATE USER demo_application_user with password 'the_password';
CREATE DATABASE demo_application_db;
GRANT ALL PRIVILEGES ON DATABASE demo_application_db TO demo_application_user;

\connect demo_application_db;

-- Berechtigungen erteilen
GRANT CREATE ON SCHEMA public TO demo_application_user;

-- Eigentümer des Schemas ändern
ALTER SCHEMA public OWNER TO demo_application_user;

-- Tabelle erstellen und Eigentümer festlegen
CREATE TABLE public."order" (
    id SERIAL PRIMARY KEY,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL
);

ALTER TABLE public."order" OWNER TO demo_application_user;

