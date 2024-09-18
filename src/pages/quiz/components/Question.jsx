import React from "react";
import { Select, YesNoRadioField, TextField } from "../../../components/forms";

export default function Question({ questionData, questionNumber }) {
    return (
        <div>
            <h3>Question {questionNumber}</h3>
            <p>{questionData.label}</p>
            <div>
                {questionData.type === "text" && (
                    <TextField
                        name={questionData.id}
                        required={questionData.required}
                    />
                )}

                {questionData.type === "select" && (
                    <Select
                        name={questionData.id}
                        options={questionData.options}
                        required={questionData.required}
                    />
                )}
            </div>
            {questionData.type === "radio" && (
                <YesNoRadioField name={questionData.id} />
            )}
        </div>
    );
}
