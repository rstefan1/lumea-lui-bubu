/* =====================================================================
   data/modes.js – the MODE of the village: how it looks in a season or at a holiday (content only, no logic here).

     MODE           which mode is on:
                      "auto"       the calendar below chooses: a different mode every month (the usual setting)
                      "normal"     the village as always: green, with flowers
                      or the name of one month, to keep its mode on whatever the date:
                      "january"    winter: everything covered with snow, snowflakes falling
                      "february"   the snow of January in the sun: sleds, the first snowdrops
                      "march"      red and white bows of the 1st of March, snowdrops
                      "april"      flowers everywhere, fruit trees in blossom
                      "may"        flowers, little bees and ladybugs
                      "june"       the month of the children: flowers, children with balloons, little flags
                      "july"       the wheat harvest: golden fields, sheaves of wheat
                      "august"     watermelons, plums on the trees
                      "september"  the beginning of autumn: golden fields, corn, baskets, birds flying south
                      "october"    the colors of autumn, leaves falling
                      "november"   the autumn of October, with puddles after the rain
                      "december"   Christmas: snow, decorated fir trees, lights on the houses, sleds
                    Every mode is a folder in modes/ (modes/january/, modes/march/ ...);
                    modes/README.md tells how to change one or make a new one.

     MODE_CALENDAR  with MODE "auto": the mode that is on between two days of the year, both included.
                    The days are written like "1 December"; the first line that matches today wins,
                    and outside all of them the village is "normal".

   To see a mode without changing this file, add ?mode=<name> to the address of the page,
   e.g. http://localhost:8000/?mode=december
   ===================================================================== */
window.MODE = "auto";

window.MODE_CALENDAR = [
  { mode: "december",  from: "1 December",  to: "7 January" },     // Christmas lasts until the 7th of January
  { mode: "january",   from: "8 January",   to: "31 January" },
  { mode: "february",  from: "1 February",  to: "29 February" },
  { mode: "march",     from: "1 March",     to: "31 March" },
  { mode: "april",     from: "1 April",     to: "30 April" },
  { mode: "may",       from: "1 May",       to: "31 May" },
  { mode: "june",      from: "1 June",      to: "30 June" },
  { mode: "july",      from: "1 July",      to: "31 July" },
  { mode: "august",    from: "1 August",    to: "31 August" },
  { mode: "september", from: "1 September", to: "30 September" },
  { mode: "october",   from: "1 October",   to: "31 October" },
  { mode: "november",  from: "1 November",  to: "30 November" }
];
