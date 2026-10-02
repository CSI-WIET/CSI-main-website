/*
  Dev note: CodeSprintGame is a small UI-only typing mini-game used on the homepage.
  - To change the text prompts, edit the `SNIPPETS` array below.
  - To adjust styling, edit the Tailwind class tokens (no logic changes required).
  - Avoid changing core timing/score logic unless you intend to modify game behavior.
*/
import React, { useEffect, useRef, useState } from 'react';
import { useHtmlDark } from '../hooks/useHtmlDark';

const SNIPPETS = [
  "const sum = (a, b) => a + b;",
  "console.log('Hello World');",
  "import React from 'react';",
  "for (let i = 0; i < 10; i++) { console.log(i); }",
  "const greet = name => `Hello ${name}`;",
  "if (isReady) init(); else queue.push(task);",
  "async function fetchData(url) { const r = await fetch(url); return r.json(); }",
  "return items.filter(x => x.active).length;",
];

export default function CodeSprintGame({ timeLimit = 30 }) {
  const [mode, setMode] = useState('waiting'); // waiting | playing | finished
  const [snippet, setSnippet] = useState('');
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [elapsed, setElapsed] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  
  // Theme detection (UI-only) - use reactive hook so UI updates on toggle
  const isDarkMode = useHtmlDark();

  // Theme-aware class tokens (keeps both variants literal so Tailwind picks them up)
  const darkRoot = 'bg-slate-900 text-white';
  const lightRoot = 'bg-white text-slate-900 border border-slate-200';
  const rootTheme = isDarkMode ? darkRoot : lightRoot;

  const statBox = isDarkMode
    ? 'flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg'
    : 'flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-lg border border-slate-200';

  const codeBox = isDarkMode
    ? 'w-full min-h-[110px] p-6 rounded-xl bg-black/60 border border-slate-800 shadow-inner'
    : 'w-full min-h-[110px] p-6 rounded-xl bg-slate-50 border border-slate-200 shadow-sm';

  const startBtnClass = isDarkMode
    ? 'bg-cyan-500 hover:bg-cyan-400 px-6 py-3 rounded-lg font-semibold text-white shadow-md'
    : 'bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-semibold text-white shadow-md';

  const finishBtn = isDarkMode ? 'px-3 py-2 bg-amber-500 rounded-lg text-black shadow-sm' : 'px-3 py-2 bg-amber-400 rounded-lg text-black shadow-sm';
  const resetBtn = isDarkMode ? 'px-3 py-2 bg-slate-700 rounded-lg text-slate-200 shadow-sm' : 'px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 shadow-sm';

  const macDotRed = isDarkMode ? 'bg-red-400' : 'bg-red-500';
  const macDotAmber = isDarkMode ? 'bg-amber-400' : 'bg-amber-500';
  const macDotGreen = isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500';

  const correctClass = isDarkMode
    ? 'inline-block text-green-300 drop-shadow-[0_12px_32px_rgba(34,197,94,0.20)] shadow-[0_6px_30px_rgba(34,197,94,0.12)] animate-pulse'
    : 'inline-block text-emerald-700 bg-emerald-50 rounded px-[1px] ring-2 ring-emerald-100 shadow-[0_8px_24px_rgba(16,185,129,0.10)]';
  const wrongClass = isDarkMode ? 'inline-block text-rose-400' : 'inline-block text-rose-600 bg-rose-50 rounded px-[1px]';
  const neutralClass = isDarkMode ? 'inline-block text-slate-400' : 'inline-block text-slate-500';

  const passedBadge = isDarkMode
    ? 'mt-3 inline-block px-4 py-2 rounded-lg bg-emerald-500 text-black shadow-sm'
    : 'mt-3 inline-block px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm';
  const failedBadge = isDarkMode
    ? 'mt-3 inline-block px-4 py-2 rounded-lg bg-rose-500 text-white shadow-sm'
    : 'mt-3 inline-block px-4 py-2 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 shadow-sm';

  const subTextClass = isDarkMode ? 'text-sm text-slate-300' : 'text-sm text-slate-600';
  // container shadow (stronger in dark, airy in light)
  const containerShadow = isDarkMode
    ? 'shadow-[0_28px_80px_rgba(59,130,246,0.18)]'
    : 'shadow-[0_20px_48px_rgba(59,130,246,0.06)]';

  useEffect(() => {
    // cleanup on unmount
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (mode === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setMode('finished');
            return 0;
          }
          return t - 1;
        });
        setElapsed(e => e + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode]);

  useEffect(() => {
    // when finished, compute final metrics by leaving state as-is
    if (mode === 'finished') {
      // blur input so keyboard stops
      if (inputRef.current) inputRef.current.blur();
    }
  }, [mode]);

  const startGame = () => {
    const next = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
    setSnippet(next);
    setTyped('');
    setTimeLeft(timeLimit);
    setElapsed(0);
    setCorrectChars(0);
    setTotalTyped(0);
    setMode('playing');
    // focus input next tick
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  };

  const resetGame = () => {
    setMode('waiting');
    setTyped('');
    setTimeLeft(timeLimit);
    setElapsed(0);
    setCorrectChars(0);
    setTotalTyped(0);
    clearInterval(timerRef.current);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // only allow typing up to snippet length
    const clipped = val.slice(0, snippet.length);
    setTyped(clipped);
    // compute correctness for new input
    let correct = 0;
    for (let i = 0; i < clipped.length; i++) {
      if (clipped[i] === snippet[i]) correct++;
    }
    setCorrectChars(correct);
    // count total typed (including mistakes/backspaces as typed length)
    setTotalTyped(clipped.length);
  };

  const handleKeyDown = (e) => {
    // Enter moves to a new snippet if playing and typed completed
    if (mode === 'finished') return;
    if (mode === 'playing' && e.key === 'Escape') {
      resetGame();
    }
  };

  const wordsPerMinute = () => {
    const mins = Math.max(1 / 60, elapsed / 60);
    // standard WPM estimate: correctChars / 5 per minute
    return Math.round((correctChars / 5) / mins) || 0;
  };

  const finalWPM = mode === 'finished' ? Math.round((correctChars / 5) / Math.max(1 / 60, elapsed / 60)) : wordsPerMinute();
  const accuracy = totalTyped === 0 ? 100 : Math.round((correctChars / totalTyped) * 100);

  // simple pass criteria
  const passed = finalWPM >= 40 && accuracy >= 85;

  return (
    <div className={`${rootTheme} ${containerShadow} max-w-3xl mx-auto p-6 rounded-2xl font-mono`}> 
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Need a Break? Test Your Skills.</h3>
          <p className={subTextClass}>Think you code fast? Prove it.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={statBox}>
            <span className="text-xs text-slate-400">Time</span>
            <span className="text-sm font-medium">{timeLeft}s</span>
          </div>
          <div className={statBox}>
            <span className="text-xs text-slate-400">WPM</span>
            <span className="text-sm font-medium">{wordsPerMinute()}</span>
          </div>
        </div>
      </div>

      {/* mac-style dots */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-3 h-3 rounded-full ${macDotRed}`} />
        <span className={`w-3 h-3 rounded-full ${macDotAmber}`} />
        <span className={`w-3 h-3 rounded-full ${macDotGreen}`} />
      </div>

      <div className="mb-4">
        <div className={codeBox}>
          {mode === 'waiting' && (
            <div className="flex flex-col items-center justify-center h-full">
              <button onClick={startGame} className={startBtnClass}>Start Hacking</button>
              <p className={`mt-3 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>You'll have {timeLimit} seconds. Typing starts when you press start.</p>
            </div>
          )}

          {mode !== 'waiting' && (
            <div className="relative">
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {snippet.split('').map((ch, i) => {
                  const typedChar = typed[i];
                  const isCorrect = typedChar === ch && typeof typedChar !== 'undefined';
                  const isWrong = typeof typedChar !== 'undefined' && typedChar !== ch;
                  const classes = isCorrect ? correctClass : isWrong ? wrongClass : neutralClass;
                  return (
                    <span key={i} className={classes}>
                      {ch}
                    </span>
                  );
                })}
              </div>

              {/* hidden input to capture typing */}
              <input
                ref={inputRef}
                value={typed}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 opacity-0 pointer-events-auto"
                autoFocus={mode === 'playing'}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {mode === 'finished' ? (
          <div>
            <div className="text-lg font-bold">Final WPM: <span className="text-cyan-400">{finalWPM}</span></div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Accuracy: <span className={isDarkMode ? 'text-slate-100' : 'text-slate-700'}>{accuracy}%</span></div>
            <div className={passed ? passedBadge : failedBadge}>
              {passed ? 'Deploy Success!' : 'Build Failed'}
            </div>
          </div>
        ) : (
          <div className={`${isDarkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}`}>
            {mode === 'playing' ? `Typed: ${totalTyped} chars · Correct: ${correctChars}` : ''}
          </div>
        )}

        <div className="flex items-center gap-3">
          {mode === 'playing' && (
            <button onClick={() => setMode('finished')} className={finishBtn}>Finish</button>
          )}

          {mode !== 'waiting' && (
            <button onClick={resetGame} className={resetBtn}>Reset</button>
          )}
        </div>
      </div>
    </div>
  );
}
