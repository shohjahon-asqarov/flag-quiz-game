import React, { useEffect, useState } from 'react'
import bgImg from './assets/bg-fon.png'
const App = () => {
  const [currentquestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectAnswer, setSelectAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://restcountries.com/v3.1/independent?status=true");
      const data = await res.json();

      // Faqat poytaxti bor davlatlarni olish
      const validCountries = data.filter(c => c.capital && c.capital.length > 0);

      // Random 10 ta davlat tanlash
      const shuffled = validCountries.sort(() => 0.5 - Math.random()).slice(0, 10);

      const formattedQuestions = shuffled.map(country => {
        const correct = country.name.common;
        let options = [correct];

        // Noto‘g‘ri variantlar
        while (options.length < 4) {
          const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)].name.common;
          if (randomCountry && !options.includes(randomCountry)) {
            options.push(randomCountry);
          }
        }
        // Javoblarni aralashtirish
        options = options.sort(() => 0.5 - Math.random());
        return {
          questionText: `What flag is this?`,
          countryName: country.name.common,
          flag: country.flags?.png || country.flags?.svg || "",
          answerOptions: options.map(opt => ({
            answerText: opt,
            isCorrect: opt === country.name.common
          }))
        };
      });
      setQuestions(formattedQuestions);
      setLoading(false);
    };

    fetchCountries();
  }, []);

  if (loading || questions.length === 0) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  const handleAnswerOption = (index, isCorrect) => {
    setAnswered(true)
    setSelectAnswer(index)
    if (isCorrect) {
      setScore(score + 1)
    }
  }
  const NextQuestion = () => {
    setAnswered(false)
    setSelectAnswer(null)
    const nextQuestion = currentquestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(currentquestion + 1)
    } else {
      setShowScore(true)
    }
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
              }}
            >
              🔄 Reset Quiz
            </button>
          </div> :
          <div>
            {/* Flag images */}
            <div className='mb-4 flex justify-center'>
              <img
                src={questions[currentquestion].flag}
                alt="country flag"
                className="w-40 h-20 object-cover rounded shadow-md"
              />
            </div>
            <div className='mb-2 text-center'>{questions[currentquestion].questionText}</div>
            {questions[currentquestion].answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOption(index, option.isCorrect)}
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
            <button className={`${answered ? "bg-green-500" : "bg-green-200"}
          block w-full bg-green-500 text-white p-2 rounded-[10px]`}
              disabled={!answered}
              onClick={NextQuestion}>New Question ➡️</button>
            <p className='text-center text-white mt-3 text-sm'>Question {currentquestion + 1}  of {questions.length}</p>
          </div>
        }
      </div>
    </div>
  )
}

export default App