import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import quiz from "../../utils/quiz.json";
import Question from "./components/Question"; // Assumes this component handles the question display
import SubmitEditedAnswerButton from "./components/SubmitEditedAnswerButton";
import { QuizValidationSchema } from "./validations";
import { Form } from "../../components/forms";
import QuizSummary from "./components/QuizSummary";
import { getAnswerById, getQuestionIndexById } from "./functions";

// const questions = quiz.form;

export default function QuizPage() {
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isCompleted, setCompleted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const storedAnswers = localStorage.getItem("quizAnswers");
        const storedIndex = localStorage.getItem("quizIndex");
        const storedCompletion = localStorage.getItem("isCompleted");
        const storedAnsweredQuestions =
            localStorage.getItem("answeredQuestions");

        if (storedAnswers) {
            setAnswers(JSON.parse(storedAnswers));
        }
        if (storedIndex) {
            setCurrentQuizIndex(parseInt(storedIndex, 10));
        }
        if (storedCompletion === "true") {
            setCompleted(true);
        }
        if (storedAnsweredQuestions) {
            setAnsweredQuestions(JSON.parse(storedAnsweredQuestions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("quizAnswers", JSON.stringify(answers));
        localStorage.setItem("quizIndex", currentQuizIndex.toString());
        localStorage.setItem("isCompleted", isCompleted.toString());
        //     localStorage.setItem("displayOrder", JSON.stringify(displayOrder));
        // }, [answers, currentQuizIndex, displayOrder, isCompleted]);
        localStorage.setItem(
            "answeredQuestions",
            JSON.stringify(answeredQuestions)
        );
    }, [answers, currentQuizIndex, answeredQuestions, isCompleted]);

    const isLastQuestion = useMemo(() => {
        return currentQuizIndex === questions.length - 1;
    }, [currentQuizIndex]);

    // Fetch data when the component mounts
    const fetchData = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/quiz/66e410b3406c2ec5eaeba348"
            );
            console.log("response ok", response);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const quiz = await response.json();
            console.log("result ==> ", quiz);
            setQuestions(quiz.form);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (values) => {
        const currentQuestion = questions[currentQuizIndex];
        const answer = values[currentQuestion.id];

        // Check if the answer for the current question already exists
        const existingAnswerIndex = answers.findIndex(
            (ans) => ans.id === currentQuestion.id
        );

        // If answer exists, update it; otherwise, add it to the array
        if (existingAnswerIndex >= 0) {
            const updatedAnswers = [...answers];
            updatedAnswers[existingAnswerIndex] = {
                id: currentQuestion.id,
                value: answer,
            };
            setAnswers(updatedAnswers);
        } else {
            setAnswers([...answers, { id: currentQuestion.id, value: answer }]);
        }

        if (!answeredQuestions.includes(currentQuizIndex)) {
            setAnsweredQuestions((prev) => [...prev, currentQuizIndex]);
        }

        // If it's the last question, mark the quiz as completed
        if (isLastQuestion) {
            setCompleted(true);
        } else {
            let nextQuestionIndex = currentQuizIndex + 1;
            const nextQuestion = questions[nextQuestionIndex];
            const conditions = nextQuestion?.conditions;

            if (conditions) {
                const conditionsKeys = Object.keys(conditions);
                const isNextConditionNotValid = conditionsKeys.some((key) => {
                    const condition = conditions[key];
                    const answer = values[key];
                    return !condition.includes(answer);
                });

                if (isNextConditionNotValid) {
                    nextQuestionIndex += 1;
                }
            }

            const hasNextQuestion = nextQuestionIndex < questions.length;
            if (hasNextQuestion) {
                setCurrentQuizIndex(nextQuestionIndex);
            } else {
                setCompleted(true);
            }
        }
    };

    const handleEditAnswer = (index) => {
        console.log("index", index);
        setIsEditing(true);

        const questionId = answers[index].id;
        const questionIndexToEdit = getQuestionIndexById(questionId, questions);
        console.log("questionIndexToEdit", questionIndexToEdit);

        setCurrentQuizIndex(questionIndexToEdit);
        // Allow users to re-answer questions
        setCompleted(false);
    };

    /**
     * @description - Update given new answer with the existing answer in the answers array
     * @param {Object} newAnswer - Edited answer object
     * @returns - Updated answers array with new edited answer
     */
    const updateAnswer = (newAnswer) => {
        const newAnswers = [...answers];
        return newAnswers.map((answer) => {
            if (answer.id === newAnswer.id) {
                answer.value = newAnswer.value;
            }
            return answer;
        });
    };

    const handleEditComplete = (newAnswer) => {
        setIsEditing(false);
        console.log("newAnswer =>", newAnswer);
        const updatedAnswers = updateAnswer(newAnswer);
        console.log("updatedAnswers =>", updatedAnswers);
        setAnswers(updatedAnswers);

        // Redirect to the answer summary after editing
        setCompleted(true);
    };

    const handleBack = (id) => {
        const currentQuestionId = questions[currentQuizIndex].id;
        const answer = answers.find(
            (answer) => answer.id === currentQuestionId
        );
        let previousQuestionId;
        if (answer) {
            const answerIndex = answers.findIndex(
                (answer) => answer.id === currentQuestionId
            );
            previousQuestionId = answers[answerIndex - 1].id;
        } else {
            previousQuestionId = answers[answers.length - 1].id;
        }

        const previousQuestionIndex = questions.findIndex(
            (question) => question.id === previousQuestionId
        );
        console.table(answers);
        console.log("currentQuestionId => ", currentQuestionId, id);
        console.log("previousQuestionId => ", previousQuestionId);
        console.log("previousQuestionIndex => ", previousQuestionIndex);
        setCurrentQuizIndex(previousQuestionIndex);
    };

    const handleRestart = () => {
        setCurrentQuizIndex(0);
        setCompleted(false);
        setAnswers([]);
        setAnsweredQuestions([]);
        localStorage.removeItem("quizAnswers");
        localStorage.removeItem("quizIndex");
        localStorage.removeItem("isCompleted");
        localStorage.removeItem("answeredQuestions");
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12 text-center mb-4">
                        <h1>Questionnaire</h1>
                    </div>
                </div>
                {isLoading ? (
                    <div>
                        <span>Loading data...</span>
                    </div>
                ) : (
                    <>
                        {isCompleted && !isEditing ? (
                            <QuizSummary
                                questions={questions}
                                answers={answers}
                                onEdit={(index) => handleEditAnswer(index)}
                                onRestart={handleRestart}
                            />
                        ) : (
                            <div className="card shadow-sm p-4">
                                {Array.isArray(questions) &&
                                questions.length > 0 ? (
                                    <Form
                                        initialValues={{
                                            [questions[currentQuizIndex].id]:
                                                getAnswerById(
                                                    questions[currentQuizIndex]
                                                        .id,
                                                    answers
                                                ),
                                        }}
                                        validationSchema={QuizValidationSchema([
                                            questions[currentQuizIndex],
                                        ])}
                                        enableReinitialize
                                        onSubmit={handleSubmit}
                                    >
                                        <Question
                                            questionData={
                                                questions[currentQuizIndex]
                                            }
                                            questionNumber={answers.length + 1}
                                        />
                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                className="btn btn-secondary"
                                                type="button"
                                                onClick={() =>
                                                    handleBack(
                                                        questions[
                                                            currentQuizIndex
                                                        ].id
                                                    )
                                                }
                                                disabled={
                                                    currentQuizIndex === 0
                                                }
                                            >
                                                Back
                                            </button>
                                            {isEditing ? (
                                                <SubmitEditedAnswerButton
                                                    id={
                                                        questions[
                                                            currentQuizIndex
                                                        ].id
                                                    }
                                                    onClick={handleEditComplete}
                                                />
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    type="submit"
                                                    // disabled={isSubmitting}
                                                >
                                                    {isLastQuestion
                                                        ? "Submit"
                                                        : "Next"}
                                                </button>
                                            )}
                                        </div>
                                    </Form>
                                ) : (
                                    <div>No Data!</div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
