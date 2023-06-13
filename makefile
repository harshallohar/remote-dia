start_influx:
	docker-compose up

dev:
	nodemon index.mjs

prod:
	pm2 start index.mjs --name influx_type

create-zip:
	zip -r ../influx-diff.zip *  -x thunder-tests/*
