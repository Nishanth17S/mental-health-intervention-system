import React, { useState } from 'react';
import './Screening.css';

function Screening() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: 'q1',
      text: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
    },
    {
      id: 'q2',
      text: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
    },
    {
      id: 'q3',
      text: 'Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?',
    },
  ];

  const options = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' },
  ];

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);

  const riskLevel = totalScore >= 6 ? 'high' : totalScore >= 3 ? 'moderate' : 'low';

  return (
    <div className="screening-container">
      <h1 className="screening-title">Self Screening</h1>
      <p className="screening-subtitle">This quick check can help you understand your current wellbeing.</p>

      <form onSubmit={handleSubmit} className="screening-form">
        {questions.map((q) => (
          <div key={q.id} className="screening-question">
            <label className="question-text">{q.text}</label>
            <div className="options">
              {options.map((opt) => (
                <label key={opt.value} className="option">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    checked={answers[q.id] === opt.value}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className="submit-btn">View Result</button>
      </form>

      {submitted && (
        <div className={`result result-${riskLevel}`}>
          <h2>Your Result</h2>
          <p>Total score: <strong>{totalScore}</strong></p>
          <p>Risk level: <strong className={`badge badge-${riskLevel}`}>{riskLevel.toUpperCase()}</strong></p>
          {riskLevel === 'high' && (
            <p className="tip">Consider reaching out to a counselor or using the appointment booking feature.</p>
          )}
          {riskLevel === 'moderate' && (
            <p className="tip">Try guided exercises in the Resources section and monitor how you feel.</p>
          )}
          {riskLevel === 'low' && (
            <p className="tip">Keep taking care of yourself. Explore breathing, grounding, or journaling exercises.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Screening;
