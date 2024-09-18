import React from "react";

const QuizSummary = ({ questions, answers, onEdit, onRestart }) => {
    const getQuestionLabelById = (id) => {
        try {
            const question = questions.find((question) => question.id === id);
            return question ? question.label : "";
        } catch (error) {
            return "";
        }
    };

    return (
        <div className="text-center">
            <h2>Great, You have successfully completed the Quiz!</h2>
            <div className="mt-4">
                {answers.map((answer, index) => (
                    <div key={answer.id} className="mb-3 text-left">
                        <h4>Question {index + 1}</h4>
                        <p>{getQuestionLabelById(answer.id)}</p>
                        <p className="font-weight-bold">{answer.value}</p>
                        <button
                            className="btn btn-link"
                            onClick={() => onEdit(index)}
                        >
                            Edit Answer
                        </button>
                    </div>
                ))}
                <button className="btn btn-primary mt-3" onClick={onRestart}>
                    Restart
                </button>
            </div>
        </div>
    );
};

export default QuizSummary;
