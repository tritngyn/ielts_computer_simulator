const htmls = [
  "<h3><span>People think of bears as unintelligent and <strong>8</strong> ………………. .</span></h3>",
  "<p><span>The complex that includes the Step Pyramid and its surroundings is considered to be as big as an Egyptian <strong>21</strong> ………………….. of the past. The area outside the pyramid included accommodation that was occupied by <strong>22</strong> ………………….., along with many other buildings and features.</span></p>",
  "<p><span>Stella Pachidi of Cambridge Judge Business School has been focusing on the ‘algorithmication’ of jobs which rely not on production but on <strong>31</strong> …………………. .</span></p>",
  "**31** ...................",
  "Number 31 . . ."
];

const regex = /(?:<strong[^>]*>|\*\*|_|\s)*(\d+)(?:<\/strong>|\*\*|_|\s)*([._\u2026](?:[\s._\u2026]*[._\u2026]))/g;

htmls.forEach(html => {
  console.log("Original:", html);
  console.log("Replaced:", html.replace(regex, '[$1]'));
  console.log("---");
});
