.PHONY: all crawl ui clean

all: crawl ui

crawl:
	cd crawl && yarn && yarn all

ui: crawl
	cd ui && yarn && yarn build

clean:
	rm -rf crawl/node_modules ui/node_modules crawl/dist crawl/*.log crawl/*.json ui/dist
	rm -rf dist
