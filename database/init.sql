DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'taskuser') THEN
    CREATE ROLE taskuser WITH LOGIN PASSWORD 'suasenha';
  END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE taskdb TO taskuser;
GRANT ALL ON SCHEMA public TO taskuser;
