import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReadingTest: React.FC = () => {
  const navigate = useNavigate();
  const [activePassage, setActivePassage] = useState(1);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex-none w-full bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark z-20 shadow-sm">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">IELTS Academic Reading</h1>
              <p className="text-xs text-text-secondary dark:text-gray-400 font-medium">Test 04 / Vol 12</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-background-light dark:bg-background-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark mr-2">
              <span className="material-symbols-outlined text-primary text-xl">timer</span>
              <span className="text-lg font-bold font-mono tracking-widest text-primary">59:21</span>
              <span className="text-[10px] text-text-secondary dark:text-gray-400 font-bold uppercase tracking-wider self-center pt-0.5">Left</span>
            </div>
            <div className="h-8 w-px bg-border-light dark:bg-border-dark mx-1 hidden md:block"></div>
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-lg">help</span>
              Help
            </button>
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-lg">visibility_off</span>
              Hide
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
              Submit Test
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Reading Passage */}
        <section className="flex-1 overflow-y-auto bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark p-8 md:p-12 relative group/passage">
          <div className="sticky top-0 z-10 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm pb-6 -mt-4 pt-4 border-b border-transparent transition-all group-scroll/passage:border-border-light">
            <div className="flex gap-6 border-b border-border-light dark:border-border-dark">
              <button onClick={() => setActivePassage(1)} className={`pb-3 border-b-[3px] ${activePassage === 1 ? 'border-primary text-primary font-bold' : 'border-transparent text-text-secondary hover:text-text-main dark:hover:text-gray-200 font-medium'} text-sm transition-colors`}>Passage 1</button>
              <button onClick={() => setActivePassage(2)} className={`pb-3 border-b-[3px] ${activePassage === 2 ? 'border-primary text-primary font-bold' : 'border-transparent text-text-secondary hover:text-text-main dark:hover:text-gray-200 font-medium'} text-sm transition-colors`}>Passage 2</button>
              <button onClick={() => setActivePassage(3)} className={`pb-3 border-b-[3px] ${activePassage === 3 ? 'border-primary text-primary font-bold' : 'border-transparent text-text-secondary hover:text-text-main dark:hover:text-gray-200 font-medium'} text-sm transition-colors`}>Passage 3</button>
            </div>
          </div>
          <div className="max-w-[800px] mx-auto mt-8 font-body">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-display font-black text-text-main dark:text-white leading-tight mb-2">The History of the Tortoise</h2>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Academic Reading Passage 1</p>
            </div>
            <figure className="mb-8 rounded-xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark">
              <div className="h-64 bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 w-full flex items-center justify-center relative">
                <span className="material-symbols-outlined text-6xl text-emerald-600/20 dark:text-emerald-400/20">pest_control_rodent</span>
              </div>
              <figcaption className="px-4 py-2 bg-background-light dark:bg-background-dark text-xs text-text-secondary dark:text-gray-500 border-t border-border-light dark:border-border-dark italic">
                Figure 1: The Galapagos Giant Tortoise in its natural habitat.
              </figcaption>
            </figure>
            <article className="space-y-6 text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 selection:bg-yellow-200 selection:text-black dark:selection:bg-yellow-800 dark:selection:text-white">
              <p>
                <strong className="text-primary mr-1">A</strong> If you go back far enough, everything lived in the sea. At various points in evolutionary history, enterprising individuals within many different animal groups moved out onto the land, sometimes even to the most parched deserts, taking their own private seawater with them in blood and cellular fluids. In addition to the reptiles, birds, mammals and insects which we see all around us, other groups that have succeeded out of water include scorpions, snails, crustaceans such as woodlice and land crabs, millipedes and centipedes, spiders and various worms.
              </p>
              <p>
                <strong className="text-primary mr-1">B</strong> And we must not forget the plants, without whose prior invasion of the land none of the other migrations could have happened. Moving from water to land involved a major redesign of every aspect of life, including breathing and reproduction. Nevertheless, a good number of thoroughgoing land animals later turned around, abandoned their hard-earned terrestrial re-tooling, and returned to the water again. Seals have only gone part way back. They show us what the intermediates might have been like, on the way to extreme cases such as whales and dugongs.
              </p>
              <p>
                <strong className="text-primary mr-1">C</strong> Whales (including the small whales we call dolphins) and dugongs, with their close cousins the manatees, ceased to be land creatures altogether and reverted to the full marine habits of their remote ancestors. They don't even come ashore to breed. They do, however, still breathe air, having never developed anything equivalent to the gills of their earlier marine incarnation. Turtles went back to the sea a very long time ago and, like all vertebrate returnees to the water, they breathe air.
              </p>
              <p>
                <strong className="text-primary mr-1">D</strong> One might ask why they didn't continue the trend and become fully aquatic, but the answer is probably related to reproduction. Sea turtles still lay their eggs on beaches, burying them in the sand. This ties them to the land for at least part of their life cycle. It is interesting to note that even the most aquatic of sea snakes, which never come onto land, still give birth to live young rather than laying eggs in the water.
              </p>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 my-8">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2 text-sm uppercase tracking-wide">Glossary</h4>
                <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li><span className="font-semibold">Incarnation:</span> A person or thing regarded as embodying or exhibiting some quality, idea, or the like.</li>
                  <li><span className="font-semibold">Thoroughgoing:</span> Involving or attending to every detail or aspect of something.</li>
                </ul>
              </div>
              <p>
                <strong className="text-primary mr-1">E</strong> Evidence suggests that the ancestors of modern tortoises were land-dwelling. However, recent fossil discoveries in China suggest that the earliest turtles were aquatic. This raises the question of whether tortoises evolved from aquatic ancestors or whether the aquatic turtles evolved from land-dwelling ancestors. The debate continues among paleontologists, but the consensus is leaning towards a terrestrial origin for the entire group.
              </p>
            </article>
          </div>
        </section>

        {/* Resizer Simulation */}
        <div className="w-1 bg-border-light dark:border-border-dark hover:bg-primary cursor-col-resize hidden md:block transition-colors"></div>

        {/* Right Panel: Questions */}
        <section className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 flex flex-col gap-8 pb-20">
          {/* Question Set 1 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-text-main dark:text-white">Questions 1-4</h3>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-text-secondary rounded text-center">Matching Headings</span>
            </div>
            <p className="text-sm text-text-secondary dark:text-gray-400 mb-6 italic border-l-4 border-primary pl-3 py-1 bg-primary/5">
              Choose the correct heading for paragraphs <strong className="text-text-main dark:text-white not-italic">A-D</strong> from the list of headings below.
            </p>
            <div className="mb-6 p-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
              <p className="text-xs font-bold text-text-secondary uppercase mb-3 tracking-widest">List of Headings</p>
              <ul className="space-y-2 text-sm text-text-main dark:text-gray-300">
                <li className="flex gap-2"><span className="font-bold text-primary w-6 text-right">i</span> The evolutionary history of turtles</li>
                <li className="flex gap-2"><span className="font-bold text-primary w-6 text-right">ii</span> The return to the water</li>
                <li className="flex gap-2"><span className="font-bold text-primary w-6 text-right">iii</span> Evidence from fossils</li>
                <li className="flex gap-2"><span className="font-bold text-primary w-6 text-right">iv</span> The importance of reproduction</li>
                <li className="flex gap-2"><span className="font-bold text-primary w-6 text-right">v</span> Adaptations for life on land</li>
                <li className="flex gap-2"><span className="font-bold text-primary w-6 text-right">vi</span> Re-tooling for aquatic life</li>
              </ul>
            </div>
            <div className="space-y-4">
              {['A', 'B', 'C', 'D'].map((para, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors">
                  <label className="text-sm font-semibold text-text-main dark:text-white flex-1">{i + 1}. Paragraph {para}</label>
                  <select className="form-select block w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-sm focus:border-primary focus:ring-primary p-2">
                    <option disabled selected>Select...</option>
                    <option value="i">i</option>
                    <option value="ii">ii</option>
                    <option value="iii">iii</option>
                    <option value="iv">iv</option>
                    <option value="v">v</option>
                    <option value="vi">vi</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Question Set 2 */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-text-main dark:text-white">Questions 5-7</h3>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-text-secondary rounded text-center">True / False / NG</span>
            </div>
            <p className="text-sm text-text-secondary dark:text-gray-400 mb-6 italic border-l-4 border-primary pl-3 py-1 bg-primary/5">
              Do the following statements agree with the information given in Reading Passage 1?
            </p>
            <div className="space-y-6">
              {[
                { id: 5, text: "Turtles were among the first group of animals to migrate back to the sea." },
                { id: 6, text: "It is always difficult to determine where an animal lived by looking at its fossilized remains." },
                { id: 7, text: "All sea snakes give birth to live young." }
              ].map((q) => (
                <div key={q.id} className="p-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-text-secondary font-bold text-lg">{q.id}.</span>
                    <button className="text-xs text-text-secondary hover:text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">flag</span> Flag
                    </button>
                  </div>
                  <p className="text-sm text-text-main dark:text-gray-200 font-medium mb-4 leading-relaxed">{q.text}</p>
                  <div className="flex gap-4">
                    {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <input className="size-4 text-primary focus:ring-primary border-gray-300" name={`q${q.id}`} type="radio" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer Navigator */}
          <div className="sticky bottom-0 bg-background-light dark:bg-background-dark py-4 mt-auto border-t border-border-light dark:border-border-dark flex justify-between items-center z-10">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-bold text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-lg">chevron_left</span> Previous
            </button>
            <div className="text-xs font-medium text-text-secondary">
              Part 1 of 3
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
              Next <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer Review Bar */}
      <footer className="flex-none w-full bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 px-6 py-3 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mr-2 sticky left-0 bg-surface-light dark:bg-surface-dark z-10 shrink-0">Review:</span>
          <div className="flex gap-1.5 flex-nowrap pr-6">
            {[1, 2, 3].map(n => <button key={n} className="size-8 flex items-center justify-center rounded bg-primary text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors">{n}</button>)}
            <button className="relative size-8 flex items-center justify-center rounded bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 text-xs font-bold border border-orange-200 dark:border-orange-800 hover:bg-orange-200 transition-colors">
              4
              <span className="absolute -top-1 -right-1 size-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
            <button className="size-8 flex items-center justify-center rounded ring-2 ring-primary ring-offset-1 dark:ring-offset-background-dark bg-white dark:bg-surface-dark text-text-main dark:text-white text-xs font-bold shadow-sm">5</button>
            {[6, 7, 8, 9, 10].map(n => <button key={n} className="size-8 flex items-center justify-center rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary dark:text-gray-400 text-xs font-medium hover:border-primary hover:text-primary transition-colors">{n}</button>)}
            <div className="flex items-center gap-1.5 opacity-50">
              <button className="size-8 flex items-center justify-center rounded bg-transparent border border-border-light dark:border-border-dark text-text-secondary text-xs">...</button>
              <button className="size-8 flex items-center justify-center rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-secondary text-xs font-medium">40</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReadingTest;