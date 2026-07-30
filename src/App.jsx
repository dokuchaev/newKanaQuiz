import { useEffect, useMemo, useState } from 'react';
import buttonBamboo from './assets/buttons/bamboo.png';
import buttonKoi from './assets/buttons/koi.png';
import buttonTorii from './assets/buttons/torii.png';
import buttonWaves from './assets/buttons/waves.png';
import buttonGeisha from './assets/buttons/ninja.png';
import buttonSamurai from './assets/buttons/samurai.png';
import ProgressIndicator from './ProgressIndicator';
import { hiraganaChars } from './data/hiragana';
import { katakanaChars } from './data/katakana';
import { buildQuiz } from './questionBuilder';
import { hiraganaExtraChars } from './data/hiragana-extra';
import { katakanaExtraChars } from './data/katakana-extra';


const buttonBackgrounds = [buttonBamboo, buttonKoi, buttonTorii, buttonWaves, buttonSamurai, buttonGeisha];
const SHORT_MODE_COUNT = 15;

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function App() {
const [stage, setStage] = useState('intro');
const [quizType, setQuizType] = useState(null); // 'hiragana' | 'katakana' | 'hiragana-extra' | 'katakana-extra'
const [quizMode, setQuizMode] = useState(null); // 'short' | 'full'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showCards, setShowCards] = useState(true);
  const [answersState, setAnswersState] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const currentQuestion = quizQuestions[currentIndex];
  const progress = useMemo(() => `${currentIndex + 1}/${quizQuestions.length}`, [currentIndex, quizQuestions.length]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalTime, setFinalTime] = useState(null);

  

const getSourceChars = (type) => {
  switch (type) {
    case 'hiragana-extra':
      return hiraganaExtraChars;
    case 'katakana-extra':
      return katakanaExtraChars;
    case 'katakana':
      return katakanaChars;
    default:
      return hiraganaChars;
  }
};

const selectQuizType = (type) => {
  setQuizType(type);
  setStage('length-select');
};

const startQuiz = (mode) => {
  const sourceChars = getSourceChars(quizType);
  const count = mode === 'short' ? Math.min(SHORT_MODE_COUNT, sourceChars.length) : sourceChars.length;

  setQuizMode(mode);
  setStage('quiz');
  setCurrentIndex(0);
  setSelectedOption(null);
  setFeedback(null);
  setScore(0);
  setShowCards(true);
  setAnswersState([]);
  setQuizQuestions(buildQuiz(sourceChars, count));
  setElapsedSeconds(0);
  setFinalTime(null);
};


useEffect(() => {
  if (stage !== 'quiz') return;

  const interval = window.setInterval(() => {
    setElapsedSeconds((prev) => prev + 1);
  }, 1000);

  return () => window.clearInterval(interval);
}, [stage]);

useEffect(() => {
  if (!selectedOption) return;

  const timer = window.setTimeout(() => {
    setShowCards(false);

    window.setTimeout(() => {
      if (currentIndex === quizQuestions.length - 1) {
        setFinalTime(elapsedSeconds);
        setStage('result');
        return;
      }

      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      setShowCards(true);
    }, 450);
  }, 900);

  return () => window.clearTimeout(timer);
}, [selectedOption, currentIndex, quizQuestions.length, elapsedSeconds]);

  const handleSelect = (option) => {
    if (selectedOption) return;

    const isCorrect = option.value === currentQuestion.correct;
    setSelectedOption(option.value);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswersState((prev) => {
      const next = [...prev];
      next[currentIndex] = isCorrect ? 'correct' : 'incorrect';
      return next;
    });
  };

 
const restartQuiz = () => {
  startQuiz(quizMode);
};

const goToIntro = () => {
  setStage('intro');
  setQuizType(null);
  setQuizMode(null);
};

const goToLengthSelect = () => {
  setStage('length-select');
  setQuizMode(null);
};

  if (stage === 'intro') {
  return (
    <div className="app-shell">
      <div className="card intro-card">
        <p className="eyebrow">Тренировка по Кане</p>
        <h1>Что будем тренировать?</h1>
        <p className="subtitle">Выберите азбуку</p>

        <div className="quiz-select-grid">
          {[
            { type: 'hiragana', bg: buttonBamboo, title: 'Хирагана', subtitle: 'Базовые знаки' },
            { type: 'katakana', bg: buttonKoi, title: 'Катакана', subtitle: 'Базовые знаки' },
            { type: 'hiragana-extra', bg: buttonTorii, title: 'Хирагана', subtitle: 'Дакутэн, ёон' },
            { type: 'katakana-extra', bg: buttonWaves, title: 'Катакана', subtitle: 'Дакутэн, ёон' },
          ].map((opt, index) => (
            <button
              key={opt.type}
              className="quiz-start-card"
              style={{ '--order': index, '--button-bg': `url(${opt.bg})` }}
              onClick={() => selectQuizType(opt.type)}
            >
              <span className="shadow" />
              <span className="edge" />
              <span className="front">
                <span className="quiz-start-mode">{opt.subtitle}</span>
                <span className="quiz-start-title">{opt.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

if (stage === 'length-select') {
  const sourceChars = getSourceChars(quizType);
  const isExtra = quizType === 'hiragana-extra' || quizType === 'katakana-extra';
  const typeTitle = quizType?.startsWith('katakana') ? 'Катакана' : 'Хирагана';

  return (
    <div className="app-shell">
      <div className="card intro-card">
        <p className="eyebrow">{typeTitle}{isExtra ? ' · Дакутэн, Хандакутэн, ёон' : ''}</p>
        <h1>Выберите тест</h1>
        <p className="subtitle">Быстрый тест — случайные 15 знаков. Полный — весь набор целиком.</p>

        <div className="quiz-select-grid quiz-select-grid-two">
          <button
            className="quiz-start-card quiz-start-card-style"
            style={{ '--order': 0, '--button-bg': `url(${buttonGeisha})` }}
            onClick={() => startQuiz('short')}
          >
            <span className="shadow" />
            <span className="edge" />
            <span className="front">
              <span className="quiz-start-mode">Быстрый тест</span>
              <span className="quiz-start-title">15 знаков</span>
            </span>
          </button>

          <button
            className="quiz-start-card quiz-start-card-style"
            style={{ '--order': 1, '--button-bg': `url(${buttonSamurai})` }}
            onClick={() => startQuiz('full')}
          >
            <span className="shadow" />
            <span className="edge" />
            <span className="front">
              <span className="quiz-start-mode">Вся азбука</span>
              <span className="quiz-start-title">{sourceChars.length} знаков</span>
            </span>
          </button>
        </div>

        <button className="back-link" onClick={goToIntro}>
          ← Назад к выбору азбуки
        </button>
      </div>
    </div>
  );
}

  if (stage === 'result') {
  const percent = Math.round((score / quizQuestions.length) * 100);
  const isExtra = quizType === 'hiragana-extra' || quizType === 'katakana-extra';
  const typeTitle = quizType?.startsWith('katakana') ? 'Катакана' : 'Хирагана';

  return (
    <div className="app-shell">
      <div className="card result-card">
        <p className="eyebrow">
          Тест завершён ({typeTitle}{isExtra ? ' · Дакутэн, ёон' : ''}, {quizMode === 'full' ? 'вся азбука' : 'быстрый тест'})
        </p>
        <h2>Результат: {score}/{quizQuestions.length}</h2>
        <p className="result-score">{percent}% верных ответов</p>
        <p className="result-time">Время: {formatTime(finalTime ?? elapsedSeconds)}</p>
        <p className="subtitle">
          {percent >= 80 ? 'Отличный результат!' : percent >= 50 ? 'Неплохо, ещё немного практики!' : 'Потренируйся ещё — у тебя всё получится!'}
        </p>
        <div className="result-actions">
          <button className="result-btn result-btn-primary" onClick={restartQuiz}>
            <span className="shadow" />
            <span className="edge" />
            <span className="front">Пройти снова</span>
          </button>
          <button className="result-btn result-btn-secondary" onClick={goToLengthSelect}>
            <span className="shadow" />
            <span className="edge" />
            <span className="front">Другая длина</span>
          </button>
          <button className="result-btn result-btn-secondary" onClick={goToIntro}>
            <span className="shadow" />
            <span className="edge" />
            <span className="front">В начало</span>
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="app-shell">
      <div className="card quiz-card">
        <div className="quiz-header">
  <div className="quiz-timer" aria-label="Затраченное время">
    ⏱ {formatTime(elapsedSeconds)}
  </div>
  <div className="status-group">
    <ProgressIndicator
      total={quizQuestions.length}
      currentIndex={currentIndex}
      answersState={answersState}
    />
  </div>
</div>

        <div className="prompt">{currentQuestion.prompt}</div>

        <div className={`options-grid ${showCards ? '' : 'cards-exploding'}`}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option.value === currentQuestion.correct;
            const isSelected = option.value === selectedOption;
            const buttonBg = buttonBackgrounds[index % buttonBackgrounds.length];
            let className = 'option-card';

            if (selectedOption && isSelected && feedback === 'incorrect') {
              className += ' wrong';
            }
            if (selectedOption && isCorrect) {
              className += ' correct';
            }
            if (selectedOption && isSelected) {
              className += ' selected';
            }

            return (
              <button
                key={option.value}
                className={className}
                onClick={() => handleSelect(option)}
                disabled={Boolean(selectedOption)}
                style={{
                  '--order': index,
                  '--drift-x': index % 2 === 0 ? `-${120 + index * 28}px` : `${120 + index * 28}px`,
                  '--drift-y': index < 2 ? `-${90 + index * 18}px` : `${90 + index * 18}px`,
                  '--drift-rotate': `${index % 2 === 0 ? -14 : 14}deg`,
                  '--button-bg': `url(${buttonBg})`,
                }}
              >
                <span className="shadow" />
                <span className="edge" />
                <span className="front">
                  <span className="option-romaji">{option.value}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;