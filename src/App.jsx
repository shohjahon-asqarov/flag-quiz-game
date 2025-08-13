import React, { useCallback, useEffect, useState } from 'react'
import bgImg from './assets/bg-fon.png'
const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectAnswer, setSelectAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fisher–Yates shuffle for fair randomization
  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const fetchCountries = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://restcountries.com/v3.1/independent?status=true', signal ? { signal } : undefined);
      if (!res.ok) throw new Error('Failed to load countries');
      const data = await res.json();

      // Only countries with capital, valid name and flag
      const validCountries = data.filter((c) => c.capital && c.capital.length > 0 && c.name?.common && (c.flags?.png || c.flags?.svg));
      if (validCountries.length < 4) throw new Error('Not enough country data to build questions');

      const selectedCountries = shuffle(validCountries).slice(0, 10);

      const formattedQuestions = selectedCountries.map((country) => {
        const correct = country.name.common;
        const distractors = shuffle(validCountries.filter((c) => c.name?.common !== correct))
          .slice(0, 3)
          .map((c) => c.name.common);
        const options = shuffle([correct, ...distractors]);
        return {
          questionText: 'What flag is this?',
          countryName: correct,
          flag: country.flags?.png || country.flags?.svg || '',
          answerOptions: options.map((opt) => ({ answerText: opt, isCorrect: opt === correct })),
        };
      });

      setQuestions(formattedQuestions);
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setError(err?.message || 'Unknown error while loading countries');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCountries(controller.signal);
    return () => controller.abort();
  }, [fetchCountries]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center bg-cover bg-center h-screen' style={{ backgroundImage: `url(${bgImg})` }}>
        <div className='w-full max-w-lg rounded-2xl shadow-2xl text-white p-8 bg-gradient-to-br from-blue-500 to-green-400'>
          <h1 className='text-3xl font-bold text-center text-indigo-700 mb-6 drop-shadow-lg'>🌍 Flag quiz game</h1>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle text-[64px] text-yellow-300 mx-2 inline-block"></i>
            <h2 className="text-2xl font-semibold">Load error</h2>
            <p className="mt-2 opacity-90">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
              onClick={() => fetchCountries()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700">No questions available.</p>
      </div>
    );
  }

  const handleAnswerOption = (index, isCorrect) => {
    if (answered) return;
    setAnswered(true);
    setSelectAnswer(index);
    if (isCorrect) setScore((prev) => prev + 1);
  }
  const NextQuestion = () => {
    setAnswered(false);
    setSelectAnswer(null);
    setCurrentQuestion((prev) => {
      const next = prev + 1;
      if (next < questions.length) return next;
      setShowScore(true);
      return prev;
    });
  }
  return (
    <div className='flex justify-center items-center bg-cover bg-center h-screen'
      style={{ backgroundImage: `url(${bgImg})` }}>
      <div className='w-full max-w-lg rounded-2xl shadow-2xl text-white  p-8 bg-gradient-to-br from-blue-500 to-green-400'>
        <h1 className='text-3xl font-bold text-center text-indigo-700 mb-6 drop-shadow-lg'>🌍 Flag quiz game</h1>
        {/* Show Score section  */}
        {showScore ?
          <div className="text-center">
            <i className="bi bi-trophy text-[70px] text-yellow-300 mx-2 inline-block animate-bounce"></i>
            <h2 className="text-2xl font-semibold text-green-600">✅ Quiz Finished!</h2>
            <p className="text-lg mt-2">
              You scored <span className="font-bold">{score}</span> out of {questions.length}
            </p>
            {/* Reset button */}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
              onClick={() => {
                setScore(0);
                setCurrentQuestion(0);
                setShowScore(false);
                setAnswered(false);
                setSelectAnswer(null);
                fetchCountries();
              }}
            >
              🔄 Reset Quiz
            </button>
          </div> :
          <div>
            {/* Flag images */}
            <div className='mb-4 flex justify-center'>
              <img
                src={questions[currentQuestion].flag}
                alt="country flag"
                className="w-40 h-20 object-cover rounded shadow-md"
              />
            </div>
            <div className='mb-2 text-center'>{questions[currentQuestion].questionText}</div>
            {questions[currentQuestion].answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOption(index, option.isCorrect)}
                disabled={answered}
                aria-pressed={answered && selectAnswer === index}
                className={`block w-full p-2 mb-2 rounded-xl border font-semibold shadow-md transform transition-all duration-300 ${answered ?
                  option.isCorrect ?
                    "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg scale-105"
                    : selectAnswer === index ?
                      "bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg scale-105" :
                      ""
                  : ""
                  }`}>
                {option.answerText}</button>
            ))}
            <button className={`block w-full text-white p-2 rounded-[10px] ${answered ? "bg-green-500" : "bg-green-200"} disabled:opacity-50`}
              disabled={!answered}
              onClick={NextQuestion}>New Question ➡️</button>
            <p className='text-center text-white mt-3 text-sm' aria-live='polite'>Question {currentQuestion + 1}  of {questions.length}</p>
          </div>
        }
      </div>
    </div>
  )
}

export default App