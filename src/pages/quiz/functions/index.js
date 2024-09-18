export const getAnswerById = (id, answers) => {
    try {
        const answer = answers.find((answer) => answer.id === id);
        console.table(answers);
        return answer ? answer.value : "";
    } catch (error) {
        return "";
    }
};

export const getQuestionIndexById = (id, questions) => {
    try {
        const questionIndex = questions.findIndex(
            (question) => question.id === id
        );
        return questionIndex;
    } catch (error) {
        return -1;
    }
};
