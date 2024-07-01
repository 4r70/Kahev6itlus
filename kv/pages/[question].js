import styles from "@/styles/Question.module.css";
import Questions from "../public/questions.json";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Back from "@/components/icons/back.js";
import Reset from "@/components/icons/reset.js";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
  const [guessedCorrectAnswers, setGuessedCorrectAnswers] = useState(0);
  const [guessWrongAnswers, setGuessWrongAnswers] = useState(0);

  if (!router.isReady || !question) {
    return <p>Loading...</p>;
  }

  const questionData = Questions.questions.find((q) => q.question === question);

  if (!questionData) {
    return <p>Question not found</p>;
  }

  const shuffledAnswers = shuffleArray([...questionData.answers]);

  let correctAnswersNumber = shuffledAnswers.filter(
    (answer) => answer.correct === true
  ).length;
  let incorrectAnswersNumber = shuffledAnswers.filter(
    (answer) => answer.correct === false
  ).length;

  function showAnswer(answer, index) {
    console.log(answer.correct);
    const updatedRevealed = [...revealed];
    updatedRevealed[index] = true;
    setRevealed(revealed.map((item, i) => (i === index ? true : item)));

    if (answer.correct) {
      setGuessedCorrectAnswers((prev) => prev + 1);
      checkRemainingAnswers("correct");
      if (turn === 1) {
        setScore1(score1 + scoreAdded);
      } else {
        setScore2(score2 + scoreAdded);
      }
    } else {
      setGuessWrongAnswers((prev) => prev + 1);
      checkRemainingAnswers("incorrect");
      if (turn === 1) {
        setScore1(0);
        setTurn(2);
      } else {
        setScore2(0);
        setTurn(1);
      }
    }
  }

  function checkRemainingAnswers(type) {
    let remainingScore =
      (correctAnswersNumber - guessedCorrectAnswers) * scoreAdded;
    if (type === "correct") {
      if (guessedCorrectAnswers + 1 === correctAnswersNumber) {
        revealAllAnswers();
      }
    } else {
      if (guessWrongAnswers + 1 === incorrectAnswersNumber) {
        revealAllAnswers();
        if (turn === 1) {
          setScore2(score2 + remainingScore);
        } else {
          setScore1(score1 + remainingScore);
        }
      }
    }
  }

  function revealAllAnswers() {
    setRevealed(Array(10).fill(true));
  }

  function resetAll() {
    setRevealed(Array(10).fill(false));
    setGuessedCorrectAnswers(0);
    setGuessWrongAnswers(0);
    setScore1(0);
    setScore2(0);
    setTurn(0);
    setPlayer1("");
    setPlayer2("");
  }

  return (
    <div className={styles.main}>
      <div className={styles.darken}></div>
      {turn === 1 ? <div className={styles.turn1}></div> : null}
      <div className={styles.leftColumn} onClick={() => setTurn(1)}>
        <input
          className={styles.playerName}
          placeholder="Sisesta nimi..."
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
        <input className={styles.mainScore} type="number" value={score1} />
        <p className={styles.mainScoreTitle}>Üldskoor</p>
      </div>
      <div className={styles.centerColumn}>
        <div className={styles.topRow}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <Back className={styles.backIcon} width={40} height={40} />
          </button>
          <h1>{questionData.question}</h1>
          <button onClick={() => resetAll()} className={styles.resetButton}>
            <Reset className={styles.resetIcon} width={40} height={40} />
          </button>
        </div>
        {shuffledAnswers.map((answer, index) => (
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
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
        <input className={styles.mainScore} type="number" value={score2} />
        <p className={styles.mainScoreTitle}>Üldskoor</p>
      </div>
    </div>
  );
}
