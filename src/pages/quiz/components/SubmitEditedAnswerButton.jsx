import React from "react";
import { useField } from "formik";

const SubmitEditedAnswerButton = ({ id, onClick }) => {
    const [field, ,] = useField(id);

    return (
        <div className="mt-3">
            <button
                type="button"
                className="btn btn-success"
                onClick={() => onClick({ id, value: field.value })}
            >
                Submit Edited Answer
            </button>
        </div>
    );
};

export default SubmitEditedAnswerButton;
