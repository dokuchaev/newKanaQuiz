import correctImg from './assets/correct.png';
import incorrectImg from './assets/incorrect.png';

function ProgressIndicator({ total, currentIndex, answersState }) {
  const correctCount = answersState.filter((status) => status === 'correct').length;
  const incorrectCount = answersState.filter((status) => status === 'incorrect').length;
  const answeredCount = correctCount + incorrectCount;
  const progressPercent = total > 0 ? Math.min((answeredCount / total) * 100, 100) : 0;

  return (
    <div className="progress-status-row" aria-label="Прогресс вопросов">
      <div className="progress-counter progress-counter-wrong">
        <img src={incorrectImg} alt="Неправильные ответы" className="progress-counter-icon" />
        <span className="progress-counter-value">{incorrectCount}</span>
      </div>

      <div className="progress-bar-col">
        <span className="progress-bar-label">{answeredCount}/{total}</span>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="progress-counter progress-counter-right">
         <span className="progress-counter-value">{correctCount}</span>
        <img src={correctImg} alt="Правильные ответы" className="progress-counter-icon" />
       
      </div>
    </div>
  );
}

export default ProgressIndicator;