
.phony: clean install build watch

SRC := webapp/


install:
	npm install

build:
	@echo "Now Building Files!"
	grunt

watch: build
	grunt watch

clean:
	@echo "Removing auto-generated files."
	grunt clean
