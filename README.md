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

select distinct city_id from health_organizations;

select count(distinct city_id) from health_organizations;


Para fazer o dump
1. No arquivo docker compose comente o volume: "datasus-volume:/var/lib/postgresql/data:rw"
2. No arquivo docker compose descomente o volume: ""./db:/docker-entrypoint-initdb.d:rw"
3. execute o comando docker-compose up -d --build para rebuildar o container
4. Execute o comando docker ps
5. Com o id do container faça login usando o comando: docker exec -it {id_do_container} bash
6. Dentro do container rode o comando abaixo para fazer o dump
    pg_dump -U datasus datasus | gzip > docker-entrypoint-initdb.d/database.sql.gz;



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