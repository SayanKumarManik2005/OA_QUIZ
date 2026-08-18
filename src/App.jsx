import React,{useState,useEffect,useMemo}from'react';
import rawQuizData from'./data.json';
const shuffleArray=(array)=>{
const shuffled=[...array];
for(let i=shuffled.length-1;i>0;i--){
const j=Math.floor(Math.random()*(i+1));
[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
}
return shuffled;
};
export default function App(){
const sectionNames=Object.keys(rawQuizData);
const quizData=useMemo(()=>{
const processed={};
sectionNames.forEach(sec=>{
processed[sec]=rawQuizData[sec].map(q=>({
...q,
options:shuffleArray(q.options)
}));
});
return processed;
},[sectionNames]);
const[currentSection,setCurrentSection]=useState(sectionNames[0]);
const[currentQuestion,setCurrentQuestion]=useState(0);
const[selectedAnswers,setSelectedAnswers]=useState({});
const initialTimers={};
sectionNames.forEach(sec=>{initialTimers[sec]=quizData[sec].length*60;});
const[timers,setTimers]=useState(initialTimers);
const[isSubmitted,setIsSubmitted]=useState(false);
const[isMobilePaletteOpen,setIsMobilePaletteOpen]=useState(false);
const activeQuestions=quizData[currentSection];
useEffect(()=>{
if(isSubmitted)return;
const timerId=setInterval(()=>{
setTimers(prev=>{
const newTimers={...prev};
if(newTimers[currentSection]>0)newTimers[currentSection]-=1;
return newTimers;
});
},1000);
return()=>clearInterval(timerId);
},[currentSection,isSubmitted]);
const formatTime=(seconds)=>{
const m=Math.floor(seconds/60).toString().padStart(2,'0');
const s=(seconds%60).toString().padStart(2,'0');
return`${m}:${s}`;
};
const handleOptionSelect=(option)=>{
setSelectedAnswers({...selectedAnswers,[`${currentSection}-${currentQuestion}`]:option});
};
const handleClear=()=>{
const updated={...selectedAnswers};
delete updated[`${currentSection}-${currentQuestion}`];
setSelectedAnswers(updated);
};
const handleSubmit=()=>{
if(window.confirm("Submit test?"))setIsSubmitted(true);
};
const calculateScore=()=>{
let score=0;let total=0;
sectionNames.forEach(sec=>{
quizData[sec].forEach((q,idx)=>{
total+=1;
if(selectedAnswers[`${sec}-${idx}`]===q.answer)score+=1;
});});
return{score,total};
};
if(isSubmitted){
const{score,total}=calculateScore();
const percentage=Math.round((score/total)*100);
return(
<div className="min-h-screen bg-gray-50 flex flex-col font-sans p-4 sm:p-8">
<div className="max-w-5xl mx-auto w-full">
<div className="bg-white rounded-2xl shadow-sm border-t-8 border-indigo-600 p-8 text-center mb-8">
<h1 className="text-3xl font-bold text-gray-800 mb-2">Complete</h1>
<div className="text-6xl font-extrabold text-indigo-600 mb-2">{score}<span className="text-2xl text-gray-400">/{total}</span></div>
<p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Score({percentage}%)</p>
<button onClick={()=>window.location.reload()}className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg">Retake</button>
</div>
{sectionNames.map(sec=>(
<div key={sec}className="mb-10">
<h3 className="text-xl font-bold text-indigo-700 mb-4 px-2">{sec}</h3>
<div className="space-y-6">
{quizData[sec].map((q,idx)=>{
const userAnswer=selectedAnswers[`${sec}-${idx}`];
const isCorrect=userAnswer===q.answer;
const isUnanswered=userAnswer===undefined;
let cardStyle="border-gray-200 bg-white";
if(isCorrect)cardStyle="border-green-300 bg-green-50/30";
else if(!isCorrect&&!isUnanswered)cardStyle="border-red-300 bg-red-50/30";
return(
<div key={q.id}className={`p-6 rounded-2xl border shadow-sm ${cardStyle}`}>
<div className="flex items-start gap-4">
<div className="shrink-0 w-10 h-10 bg-white border shadow-sm rounded-full flex items-center justify-center font-bold text-gray-700">{idx+1}</div>
<div className="flex-1">
<p className="text-lg font-semibold text-gray-800 mb-4">{q.question}</p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
<div className="p-3 rounded-lg bg-white border text-sm">
<span className="block text-gray-400 font-semibold mb-1 uppercase text-xs">Your Answer</span>
{isUnanswered?<span className="text-gray-500 italic">Not answered</span>:<span className={`font-semibold ${isCorrect?'text-green-600':'text-red-600'}`}>{userAnswer}</span>}
</div>
<div className="p-3 rounded-lg bg-white border text-sm">
<span className="block text-gray-400 font-semibold mb-1 uppercase text-xs">Correct Answer</span>
<span className="font-semibold text-green-600">{q.answer}</span>
</div>
</div>
<div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-900">
<strong className="block mb-1 text-indigo-700">Explanation:</strong>{q.explanation}
</div></div></div></div>
)})}</div></div>))}</div></div>
);
}
return(
<div className="min-h-screen bg-gray-100 flex flex-col font-sans">
<header className="bg-white shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 gap-4">
<h1 className="text-lg sm:text-xl font-bold text-gray-800">Assessment</h1>
<div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
{sectionNames.map(sec=>(
<button key={sec}onClick={()=>{setCurrentSection(sec);setCurrentQuestion(0);}}className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap ${currentSection===sec?'bg-indigo-600 text-white':'bg-gray-200 text-gray-700'}`}>{sec}</button>
))}
</div>
<div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
<div className={`text-sm sm:text-lg font-mono font-bold px-3 py-1.5 rounded-lg ${timers[currentSection]<300?'bg-red-100 text-red-600':'bg-indigo-100 text-indigo-700'}`}>⏳ {formatTime(timers[currentSection])}</div>
<button onClick={()=>setIsMobilePaletteOpen(!isMobilePaletteOpen)}className="md:hidden px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-lg">{isMobilePaletteOpen?'Close':'Palette'}</button>
</div>
</header>
<div className="flex flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 gap-4 relative overflow-hidden">
<aside className={`absolute md:relative z-20 top-0 left-0 h-full md:h-auto w-72 bg-white rounded-xl shadow-lg md:shadow-sm border border-gray-200 p-4 flex flex-col transition-transform duration-300 ${isMobilePaletteOpen?'translate-x-0':'-translate-x-full md:translate-x-0'}`}>
<div className="flex justify-between items-center mb-4 md:block">
<h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{currentSection}</h2>
<button onClick={()=>setIsMobilePaletteOpen(false)}className="md:hidden text-gray-500 font-bold text-sm">✕</button>
</div>
<div className="grid grid-cols-5 gap-2 overflow-y-auto pr-1 pb-4 max-h-[50vh] md:max-h-none">
{activeQuestions.map((_,index)=>{
const isAnswered=selectedAnswers[`${currentSection}-${index}`]!==undefined;
const isCurrent=currentQuestion===index;
return(
<button key={index}onClick={()=>{setCurrentQuestion(index);setIsMobilePaletteOpen(false);}}className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${isCurrent?'ring-4 ring-indigo-300':''} ${isAnswered?'bg-green-500 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{index+1}</button>
);
})}
</div>
<div className="mt-auto pt-4 border-t border-gray-100">
<button onClick={handleSubmit}className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg">Submit Test</button>
</div>
</aside>
<main className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 relative">
<div className="flex justify-between items-center mb-6 border-b pb-3">
<h2 className="text-lg sm:text-2xl font-bold text-gray-800">Q{currentQuestion+1}<span className="text-gray-400 text-sm sm:text-lg">/{activeQuestions.length}</span></h2>
<button onClick={handleClear}className="text-xs sm:text-sm text-gray-500 hover:text-red-500 underline">Clear Selection</button>
</div>
<div className="flex-1 overflow-y-auto pr-1">
<p className="text-base sm:text-xl text-gray-800 mb-6 leading-relaxed font-medium">{activeQuestions[currentQuestion].question}</p>
<div className="space-y-3">
{activeQuestions[currentQuestion].options.map((option,idx)=>(
<label key={idx}className={`flex items-start sm:items-center p-3 sm:p-4 border rounded-xl cursor-pointer ${selectedAnswers[`${currentSection}-${currentQuestion}`]===option?'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600':'border-gray-200 hover:bg-gray-50'}`}>
<input type="radio"name={`q-${currentSection}-${currentQuestion}`}value={option}checked={selectedAnswers[`${currentSection}-${currentQuestion}`]===option}onChange={()=>timers[currentSection]>0&&handleOptionSelect(option)}disabled={timers[currentSection]<=0}className="mt-1 sm:mt-0 w-4 h-4 text-indigo-600 shrink-0"/>
<span className="ml-3 text-gray-700 font-medium text-sm sm:text-base">{option}</span>
</label>
))}
</div>
{timers[currentSection]<=0&&<p className="text-red-500 font-bold mt-4">Time is up for this section!</p>}
</div>
<div className="mt-6 pt-4 border-t flex justify-between items-center">
<button onClick={()=>setCurrentQuestion(p=>Math.max(0,p-1))}disabled={currentQuestion===0}className="px-4 py-2 rounded-lg font-semibold border text-gray-700 disabled:opacity-50">&larr; Prev</button>
<button onClick={()=>setCurrentQuestion(p=>Math.min(activeQuestions.length-1,p+1))}disabled={currentQuestion===activeQuestions.length-1}className="px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white disabled:opacity-50">Next &rarr;</button>
</div>
</main>
</div>
</div>
);
}