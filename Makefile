# Makefile – keeping the games of the village up to date.
# Every game is a git submodule (see .gitmodules); this repository only remembers WHICH version
# of every game is published. Cloudflare Pages publishes the site at every push to master.
#
#   make init      download the games after a fresh clone
#   make update    take the newest version of every game (from its master) and commit it here
#   make publish   make update, then push: Cloudflare publishes the new versions
#   make status    show the version of every game
#   make serve     try the site on this computer: http://localhost:8000

PORT ?= 8000
# the folders of the games, read from .gitmodules
GAMES := $(shell git config -f .gitmodules --get-regexp '^submodule\..*\.path$$' | awk '{print $$2}')

.PHONY: help init update publish status serve

help:
	@sed -n 's/^#   //p' $(MAKEFILE_LIST)

init:
	git submodule update --init --recursive

update: init
	git submodule update --remote --recursive
	@changed="$$(git diff --name-only -- $(GAMES))"; \
	if [ -z "$$changed" ]; then \
		echo "All the games are already up to date."; \
	else \
		msg=""; \
		for game in $$changed; do \
			msg="$${msg:+$$msg, }$$game ($$(git -C $$game rev-parse --short HEAD))"; \
		done; \
		git add $$changed && \
		git commit -m "Update $$msg" && \
		echo "Updated: $$changed (run 'git push' or 'make publish' to put it online)"; \
	fi

publish: update
	git push

status:
	git submodule status

serve:
	python3 -m http.server $(PORT)
