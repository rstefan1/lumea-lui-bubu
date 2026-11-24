/* =====================================================================
   data/modes.js – the MODE of the village: how it looks in a season or at a holiday (content only, no logic here).

     MODE           which mode is on:
                      "auto"       the calendar below chooses (the usual setting)
                      "normal"     the village as always: green, with flowers
                      "winter"     everything covered with snow, snowflakes falling
                      "christmas"  snow, decorated fir trees, lights on the houses
                    Every mode is a folder in modes/ (modes/winter/, modes/christmas/ ...);
                    modes/README.md tells how to change one or make a new one.

     MODE_CALENDAR  with MODE "auto": the mode that is on between two days of the year, both included.
                    The days are written like "1 December"; the first line that matches today wins,
                    and outside all of them the village is "normal".

   To see a mode without changing this file, add ?mode=<name> to the address of the page,
   e.g. http://localhost:8000/?mode=christmas
   ===================================================================== */
window.MODE = "auto";

window.MODE_CALENDAR = [
  { mode: "normal",    from: "1 November", to: "30 November" },
  { mode: "christmas", from: "1 December",  to: "7 January" },
  { mode: "winter",    from: "8 January",   to: "29 February" }
];
