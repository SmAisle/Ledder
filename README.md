# Ledder

Daily word path game by smAisle. Plus game in smAisle Daily.

- word/index.html: Ledder (built from source/)
- math/index.html: Ledder Math test

## Boards
321 boards in source/boards.json. Rebuild the page with `node source/build.js`.
- Days 1-71 (through Jan 12, 2027): the original 71 boards, fixed.
- Days 72-321: the 250 new boards once each.
- From day 322 (Sep 20, 2027): a new shuffle each pass, worked out from the pass number. A board never repeats within 60 days.
- Adding boards changes every day after day 71 that has not been pinned, including Archive. Pin the schedule first.

source/tune/ makes more boards: gen.c (`gcc -O2 -o g gen.c`, run from that folder), select.js, sim.js.
