import styles from "@/styles/Question.module.css";
import Questions from "../public/questions.json";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Back from "@/components/icons/back.js";
import Reset from "@/components/icons/reset.js";
import Head from "next/head";

export default function Question() {
  const router = useRouter();
  const { question } = router.query;
  const [theme, setTheme] = useState("default");
  const [player1, setPlayer1] = useState(router.query.p1n || "");
  const [player2, setPlayer2] = useState(router.query.p2n || "");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [mainScore1, setMainScore1] = useState(router.query.p1s || 0);
  const [mainScore2, setMainScore2] = useState(router.query.p2s || 0);
  const [turn, setTurn] = useState(0);
  const [revealed, setRevealed] = useState(Array(10).fill(false));
  const [scoreAdded, setScoreAdded] = useState(10);
  const [guessedCorrectAnswers, setGuessedCorrectAnswers] = useState(0);
  const [guessWrongAnswers, setGuessWrongAnswers] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [currentComment, setCurrentComment] = useState("");
  const [correctAudio, setCorrectAudio] = useState(null);
  const [incorrectAudio, setIncorrectAudio] = useState(null);
  const [allDoneAudio, setAllDoneAudio] = useState(null);

  useEffect(() => {
    // Check if the window is available and then set up audio objects
    if (typeof window !== "undefined") {
      setCorrectAudio(new Audio('./correct.mp3'));
      setIncorrectAudio(new Audio('./incorrect.mp3'));
      setAllDoneAudio(new Audio('./all.mp3'));
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, p1s: mainScore1, p2s: mainScore2, p1n: player1 , p2n: player2 }
        },
          { shallow: true }
      );
    }
  }, [mainScore1, mainScore2, router.isReady]);

  useEffect(() => {
    if (router.isReady && question) {
      const queryTheme = router.query.theme;
      setTheme(queryTheme || "default");
      const questionData = Questions.questions.find(
        (q) => q.question === question
      );
      if (!questionData) {
        console.error('Question not found');
        return;
      }
      setShuffledAnswers(shuffleArray([...questionData.answers]));
    }
  }, [router.isReady, question]);

  if (!router.isReady || !question) {
    return <p>Loading...</p>;
  }

  let correctAnswersNumber = shuffledAnswers.filter(
    (answer) => answer.correct === true
  ).length;
  let incorrectAnswersNumber = shuffledAnswers.filter(
    (answer) => answer.correct === false
  ).length;

  function showAnswer(answer, index) {
    const updatedRevealed = [...revealed];
    updatedRevealed[index] = true;
    setRevealed(updatedRevealed);
    setCurrentComment(answer.comment);

    if (answer.correct) {
      correctAudio.play();
      setGuessedCorrectAnswers((prev) => prev + 1);
      checkRemainingAnswers("correct");
      if (turn === 1) {
        setScore1((prev) => prev + scoreAdded);
        setMainScore1((prev) => Number(prev) + scoreAdded);
      } else {
        setScore2((prev) => prev + scoreAdded);
        setMainScore2((prev) => Number(prev) + scoreAdded);
      }
    } else {
      incorrectAudio.play();
      setGuessWrongAnswers((prev) => prev + 1);
      checkRemainingAnswers("incorrect");
      if (turn === 1) {
        setMainScore1((prev) => prev - score1);
        setScore1(0);
        setTurn(2);
      } else {
        setMainScore2((prev) => prev - score2);
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
          setScore2((prev) => prev + remainingScore);
          setMainScore2((prev) => prev + remainingScore);
        } else {
          setScore1((prev) => prev + remainingScore);
          setMainScore1((prev) => prev + remainingScore);
        }
      }
    }
  }

  function revealAllAnswers() {
    setTimeout(() => {
      allDoneAudio.play();
      setRevealed(Array(10).fill(true));
    }, 1000);
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
    setCurrentComment("");
    setScoreAdded(10);
    document.getElementById('pointsSwitchInput').checked = false;
  }

  function handleKeyPress(event) {
    const key = event.key;
    if (key >= '1' && key <= '9') {
      const index = parseInt(key) - 1;
      if (!revealed[index]) {
        showAnswer(shuffledAnswers[index], index);
      }
    } else if (key === '0') {
      const index = 9;
      if (!revealed[index]) {
        showAnswer(shuffledAnswers[index], index);
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [revealed, shuffledAnswers]);

  return (
    <>
      <Head>
        <title>{question}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.main} ${theme === "KOIT" ? styles.koitBg : ""}`}>
        <div className={styles.darken}></div>
        {turn === 1 ? (
          <div className={`${styles.turn1} ${theme === "KOIT" ? styles.koitTurn1 : ""}`}></div>
        ) : null}
        <div className={styles.leftColumn} onClick={() => setTurn(1)}>
          <div className={styles.pointsSwitchRow}>
            <div className={styles.pointsSwitchTitle}>Jagatavad punktid:</div>
            <div className={styles.pointsSwitchContainer}>
              10
              <label className={styles.pointsSwitch} onClick={(e) => e.stopPropagation()}>
                <input
                  className={styles.pointsSwitchInput}
                  type="checkbox"
                  id="pointsSwitchInput"
                  onChange={() =>
                    setScoreAdded((prev) => (prev === 10 ? 30 : 10))
                  }
                />
                <span className={styles.slider}></span>
              </label>
              30
            </div>
          </div>
          <div className={styles.playerRowLeft}>
            <input
              className={styles.playerName}
              placeholder="Sisesta nimi..."
              value={player1}
              onChange={(e) => { setPlayer1(e.target.value), router.push({ pathname: router.pathname, query: { ...router.query, p1n: e.target.value } }, { shallow: true }) }}
              onClick={(e) => e.stopPropagation()}
            />
            <input
              className={styles.mainScore}
              type="number"
              value={score1}
              onChange={(e) => setScore1(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
            />
            <p className={styles.mainScoreTitle}>Skoor</p>
            <input
              className={styles.totalScore}
              type="number"
              value={mainScore1}
              onChange={(e) => setMainScore1(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
            />
            <p className={styles.totalScoreTitle}>Üldskoor</p>
          </div>
        </div>
        <div className={styles.centerColumn}>
          <div className={styles.topRow}>
            <button title="Tagasi küsimuste juurde" onClick={() => router.push({ pathname: "/", query: { theme: router.query.theme, p1s: mainScore1, p2s: mainScore2, p1n: player1, p2n: player2 } })} className={styles.backButton}>
              <Back className={styles.backIcon} width={40} height={40} />
            </button>
            <h1>{question}</h1>
            <button title="Lähtesta raund" onClick={() => resetAll()} className={styles.resetButton}>
              <Reset className={styles.resetIcon} width={40} height={40} />
            </button>
          </div>
          <div className={styles.optionsColumn}>
            {shuffledAnswers.map((answer, index) => (
              <button
                disabled={revealed[index]}
                onClick={() => showAnswer(answer, index)}
                className={`${styles.option} ${revealed[index]
                  ? answer.correct
                    ? styles.correct
                    : styles.incorrect
                  : ""
                  }`}
              >
                <span>{index + 1}.</span>
                <p>{answer.answer}</p>
              </button>
            ))}
          </div>
        </div>
        {turn === 2 ? <div className={`${styles.turn2} ${theme === "KOIT" ? styles.koitTurn2 : ""}`}></div> : null}
        <div className={styles.rightColumn} onClick={() => setTurn(2)}>
          <div className={styles.commentRow}>
            {currentComment && (
              <div className={styles.comment}>
                <p>{currentComment}</p>
              </div>
            )
            }
          </div>
          <div className={styles.playerRowRight}>
            <input
              className={styles.playerName}
              placeholder="Sisesta nimi..."
              value={player2}
              onChange={(e) => { setPlayer2(e.target.value), router.push({ pathname: router.pathname, query: { ...router.query, p2n: e.target.value } }, { shallow: true }) }}
              onClick={(e) => e.stopPropagation()}
            />
            <input
              className={styles.mainScore}
              type="number"
              value={score2}
              onChange={(e) => setScore2(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
            />
            <p className={styles.mainScoreTitle}>Skoor</p>
            <input
              className={styles.totalScore}
              type="number"
              value={mainScore2}
              onChange={(e) => setMainScore2(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
            />
            <p className={styles.totalScoreTitle}>Üldskoor</p>
          </div>
        </div>
      </div>
    </>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

