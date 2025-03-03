import { useState, useEffect } from "react";
import Questions from "./Questions";

export default function QuestionsFilters() {
  const [categories, setCategories] = useState([]);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    // Fetch categories
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => setCategories(data.trivia_categories));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryId = formData.get("category");
    const difficulty = formData.get("difficulty");
    setQuizData({ categoryId, difficulty });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <select id="categorySelect" name="category">
          <option disabled>Select a category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select id="difficultySelect" name="difficulty">
          <option disabled>Select difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button id="createBtn" type="submit">
          Create
        </button>
      </form>
      {quizData && (
        <Questions
          key={`${quizData.categoryId}-${quizData.difficulty}`} //for resetting the state
          category={quizData.categoryId}
          difficulty={quizData.difficulty}
        />
      )}
    </>
  );
}
