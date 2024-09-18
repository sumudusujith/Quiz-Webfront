import * as Yup from "yup";

const QuizValidationSchema = (questions) => {
    const schema = {};

    questions.forEach((question) => {
        // If the question is required, apply a required validation
        if (question.required) {
            if (question.id === "q7") {
                schema[question.id] = Yup.string()
                    .email("Invalid email address")
                    .required("Email is required");
            } else if (question.id === "q8") {
                schema[question.id] = Yup.string()
                    .matches(
                        /^[0-9]{10}$/,
                        "Enter a valid 10-digit phone number"
                    )
                    .required("Phone number is required");
            } else {
                schema[question.id] = Yup.string().required(
                    "This field is required"
                );
            }
        }
    });

    return Yup.object().shape(schema); // Return the Yup object schema
};

export default QuizValidationSchema;
