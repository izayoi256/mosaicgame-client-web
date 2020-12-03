uid = $(shell id -u)

up:
	docker-compose up -d --build
dev:
	docker-compose up -d --build
down:
	docker-compose down
ssh:
	docker-compose exec -u ${uid} app bash
