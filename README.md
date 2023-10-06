# datasus_bi

[DW](https://dbdiagram.io/d/6321cfbd0911f91ba5abe48c)
[PBIX](https://1drv.ms/u/s!Aj3skRQjCzc0heEavkjXDOyQ332wIQ?e=TN91Fd)

list process id by port
sudo lsof -i :5432

run project => 
npm start
npm run elt

docker-compose up -d && npm run etl

*******************************************************************

select * from health_organizations limit 5;

select * from hospitalizations limit 5;

select * from health_organizations where id = 'health_organizations';

select count(*) from health_organizations where city_id = 'NA';

drop table hospitalizations;
drop table procedures;
drop table pacients;
drop table health_organizations;
drop table diagnostics;
drop table cities;