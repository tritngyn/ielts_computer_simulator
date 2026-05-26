const fs = require('fs');
const data = JSON.parse(fs.readFileSync('g:/road_to_web/NextJS/ai_eo/data/Cambridge_Ielts_16_Reading_Test_1_Data2.json', 'utf8'));

const regex = /(?:<strong[^>]*>|\*\*|_|\s)*(\d+)(?:<\/strong>|\*\*|_|\s)*([._\u2026](?:[\s._\u2026]*[._\u2026]))/g;

data.passages.forEach(p => {
  p.questionGroups.forEach(g => {
    if (g.type === "GAP_FILL") {
      const matches = [...g.groupContentHTML.matchAll(regex)];
      const questionNumbers = g.questions.map(q => q.number);
      const matchedNumbers = matches.map(m => parseInt(m[1]));
      
      console.log(`Passage ${p.passageNumber}, Group ${g.id}`);
      console.log(`Expected questions:`, questionNumbers);
      console.log(`Matched numbers:`, matchedNumbers);
      console.log(`Difference:`, questionNumbers.filter(n => !matchedNumbers.includes(n)));
      console.log("---");
    }
  });
});
