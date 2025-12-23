dùng Internel link DB 
backup sql : pg_restore -h dpg-d4s214khg0os73dbgd3g-a.singapore-postgres.render.com -U taki -d bluemoon_zyc0 --clean --if-exists --no-owner --no-privileges backup.sql

test : \dt
SELECT COUNT(*) FROM residents;

PGPASSWORD=QOHw1gGQhfpqLxv3NdLJhVXyKh2NKtTz