# The modes of the village

A mode changes how the home page looks for a season or a holiday: snow in winter, decorations at Christmas, and so on.
The games and the buildings stay the same; only the look changes.

| mode        | what it looks like |
|-------------|--------------------|
| `normal`    | the village as always: green, with flowers |
| `winter`    | everything covered with snow, frozen ponds, snowmen, snowflakes falling |
| `christmas` | the winter village, plus colored balls and a star on every fir tree, lights on the roofs, garlands of lights on the boards |

## Choosing the mode

Open `data/modes.js`:

- `window.MODE = "auto";` lets the calendar below it choose the mode by date (the usual setting).
- `window.MODE = "winter";` (or any other mode) keeps that mode on, whatever the date.
- In `MODE_CALENDAR` every line is one period: `{ mode: "christmas", from: "1 December", to: "7 January" }`.
  The days are written with the month in English. Outside all the periods the village is `normal`.

To see a mode without changing anything, add `?mode=<name>` to the address:
`https://bubu.infoticedu.ro/?mode=winter`, `http://localhost:8000/?mode=christmas`.

## Changing a mode

Every mode is a folder here, with a `mode.css` file in it. At the top of that file there is a **SETTINGS** part:
the colors (written like `#f4f8fb`), how many snowflakes fall and how fast. Change only that part,
save, and reload the page with `?mode=<name>` to see the change.

- `winter/mode.css`: the sky, the snow, the ice, the frost on the trees, the band at the bottom, the snowflakes.
- `christmas/mode.css`: the colors of the light bulbs and of the balls, the star, the band at the bottom.
  Christmas takes everything else from winter: a change of the snow in `winter/mode.css` changes Christmas too.
- `winter/landscape.svg`: the snowy picture at the top, drawn by `tools/draw-landscape.py` (`python3 tools/draw-landscape.py`).
- `winter/snowflake.svg`: the big snowflake.

## Making a new mode (spring, Mărțișor, autumn ...)

1. Copy a folder that is close to what you want (e.g. `winter`) and give it the new name, in English and without spaces
   (`spring`, `martisor`, `autumn`).
2. Change its `mode.css`. What a mode can use:
   - the colors of the page: `--sky-top`, `--sky-low`, `--field`, `--field-low` and the classes of the drawings
     (`.village-road .sc-...` for the village, `.place .b-...` for the buildings: see `assets/css/`);
   - the hidden shapes carried by every drawing, shown with `display: inline`: `.snow`, `.lights`, `.ornaments`
     and the snowman `.village-road .sc-item--snowman`;
   - hiding a thing of the village: `.village-road .sc-item--sunflowers { display: none; }`;
   - things falling over the page: `--falling-count`, `--falling-time`, `--falling-big` and their look,
     `.falling__item` and `.falling__item--big` (petals, leaves ... instead of snowflakes);
   - another picture at the top: `.landscape { background-image: url("landscape.svg"); }`, with the file in the folder.
3. Add it to the calendar in `data/modes.js` and try it with `?mode=<name>`.

## Old phones and laptops

Nothing a mode shows moves, except the falling things and the clouds. The falling things are a few dozen small elements
moved only by the graphics card (CSS animations of `transform`): no JavaScript runs while they fall. There are fewer of them
on small screens, on weak devices and with "Data Saver", and none when "reduce motion" is turned on.
Keep it that way in a new mode: no blinking lights in the drawings, no large moving pictures.
