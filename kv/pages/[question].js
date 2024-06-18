import styles from "@/styles/Question.module.css";
import Questions from "../public/questions.json";
import { useRouter } from "next/router";

export default function Question() {
    const router = useRouter();
    const { question } = router.query;
    console.log(question);

    const questionData = Questions.questions.find(q => q.question === question);

    if (!questionData) {
        return <p>Question not found</p>;
    }

    return (
        <div className={styles.main}>
            <div className={styles.leftColumn}>
                <input placeholder="Sisesta nimi..." />
                <input type="number" />
                <p>Üldskoor</p>
            </div>
            <div className={styles.centerColumn}>
                <h1>{questionData.question}</h1>
                {questionData.answers.map((answer, index) => (
                    <div key={answer.answer} className={styles.answer}>
                        <div className={styles.option}><span>{index+1}.</span><p>{answer.answer}</p></div>
                    </div>
                ))}
            </div>
            <div className={styles.rightColumn}>
                <input placeholder="Sisesta nimi..." />
                <input type="number" />
                <p>Üldskoor</p>
            </div>
        </div>
    )
}