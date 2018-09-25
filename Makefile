
.phony: clean install build watch

SRC := webapp/


install:
	# Install gulp globally.
	# npm install gulp-cli -g
	# Install dependency for a gulp package.
	# sudo apt-get install libpng-dev
	npm install

dev:
	@echo "Now Building Files!"
	gulp

#clean:
	#@echo "Removing auto-generated files."
	#grunt clean
