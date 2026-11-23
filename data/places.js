/* =====================================================================
   data/places.js – the BUILDINGS of the village (content only, no logic here).
   Every game or corner of the site is one building; the order here is the order in the village.

     type         (required) the drawing of the building:
                    "gara"     the railway station with a train
                    "advent"   a tall house with 24 numbered windows
                    "cabana"   a mountain cabin with a trail sign
                    "posta"    the post office with a mailbox
                    "padure"   a little forest with a path and animal tracks (e.g. a game about tracks)
                    "casa"     a simple house, for any other game (shows "icon" and "sign")
     title        (required) name shown big under the building
     description  (optional) one short line under the name
     url          address of the game: its folder in this repository (e.g. "trenul-lui-bubu/")
                  or a full address ("https://..."); without url the building shows "În curând"
     color        (optional) "red", "blue", "green", "yellow", "orange", "pink", "teal", "purple"
     sign         (optional) the word on the board of the building (default: GARA, CALENDAR, CABANA, POȘTA, PĂDUREA)
     icon         (optional, only for "casa") an emoji in the round window, e.g. "🎨"
     badge        (optional) a small ribbon on the building, e.g. "Nou!"
   ===================================================================== */
window.PLACES = [
  {
    type: "gara",
    title: "Trenul lui Bubu",
    description: "Călătorește cu trenul împreună cu Bubu",
    url: "trenul-lui-bubu/",
    color: "red",
    badge: "Nou!"
  }
];
