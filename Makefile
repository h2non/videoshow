MOCHA = ./node_modules/.bin/mocha

default: all
all: test
test: mocha

mocha:
	$(MOCHA) --harmony --timeout 300000 --reporter spec --ui tdd

publish: test
	git push --tags origin HEAD:master
	npm publish

loc:
	wc -l lib/*
