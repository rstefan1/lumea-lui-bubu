# lumea-lui-bubu

"Lumea lui Bubu" – a village in Bucovina where every game with Bubu, the plush ladybug, is a building.

Plain static HTML, CSS and JavaScript: no build step.

## Structure

```
index.html              the village
404.html                page for addresses that do not exist
data/places.js          the buildings of the village (one per game)
data/modes.js           the mode of the village (one for every month): by hand or by calendar
assets/js/buildings.js  draws the buildings
assets/js/road.js       the country road between them
assets/js/scenery.js    fields, trees, animals ... in the free places
assets/js/season-shapes.js  snow, lights and ornaments carried (hidden) by the drawings
assets/js/scroll-hint.js  the "Vezi tot satul" button
assets/js/modes.js      turns on the chosen mode, lets the snowflakes fall
assets/css/             village.css, buildings.css
assets/img/landscape.svg  the landscape at the top (drawn by tools/draw-landscape.py)
modes/                  the modes of the village, named after the months (see modes/README.md)
_headers, robots.txt    settings for Cloudflare Pages and search engines
<game>/                 every game in its own folder: a git submodule
```

## The modes

The village looks different every month: snow and decorated fir trees at Christmas, snow in January and February,
the red and white bows of the 1st of March, flowers in April and May, children and balloons in June, the harvest in July,
watermelons in August, the colors of autumn from September, a cheerful rainy November.
`data/modes.js` chooses the mode by date (or keeps one on);
`?mode=<name>` in the address shows one without changing anything. How to change a mode or make a new one:
[modes/README.md](modes/README.md).

## The games

Every game lives in its own public repository and is added here as a git submodule:

```sh
git submodule add https://github.com/rstefan1/<game>.git <game>
git config -f .gitmodules submodule.<game>.branch master
```

then gets a building in `data/places.js` (`url: "<game>/"`). A game must use only relative paths.

The `Makefile` keeps them up to date:

| command        | what it does |
|----------------|--------------|
| `make init`    | downloads the games after a fresh clone |
| `make update`  | takes the newest version of every game (its `master`) and commits it here |
| `make publish` | `make update`, then `git push`: Cloudflare publishes the new versions |
| `make status`  | shows which version of every game is published |
| `make serve`   | the site on this computer, at http://localhost:8000 |

A push to a game's own repository does not change the site: only `make update` (or `make publish`) here does.

## Publishing on Cloudflare Pages

Every push to `master` of this repository is published by Cloudflare Pages.

One-time setup in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**, choose the repository `lumea-lui-bubu`
   (give the Cloudflare GitHub app access to it; the games are public, they need no access).
2. Build settings:
   - Production branch: `master`
   - Framework preset: `None`
   - Build command: *(empty)*
   - Build output directory: `/`
3. **Save and Deploy**. Check that `https://<project>.pages.dev/trenul-lui-bubu/` opens the game
   (Cloudflare must download the submodules; if the folder is empty, the games have to be published
   by a GitHub Action with `wrangler pages deploy` instead).
4. **Custom domains → Set up a custom domain** (the subdomain of the site, e.g. `<subdomain>.<domain>`).
   If the DNS of the domain is at Cloudflare, the record is made automatically; otherwise add at the DNS provider
   a `CNAME` record `<subdomain>` → `<project>.pages.dev`.
5. **Settings → Builds → Branch control**: production branch only, no preview branches
   (fewer builds; the free plan has 500 builds a month).

What the files do:
- `_headers`: small security headers, pictures kept a week in the browsers, and `noindex` for the copy at `*.pages.dev`
  (only the custom domain should appear in search engines).
- `404.html`: shown for wrong addresses (without it Pages would show the home page for every address).
- `robots.txt`: search engines may read everything; the sitemap will be added later.
- Static files are free and unlimited on Cloudflare Pages; only the builds are counted.
