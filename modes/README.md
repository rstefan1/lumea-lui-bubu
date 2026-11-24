# The modes of the village

A mode changes how the home page looks for a season or a holiday: snow in winter, decorations at Christmas, and so on.
The games and the buildings stay the same; only the look changes.

| mode        | what it looks like |
|-------------|--------------------|
| `normal`    | the village as always: green, with flowers |
| `january`   | winter: everything covered with snow, frozen ponds, snowmen, snowflakes falling |
| `february`  | the snowy village of January under a clear, sunny sky: no snow falling, children on sleds, the first snowdrops |
| `march`     | red and white bows of the 1st of March on the boards, the buildings and the trees; snowdrops in the grass |
| `april`     | flowers everywhere, fruit trees in blossom, rows of flowers on the boards, petals in the wind |
| `may`       | the flowers of April, little bees and ladybugs on them and flying over the page |
| `june`      | the month of the children: flowers, children with balloons, little flags on the boards, balloons flying up |
| `july`      | the wheat harvest: golden fields, sheaves of wheat, a sheaf on the boards |
| `august`    | watermelons in the grass, plums on the trees, a slice of watermelon on the boards |
| `september` | the trees start to turn yellow, pumpkins, ripe apples, grapes on the boards |
| `october`   | yellow, red and copper trees, ochre fields, fallen and falling leaves, garlands of leaves |
| `november`  | the autumn of October, with puddles everywhere shining with the blue of the sky, full ponds, a muddy road |
| `december`  | Christmas: the snowy village of January, plus colored balls and a star on every fir tree, lights on the roofs, garlands of lights on the boards |

Every mode has the name of its month. With the usual setting the mode changes by itself every month
(only `december`, with Christmas, lasts until the 7th of January).

## Choosing the mode

Open `data/modes.js`:

- `window.MODE = "auto";` lets the calendar below it choose the mode by date: a different one every month (the usual setting).
- `window.MODE = "march";` (or any other month) keeps that mode on, whatever the date.
- In `MODE_CALENDAR` every line is one period: `{ mode: "december", from: "1 December", to: "7 January" }`.
  The days are written with the month in English. Outside all the periods the village is `normal`.

To see a mode without changing anything, add `?mode=<name>` to the address:
`http://localhost:8000/?mode=march` (or the same `?mode=march` after the address of the site).

## Changing a mode

Every mode is a folder here, with a `mode.css` file in it. At the top of that file there is a **SETTINGS** part:
the colors (written like `#f4f8fb`), what grows in the free places of the village (`--patches`),
how many things fall (or fly) and how fast. Change only that part, save, and reload the page with `?mode=<name>`
to see the change. The pictures of a mode (`.svg`) are in its folder too.

- `january/mode.css`: the sky, the snow, the ice, the frost on the trees, the band at the bottom, the snowflakes.
- `december/mode.css`: the colors of the light bulbs and of the balls, the star, the band at the bottom.
  December takes everything else from January: a change of the snow in `january/mode.css` changes December too.
- `january/landscape.svg`: the snowy picture at the top, drawn by `tools/draw-landscape.py` (`python3 tools/draw-landscape.py`).
- `january/snowflake.svg`: the big snowflake.
- Some modes start from another one (the first line of their `mode.css`, `@import`): December and February from January,
  May from April, November from October.

## Making a new mode (Easter, a holiday ...)

1. Copy a folder that is close to what you want (e.g. `april`) and give it the new name, in English and without spaces
   (`easter`).
2. Change its `mode.css`. What a mode can use:
   - the colors of the page: `--sky-top`, `--sky-low`, `--field`, `--field-low` and the classes of the drawings
     (`.village-road .sc-...` for the village, `.place .b-...` for the buildings: see `assets/css/`);
   - the hidden shapes carried by every drawing, shown with `display: inline`: `.snow`, `.lights`, `.ornaments`,
     `.bow` and the snowman `.village-road .sc-item--snowman`;
   - small patches in the free places of the village, with `--patches`: `snowdrops`, `blooms`, `puddles`, `sheaves`,
     `watermelons`, `pumpkins`, `leaves`, `bugs` (bees and ladybugs), `children` (with balloons), `sleds`,
     e.g. `--patches: blooms bugs;`; a kind with a `?` after it grows only here and there (`--patches: sleds snowdrops?;`);
   - hiding a thing of the village: `.village-road .sc-item--sunflowers { display: none; }`;
   - things falling over the page: `--falling-count`, `--falling-time`, `--falling-big` and their look,
     `.falling__item` and `.falling__item--big` (petals, leaves ... instead of snowflakes); with other keyframes
     they can fly across (the bees of May) or up (the balloons of June);
   - a little picture on the boards: `.sign__board::before`, `.place__info::before` (see `march`, `july`, `august`);
   - another picture at the top: `.landscape { background-image: url("landscape.svg"); }`, with the file in the folder.
3. Add it to the calendar in `data/modes.js` and try it with `?mode=<name>`.

## Old phones and laptops

Nothing a mode shows moves, except the falling things and the clouds. The falling things are a few dozen small elements
moved only by the graphics card (CSS animations of `transform`): no JavaScript runs while they fall. There are fewer of them
on small screens, on weak devices and with "Data Saver", and none when "reduce motion" is turned on.
Keep it that way in a new mode: no blinking lights in the drawings, no large moving pictures.
