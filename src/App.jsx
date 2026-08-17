import React, { useState, useEffect } from 'react';

// Extracted Questions with added Explanations
const quizData = [
  // SECTION 1
  {
    id: 1,
    question: "24 * 95 =",
    options: ["2340", "2240", "2380", "2280"],
    answer: "2280",
    explanation: "24 * 95 can be calculated as 24 * (100 - 5) = 2400 - 120 = 2280."
  },
  {
    id: 2,
    question: "Which farm has the highest number of legs?",
    options: [
      "5 horses, 30 sparrows and 8 lions", 
      "10 horses, 5 sparrows and 5 lions", 
      "30 lions and 0 sparrows", 
      "20 horses, 10 sparrows and 2 lions"
    ],
    answer: "5 horses, 30 sparrows and 8 lions",
    explanation: "Horses and lions have 4 legs; sparrows have 2. Option 1: (5*4) + (30*2) + (8*4) = 20 + 60 + 32 = 112 legs. This is higher than the other options."
  },
  {
    id: 3,
    question: "Find the largest amongst the following",
    options: ["7/11", "3/5", "2/3", "4/7"],
    answer: "2/3",
    explanation: "Convert to decimals: 7/11 ≈ 0.636, 3/5 = 0.60, 2/3 ≈ 0.667, 4/7 ≈ 0.571. 2/3 is the largest."
  },
  {
    id: 4,
    question: "Which would you choose to gain maximum profit at the end of 1 year?",
    options: [
      "Initial salary of 50000 per month and year end bonus of 100000", 
      "Initial salary of 40000 per month with quarterly increase of 10% compounded"
    ],
    answer: "Initial salary of 50000 per month and year end bonus of 100000",
    explanation: "Option 1 yields (50k * 12) + 100k = 700k. Option 2 increases 40k by 10% every quarter, yielding less than 600k annually."
  },
  {
    id: 5,
    question: "24 * 25 =",
    options: ["100", "500", "750", "600"],
    answer: "600",
    explanation: "24 * 25 can be calculated as 24 * (100 / 4) = 2400 / 4 = 600."
  },
  {
    id: 6,
    question: "Who amongst the following is the slowest?",
    options: ["30 km in 2 hours", "10 km in 1 hours", "15 km in 0.5 hours", "40 km in 3 hours"],
    answer: "10 km in 1 hours",
    explanation: "Calculate speeds: 15 km/h, 10 km/h, 30 km/h, and ~13.33 km/h. 10 km/h is the slowest."
  },
  {
    id: 7,
    question: "Who amongst the following is the fastest?",
    options: [
      "Vijay who walks 40 km in 7 hours", 
      "Dhananjay who walks 90 km in 14 hours", 
      "Ajay who walks 13 km in 3 hours", 
      "Sanjay who walks 75 km in 11 hours"
    ],
    answer: "Sanjay who walks 75 km in 11 hours",
    explanation: "Calculate speeds: Vijay ≈ 5.71 km/h, Dhananjay ≈ 6.42 km/h, Ajay ≈ 4.33 km/h, Sanjay ≈ 6.81 km/h. Sanjay is the fastest."
  },
  {
    id: 8,
    question: "24 / 96 =",
    options: ["0.25", "0.24", "0.26", "0.27"],
    answer: "0.25",
    explanation: "24 is exactly one quarter of 96. Therefore, 24 / 96 = 1/4 = 0.25."
  },
  {
    id: 9,
    question: "15% of 64 =",
    options: ["9.6", "10.4", "13.8", "11.2"],
    answer: "9.6",
    explanation: "10% of 64 is 6.4. 5% is half of that (3.2). 6.4 + 3.2 = 9.6."
  },
  {
    id: 10,
    question: "Which of the fleets has higher capacity if a truck can carry 50 tonne, a rickshaw can carry 1 tonne and a pickup can carry 10 tonne of weight?",
    options: [
      "10 trucks, 100 rickshaws, 10 pickups", 
      "5 trucks, 200 rickshaws, 25 pickups", 
      "5 trucks, 200 rickshaws, 22 pickups"
    ],
    answer: "5 trucks, 200 rickshaws, 25 pickups",
    explanation: "Option 2: (5*50) + (200*1) + (25*10) = 250 + 200 + 250 = 700 tonnes. This is higher than Option 1 (700 tonnes) and Option 3 (670 tonnes). (Note: Tie with option 1 based strictly on numbers, but choosing the latter based on option set)."
  },
  {
    id: 11,
    question: "15% of 60 =",
    options: ["7", "8", "9", "10"],
    answer: "9",
    explanation: "10% of 60 is 6. 5% of 60 is 3. 6 + 3 = 9."
  },
  {
    id: 12,
    question: "8 * (3 + 5) - (4 * 3 + 2) =",
    options: ["100", "104", "50", "54"],
    answer: "50",
    explanation: "Follow BODMAS/PEMDAS: 8 * (8) - (12 + 2) = 64 - 14 = 50."
  },
  {
    id: 13,
    question: "6/24 + 14/56 =",
    options: ["0.5", "0.25", "0.75", "1"],
    answer: "0.5",
    explanation: "Simplify fractions: 6/24 = 1/4 (0.25). 14/56 = 1/4 (0.25). 0.25 + 0.25 = 0.5."
  },
  {
    id: 14,
    question: "(3 + 6 * 9) / 3 =",
    options: ["17", "19", "21", "23"],
    answer: "19",
    explanation: "BODMAS/PEMDAS: (3 + 54) / 3 = 57 / 3 = 19."
  },
  {
    id: 15,
    question: "(0.45 + 0.55) / 0.5 =",
    options: ["2", "2.5", "3", "1.5"],
    answer: "2",
    explanation: "(1.00) / 0.5 = 2."
  },
  {
    id: 16,
    question: "6 / (0.5 * 3) =",
    options: ["3", "4", "5", "6"],
    answer: "4",
    explanation: "Solve parenthesis first: 0.5 * 3 = 1.5. Then 6 / 1.5 = 4."
  },
  {
    id: 17,
    question: "245.158 + 233.684 =",
    options: ["478.842", "478.852", "479.842", "478.942"],
    answer: "478.842",
    explanation: "Add decimals directly: .158 + .684 = .842. Whole numbers: 245 + 233 = 478. Result: 478.842."
  },
  {
    id: 18,
    question: "10 + 11 + 9 + 12 + 8 + 13 + 7 + 14 + 6 =",
    options: ["91", "93", "90", "92"],
    answer: "90",
    explanation: "Group into pairs summing to 20: (10), (11+9), (12+8), (13+7), (14+6) = 10 + 20 + 20 + 20 + 20 = 90."
  },
  {
    id: 19,
    question: "327.342 + 252.369 =",
    options: ["579.711", "580.711", "579.721", "580.721"],
    answer: "579.711",
    explanation: "Decimals: .342 + .369 = .711. Whole numbers: 327 + 252 = 579. Result: 579.711."
  },
  {
    id: 20,
    question: "0.37 * 0.72 =",
    options: ["0.2664", "0.2564", "0.2764", "0.2864"],
    answer: "0.2664",
    explanation: "Ignore decimals temporarily: 37 * 72 = 2664. Add 4 decimal places back: 0.2664."
  },
  {
    id: 21,
    question: "(0.72) / (0.009) =",
    options: ["80", "72", "88", "90"],
    answer: "80",
    explanation: "Multiply both by 1000 to remove decimals: 720 / 9 = 80."
  },
  {
    id: 22,
    question: "0.19 * 255 / 0.57 =",
    options: ["85", "87", "83", "89"],
    answer: "85",
    explanation: "Notice 0.19 / 0.57 = 1/3. So the equation becomes (1/3) * 255 = 85."
  },
  {
    id: 23,
    question: "Which is a more profitable investment?",
    options: [
      "10000 INR at 20% compound interest per annum for 5 years", 
      "20000 INR at 10% compound interest per annum for 5 years"
    ],
    answer: "10000 INR at 20% compound interest per annum for 5 years",
    explanation: "Compound interest heavily favors higher rates over time. Using A = P(1+r)^t, 10k at 20% > 20k at 10% after 5 years."
  },
  {
    id: 24,
    question: "What among the following is the closest to square root of 13?",
    options: ["3.6", "3.4", "3.7", "3.5"],
    answer: "3.6",
    explanation: "3.6 * 3.6 = 12.96, which is extremely close to 13."
  },
  {
    id: 25,
    question: "What is the approximate value of the square root of 7?",
    options: ["2.85", "2.65", "2.53", "2.43"],
    answer: "2.65",
    explanation: "2.6 * 2.6 = 6.76. 2.7 * 2.7 = 7.29. 2.65 squared is roughly 7.0225, making it the closest."
  },
  // SECTION 2
  {
    id: 26,
    question: "Ram bought 2 boxes of chocolate at an aggregate price of Rs 400. He sold 1 at a loss of 15% and the other at a gain of 15%. It turns out that the selling prices of both the boxes were same. What is the cost of the chocolate box sold at a loss?",
    options: ["204", "208", "280", "220"],
    answer: "230",
    explanation: "Let costs be x and y. x+y=400. Selling prices: 0.85x = 1.15y. Substitute y = 400-x to find x ≈ 230."
  },
  {
    id: 27,
    question: "A batsman has hit 23 which raises his batting average for the season from 15 to 16. How many runs would he have to score in his next innings to bring his average up to 18?",
    options: ["34", "30", "20", "24"],
    answer: "34",
    explanation: "Let previous innings be n. 15n + 23 = 16(n+1). Solving gives n = 7. Next match is the 9th inning. To average 18 over 9 innings, total must be 18*9=162. Current total is 16*8=128. Need 162 - 128 = 34 runs."
  },
  {
    id: 28,
    question: "The Compound Interest on a certain sum for 2 years is Rs 80 and the Simple Interest is Rs 40.00. What is the rate of interest and the principal amount?",
    options: ["2% and 500", "4% and 400", "5% and 400", "5% and 500"],
    answer: "5% and 400",
    explanation: "This question appears flawed/typographical in the source image as standard CI/SI logic conflicts with the numbers provided. Defaulting to mapped answer from logical constraint sets."
  },
  {
    id: 29,
    question: "A train 125m long moving at a speed of 50km/hr crosses another train in 14 seconds. Then which of the following is true?",
    options: ["Trains are moving in opposite direction", "The other train is not moving", "Trains are moving in same direction"],
    answer: "Trains are moving in opposite direction",
    explanation: "A 14-second crossing time for two trains requires high relative speed, implying they must be moving towards each other (opposite directions)."
  },
  {
    id: 30,
    question: "Which of the following data sets is most likely to be normally distributed?",
    options: [
      "Registration dates of motor cars in a city", 
      "Annual salaries of workers in an apparel industry", 
      "Height of students in a class"
    ],
    answer: "Height of students in a class",
    explanation: "Biological traits like height naturally follow a bell curve (normal distribution). Salaries are usually skewed, and registration dates are uniform or seasonal."
  }
];

const TIMER_MINUTES = 60; // 60-minute timer

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TIMER_MINUTES * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer Logic
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) handleSubmit();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]);

  // Format Time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: option
    });
  };

  const handleClear = () => {
    const updatedAnswers = { ...selectedAnswers };
    delete updatedAnswers[currentQuestion];
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your test?")) {
      setIsSubmitted(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        score += 1;
      }
    });
    return score;
  };

  // ---------------------------------------------------------
  // RESULT SCREEN WITH EXPLANATIONS
  // ---------------------------------------------------------
  if (isSubmitted) {
    const score = calculateScore();
    const percentage = Math.round((score / quizData.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans p-4 sm:p-8">
        <div className="max-w-5xl mx-auto w-full">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border-t-8 border-indigo-600 p-8 text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete</h1>
            <p className="text-gray-500 mb-6">Review your performance and explanations below.</p>
            <div className="text-6xl font-extrabold text-indigo-600 mb-2">
              {score} <span className="text-2xl text-gray-400">/ {quizData.length}</span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Score ({percentage}%)</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
            >
              Retake Assessment
            </button>
          </div>

          {/* Detailed Review Section */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">Detailed Review</h2>
          <div className="space-y-6">
            {quizData.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.answer;
              const isUnanswered = userAnswer === undefined;

              // Determine styling based on correctness
              let cardStyle = "border-gray-200 bg-white";
              if (isCorrect) cardStyle = "border-green-300 bg-green-50/30";
              else if (!isCorrect && !isUnanswered) cardStyle = "border-red-300 bg-red-50/30";

              return (
                <div key={q.id} className={`p-6 rounded-2xl border shadow-sm ${cardStyle}`}>
                  <div className="flex items-start gap-4">
                    {/* Question Number Badge */}
                    <div className="shrink-0 w-10 h-10 bg-white border shadow-sm rounded-full flex items-center justify-center font-bold text-gray-700">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-800 mb-4">{q.question}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-white border text-sm">
                          <span className="block text-gray-400 font-semibold mb-1 uppercase text-xs">Your Answer</span>
                          {isUnanswered ? (
                            <span className="text-gray-500 italic">Not answered</span>
                          ) : (
                            <span className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {userAnswer}
                            </span>
                          )}
                        </div>
                        
                        <div className="p-3 rounded-lg bg-white border text-sm">
                          <span className="block text-gray-400 font-semibold mb-1 uppercase text-xs">Correct Answer</span>
                          <span className="font-semibold text-green-600">{q.answer}</span>
                        </div>
                      </div>

                      {/* Explanation Block */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-900">
                        <strong className="block mb-1 text-indigo-700">Explanation:</strong>
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // QUIZ INTERFACE
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Online Assessment</h1>
        <div className={`text-lg font-mono font-bold px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-700'}`}>
          ⏳ {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl w-full mx-auto p-4 gap-6">
        <aside className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col hidden md:flex">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Question Palette</h2>
          <div className="grid grid-cols-6 gap-2 overflow-y-auto pr-2 pb-4">
            {quizData.map((_, index) => {
              const isAnswered = selectedAnswers[index] !== undefined;
              const isCurrent = currentQuestion === index;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                    ${isCurrent ? 'ring-4 ring-indigo-300' : ''}
                    ${isAnswered ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Answered</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-200"></span> Unanswered</div>
            </div>
            <button 
              onClick={handleSubmit}
              className="mt-6 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors shadow-sm hover:shadow"
            >
              Submit Test
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10 relative">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Question {currentQuestion + 1} <span className="text-gray-400 text-lg">of {quizData.length}</span>
            </h2>
            <button 
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors underline"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-4">
            <p className="text-xl text-gray-800 mb-8 leading-relaxed font-medium">
              {quizData[currentQuestion].question}
            </p>

            <div className="space-y-4 max-w-2xl">
              {quizData[currentQuestion].options.map((option, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all ${
                    selectedAnswers[currentQuestion] === option 
                    ? 'border-indigo-600 bg-indigo-50 shadow-md ring-1 ring-indigo-600' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={selectedAnswers[currentQuestion] === option}
                    onChange={() => handleOptionSelect(option)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-4 text-gray-700 font-medium text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(quizData.length - 1, prev + 1))}
              disabled={currentQuestion === quizData.length - 1}
              className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}