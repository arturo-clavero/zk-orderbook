PHONY: vm stop up down restart run build admin golive pnpm envio-dev envio-down network

DOCKER_COMPOSE = docker-compose
PNPM = pnpm
TRADING_DB = trading_db
CONTAINER_TRADE = trading
NEST_START = nest start

#!!!!!!!!!!!!!!!!FIRST TIME RUNNING PROJECT NEED TO USE MIGRATIONS!!!!!!!!!!!!!!!!!#
network:
	docker network create envio-shared
migrate:
	cd backend && pnpm prisma migrate dev --schema ./src/lib/prisma-trading-database/schema.prisma
envio-dev:
	cd envio && pnpm dev
envio-down:
	cd envio && pnpm envio local docker down
#########################Prisma commands##################
studio:
	cd backend && pnpm prisma studio --schema ./src/lib/prisma-trading-database/schema.prisma

#########################RUN PROJECT######################
dev : vm upd runBackend runFrontend
##########################DOCKER##########################
vm:
	colima start
upd:
	$(DOCKER_COMPOSE) up -d
up:
	$(DOCKER_COMPOSE) up
down:
	$(DOCKER_COMPOSE) down
stop:
	colima stop
clean:
	docker system prune -a --volumes -f
destroy:
	docker system prune -a --volumes
restart: down up

############################NEST##########################
swcType:
	cd backend && $(NEST_START) -b swc --type-check
swcWatch:
	cd backend && $(NEST_START) -b swc -w
swc:
	cd backend && $(NEST_START) -b swc

#############################PNPM##########################
runBackend:
	cd backend && $(PNPM) run start
runFrontend:
	cd frontend && $(PNPM) start
build:
	$(PNPM) build
watch:
	$(PNPM) run start:dev

####ENTERING CONTAINERS####
admin:
	docker exec -it $(CONTAINER_TRADE) psql -U admin -d $(TRADING_DB)
