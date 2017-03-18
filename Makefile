dev:
	npm run dev

prod:
	npm run prod

publish:prod
	cd dist && git add . && git commit -m 'publish' && git push