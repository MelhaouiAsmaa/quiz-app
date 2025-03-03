import React, { useEffect, useState } from "react";
import Answers from "./Answers";

export default function Questions({ category, difficulty }) {
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error handling
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Track selected answers
  const [submitAnswers, setSubmitAnswers] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetch(
        `https://opentdb.com/api.php?amount=5&category=${category}&difficulty=${difficulty}&type=multiple`
        // "https://opentdb.com/api.php?amount=5&category=10&difficulty=easy&type=multiple"
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.results) {
            setChoices(data.results);
            console.log("results: ", choices);
          } else {
            throw new Error("No questions found");
          }
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    if (choices.length === 0)
      setTimeout(() => {
        fetchData();
      }, 3000);
  }, [category, difficulty, choices]);

  // If loading, show a loading message
  if (loading) return <p>Loading questions...</p>;

  // If there's an error, display it
  if (error) return <p>Error: {error}</p>;

  const handleAnswerClick = (question, correctAnswer, answer) => {
    setSelectedAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.question === question
      );

      if (existingIndex !== -1) {
        // Update existing question's answer
        return prev.map((item, index) =>
          index === existingIndex ? { ...item, answer } : item
        );
      } else {
        // Add new question-answer pair
        return [...prev, { question, correctAnswer, answer }];
      }
    });
  };

  function handleSubmit() {
    setSubmitAnswers(true);
  }

  return (
    <>
      {choices?.map((choice) => (
        <React.Fragment key={choice.question}>
          <p>{choice.question}</p>
          {[...choice.incorrect_answers, choice.correct_answer]?.map(
            //to shuffle
            (answer) => (
              <button
                className={`btn ${
                  submitAnswers
                    ? selectedAnswers.some(
                        (item) =>
                          item.question === choice.question &&
                          item.answer === answer &&
                          item.correctAnswer !== item.answer
                      )
                      ? "btn-danger" // Wrong answer -> Red
                      : selectedAnswers.some(
                          (item) =>
                            item.question === choice.question &&
                            item.answer === answer &&
                            item.correctAnswer === item.answer
                        )
                      ? "btn-success" // Correct answer -> Green
                      : "btn-outline-success" // Not selected -> Green outline
                    : selectedAnswers.some(
                        (item) =>
                          item.question === choice.question &&
                          item.answer === answer
                      )
                    ? "btn-success" // Selected but not submitted -> Green
                    : "btn-outline-success" // Default -> Green outline
                }`}
                key={answer}
                onClick={() =>
                  handleAnswerClick(
                    choice.question,
                    choice.correct_answer,
                    answer
                  )
                }
              >
                {answer}
              </button>
            )
          )}
        </React.Fragment>
      ))}
      {selectedAnswers.length === 5 && (
        !submitAnswers ?
        <div>
          <button className="btn btn-secondary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        :
        <Answers answer={selectedAnswers} />
      )}
    </>
  );
}
