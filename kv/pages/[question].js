import styles from "@/styles/Question.module.css";
import Questions from "../public/questions.json";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Question() {
  const router = useRouter();
  const { question } = router.query;
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [turn, setTurn] = useState(0);
  const [revealed, setRevealed] = useState(Array(10).fill(false));
  const [scoreAdded, setScoreAdded] = useState(10);
  console.log(question);

  const questionData = Questions.questions.find((q) => q.question === question);

  if (!questionData) {
    return <p>Question not found</p>;
  }

  function showAnswer(answer, index) {
    console.log(answer.correct);
    const updatedRevealed = [...revealed];
    updatedRevealed[index] = true;
    setRevealed(revealed.map((item, i) => (i === index ? true : item)));
    if (answer.correct) {
      if (turn === 1) {
        setScore1(score1 + scoreAdded);
      } else {
        setScore2(score2 + scoreAdded);
      }
    } else {
      if (turn === 1) {
        setScore1(0);
      } else {
        setScore2(0);
      }
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.darken}></div>
      {turn === 1 ? <div className={styles.turn1}></div> : null}
      <div className={styles.leftColumn} onClick={() => setTurn(1)}>
        <input
          className={styles.playerName}
          placeholder="Sisesta nimi..."
          onChange={(value) => setPlayer1(value)}
        />
        <input className={styles.mainScore} type="number" value={score1} />
        <p className={styles.mainScoreTitle}>Üldskoor</p>
      </div>
      <div className={styles.centerColumn}>
        <h1>{questionData.question}</h1>
        {questionData.answers.map((answer, index) => (
          <div key={answer.answer} className={styles.answer}>
            <button
              disabled={revealed[index]}
              onClick={() => showAnswer(answer, index, turn)}
              className={`${styles.option} ${
                revealed[index]
                  ? answer.correct
                    ? styles.correct
                    : styles.incorrect
                  : ""
              }`}
            >
              <span>{index + 1}.</span>
              <p>{answer.answer}</p>
            </button>
          </div>
        ))}
      </div>
      {turn === 2 ? <div className={styles.turn2}></div> : null}
      <div className={styles.rightColumn} onClick={() => setTurn(2)}>
        <input
          className={styles.playerName}
          placeholder="Sisesta nimi..."
          onChange={(value) => setPlayer2(value)}
        />
        <input className={styles.mainScore} type="number" value={score2} />
        <p className={styles.mainScoreTitle}>Üldskoor</p>
      </div>
    </div>
  );
}
