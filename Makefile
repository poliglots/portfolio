.PHONY: all crawl ui clean

all: crawl ui

crawl:
	cd crawl && yarn && yarn all

ui: crawl
	cd ui && yarn && yarn build

