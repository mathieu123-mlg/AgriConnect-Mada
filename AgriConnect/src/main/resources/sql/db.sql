\c postgres
CREATE database agri_connect_db;

CREATE user agri_connect_db_manager with password '123456';

grant connect on database agri_connect_db to agri_connect_db_manager;

\c agri_connect_db

grant create, usage on schema public to agri_connect_db_manager;
alter default privileges in schema public
      grant select, update, insert, delete on tables to agri_connect_db_manager;
alter default privileges in schema public
      grant usage, select, update on sequences to agri_connect_db_manager;