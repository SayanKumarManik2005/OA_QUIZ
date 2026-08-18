import React, { useState, useEffect, useMemo } from 'react';
import rawQuizData from './data.json';

// Randomizes the options for every question on first load
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const sectionNames = Object.keys(rawQuizData);

export default function App() {
  // Initialize and shuffle options only once per session
  const quizData = useMemo(() => {
    const processed = {};
    sectionNames.forEach(sec => {
      processed[sec] = rawQuizData[sec].map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    });
    return processed;
  }, []);

  const [currentSection, setCurrentSection] = useState(sectionNames[0]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  // States for progression
  const [startedSections, setStartedSections] = useState({});
  const [submittedSections, setSubmittedSections] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);

  // Initialize individual timers for each section (60 seconds per question)
  const [timers, setTimers] = useState(() => {
    const initial = {};
    sectionNames.forEach(sec => { 
      initial[sec] = quizData[sec].length * 60; 
    });
    return initial;
  });

  const activeQuestions = quizData[currentSection];
  const isCurrentSectionStarted = startedSections[currentSection];
  const isCurrentSectionSubmitted = submittedSections[currentSection];
  const isCurrentQuestionSubmitted = submittedQuestions[`${currentSection}-${currentQuestion}`] || isCurrentSectionSubmitted;

  // Timer Logic
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        // Only decrease if the section IS started, is NOT submitted, and time > 0
        if (startedSections[currentSection] && !submittedSections[currentSection] && newTimers[currentSection] > 0) {
          newTimers[currentSection] -= 1;
          // Auto-submit section if time runs out
          if (newTimers[currentSection] === 0) {
            setSubmittedSections(s => ({ ...s, [currentSection]: true }));
          }
        }
        return newTimers;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [currentSection, startedSections, submittedSections]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartSection = () => {
    setStartedSections(prev => ({ ...prev, [currentSection]: true }));
  };

  const handleOptionSelect = (option) => {
    if (isCurrentQuestionSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [`${currentSection}-${currentQuestion}`]: option
    });
  };

  const handleClear = () => {
    const updated = { ...selectedAnswers };
    delete updated[`${currentSection}-${currentQuestion}`];
    setSelectedAnswers(updated);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswers[`${currentSection}-${currentQuestion}`]) {
      alert("Please select an option first to check your answer!");
      return;
    }
    setSubmittedQuestions(prev => ({ ...prev, [`${currentSection}-${currentQuestion}`]: true }));
  };

  const handleSubmitSection = () => {
    if (window.confirm(`Are you sure you want to submit the ${currentSection} section? You won't be able to change your answers.`)) {
      setSubmittedSections(prev => ({ ...prev, [currentSection]: true }));
    }
  };

  const currentSectionScore = activeQuestions.filter((q, i) => 
    selectedAnswers[`${currentSection}-${i}`] === q.answer
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header with Section Tabs */}
      <header className="bg-white shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 shrink-0">Practice Set</h1>
        
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          {sectionNames.map(sec => (
            <button 
              key={sec} 
              onClick={() => { setCurrentSection(sec); setCurrentQuestion(0); setIsMobilePaletteOpen(false); }}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors
                ${currentSection === sec ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {sec} {submittedSections[sec] && '✓'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className={`text-sm sm:text-lg font-mono font-bold px-3 py-1.5 rounded-lg border 
            ${timers[currentSection] < 300 && !isCurrentSectionSubmitted && isCurrentSectionStarted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
            ⏳ {isCurrentSectionSubmitted ? '00:00' : formatTime(timers[currentSection])}
          </div>
          <button 
            onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
            className="md:hidden px-4 py-2 bg-gray-800 text-white text-xs font-semibold rounded-lg"
          >
            {isMobilePaletteOpen ? 'Close Palette' : 'Question Palette'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 gap-4 relative overflow-hidden">
        
        {/* Sidebar - Question Palette */}
        <aside className={`absolute md:relative z-20 top-0 left-0 h-full md:h-auto w-72 bg-white rounded-xl shadow-2xl md:shadow-sm border border-gray-200 p-4 flex flex-col transition-transform duration-300 ${isMobilePaletteOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex justify-between items-center mb-4 md:block">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{currentSection}</h2>
            <button onClick={() => setIsMobilePaletteOpen(false)} className="md:hidden text-gray-400 hover:text-gray-700 text-lg">✕</button>
          </div>

          <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-1 pb-4 max-h-[50vh] md:max-h-none">
            {activeQuestions.map((_, index) => {
              const isAnswered = selectedAnswers[`${currentSection}-${index}`] !== undefined;
              const isCorrect = selectedAnswers[`${currentSection}-${index}`] === activeQuestions[index].answer;
              const isQuesSubmitted = submittedQuestions[`${currentSection}-${index}`] || isCurrentSectionSubmitted;
              const isCurrent = currentQuestion === index;

              let btnClass = "bg-gray-100 text-gray-600 hover:bg-gray-300";
              if (!isCurrentSectionStarted) {
                btnClass = "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50";
              } else if (isQuesSubmitted) {
                btnClass = isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white";
              } else if (isAnswered) {
                btnClass = "bg-blue-500 text-white";
              }

              return (
                <button
                  key={index}
                  onClick={() => { setCurrentQuestion(index); setIsMobilePaletteOpen(false); }}
                  disabled={!isCurrentSectionStarted}
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCurrent && isCurrentSectionStarted ? 'ring-4 ring-indigo-200 scale-110' : ''} ${btnClass}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          {/* Legend and Section Submit */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-6">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Answered</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span> Unanswered</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Correct</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Incorrect</div>
            </div>
            
            {!isCurrentSectionStarted ? (
               <div className="w-full py-3 bg-gray-100 text-gray-400 text-center text-sm font-bold rounded-lg cursor-not-allowed">
                Section Not Started
              </div>
            ) : !isCurrentSectionSubmitted ? (
              <button 
                onClick={handleSubmitSection}
                className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold rounded-lg transition-colors shadow-md"
              >
                Submit Section
              </button>
            ) : (
              <div className="w-full py-3 bg-green-50 text-green-700 border border-green-200 text-center text-sm font-bold rounded-lg">
                Section Completed
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 relative">
          
          {/* Unstarted State Overlay */}
          {!isCurrentSectionStarted ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{currentSection}</h2>
              <p className="text-gray-500 mb-8 max-w-md">
                This section contains <span className="font-bold text-gray-700">{activeQuestions.length} questions</span>. You have <span className="font-bold text-gray-700">{formatTime(timers[currentSection])}</span> to complete it. The timer will start as soon as you click the button below.
              </p>
              <button 
                onClick={handleStartSection}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Section
              </button>
            </div>
          ) : (
            <>
              {/* Score Banner (Only visible if the entire section is submitted) */}
              {isCurrentSectionSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">Section Completed</h3>
                    <p className="text-sm text-green-600">Review the explanations for your answers below.</p>
                  </div>
                  <div className="text-3xl font-extrabold text-green-600">
                    {currentSectionScore} <span className="text-xl text-green-400">/ {activeQuestions.length}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Question {currentQuestion + 1} <span className="text-gray-400 text-sm sm:text-lg">of {activeQuestions.length}</span>
                </h2>
                {!isCurrentQuestionSubmitted && (
                  <button onClick={handleClear} className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors font-medium">
                    Clear Selection
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-1 sm:pr-4">
                <p className="text-base sm:text-xl text-gray-800 mb-6 leading-relaxed font-medium">
                  {activeQuestions[currentQuestion].question}
                </p>

                <div className="space-y-3">
                  {activeQuestions[currentQuestion].options.map((option, idx) => {
                    const isSelected = selectedAnswers[`${currentSection}-${currentQuestion}`] === option;
                    const isCorrect = option === activeQuestions[currentQuestion].answer;

                    // Dynamic styling
                    let labelClass = "border-gray-200 hover:border-blue-300 hover:bg-gray-50";
                    if (isCurrentQuestionSubmitted) {
                      if (isCorrect) labelClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                      else if (isSelected) labelClass = "border-red-500 bg-red-50 ring-1 ring-red-500 opacity-80";
                      else labelClass = "border-gray-200 opacity-50";
                    } else if (isSelected) {
                      labelClass = "border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-sm";
                    }

                    return (
                      <label key={idx} className={`flex items-start sm:items-center p-3 sm:p-5 border rounded-xl cursor-pointer transition-all ${labelClass}`}>
                        <input
                          type="radio"
                          name={`q-${currentSection}-${currentQuestion}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(option)}
                          disabled={isCurrentQuestionSubmitted}
                          className={`mt-1 sm:mt-0 w-4 h-4 shrink-0 focus:ring-blue-500 ${isCurrentQuestionSubmitted && isCorrect ? 'text-green-600' : 'text-blue-600'}`}
                        />
                        <span className={`ml-3 font-medium text-sm sm:text-base ${isCurrentQuestionSubmitted && isCorrect ? 'text-green-800 font-bold' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Separate Option Submission Button & Explanation Window */}
                <div className="mt-6">
                  {!isCurrentQuestionSubmitted ? (
                    <button
                      onClick={handleCheckAnswer}
                      className="px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-lg text-sm transition-colors shadow-sm"
                    >
                      ✓ Check Answer
                    </button>
                  ) : (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-inner">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Explanation</span>
                      </div>
                      <p className="text-sm sm:text-base text-indigo-900 leading-relaxed">
                        {activeQuestions[currentQuestion].explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <button
                  onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
                >
                  &larr; Previous
                </button>
                <button
                  onClick={() => setCurrentQuestion(p => Math.min(activeQuestions.length - 1, p + 1))}
                  disabled={currentQuestion === activeQuestions.length - 1}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md text-sm transition-colors"
                >
                  Next &rarr;
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}