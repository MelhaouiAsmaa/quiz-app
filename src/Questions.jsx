import React, { useEffect, useState } from "react";

export default function Questions({ category, difficulty }) {
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error handling

  useEffect(() => {
    const fetchData = async() => {
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
  }, [category, difficulty, choices]);

  // If loading, show a loading message
  if (loading) return <p>Loading questions...</p>;

  // If there's an error, display it
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {choices?.map((choice) => (
        <React.Fragment key={choice.question}>
          <p>{choice.question}</p>
          {[...choice.incorrect_answers, choice.correct_answer]?.map( //to shuffle
            (answer) => (
              <button className="btn btn-outline-success" key={answer}>{answer}</button>
            )
          )}
        </React.Fragment>
      ))}
    </>
  );
}
