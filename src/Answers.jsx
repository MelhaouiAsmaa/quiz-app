export default function Answers({answer}) {
    console.log("Answers: ", answer);
    const score = answer.filter((a)=> a.correctAnswer === a.answer).length
  return <>
    <button className="btn btn-danger" disabled>You scored {score} out of {answer.length} !</button>
    <button className="btn btn-secondary">Create new quiz</button>
  </>;
}
