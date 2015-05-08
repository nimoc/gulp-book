default: test

node_modules: package.json
	@npm install

test: node_modules
	@./node_modules/.bin/mocha \
		--harmony-generators \
		--require co-mocha \
		--require gnode \
		--reporter spec

.PHONY: test
