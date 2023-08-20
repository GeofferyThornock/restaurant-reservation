import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function CreateTables({ submitHandler }) {
    const history = useHistory();
    const initialFormData = {
        table_name: "",
        capacity: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleInput = (e) => {
        console.log(formData);
        if (e.target.name === "capacity") {
            console.log(e.target.value);
            setFormData({
                ...formData,
                [e.target.name]: Number(e.target.value),
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        submitHandler(formData);

        setFormData({ ...initialFormData });
    };

    const cancelButton = (e) => {
        history.goBack();
    };

    return (
        <div>
            <form className="mb-3 mt-3" onSubmit={handleFormSubmit}>
                <label htmlFor="table_name" className="form-label">
                    Table Name:{" "}
                </label>
                <input
                    name="table_name"
                    className="form-control"
                    value={formData.table_name}
                    minLength="2"
                    onChange={handleInput}
                ></input>
                <label htmlFor="capacity" className="form-label mt-3">
                    Number of Seats:{" "}
                </label>
                <input
                    name="capacity"
                    className="form-control"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInput}
                ></input>
                <button type="submit" className="btn btn-primary mt-3 mr-5">
                    Submit
                </button>
                <button
                    className="btn btn-danger mt-3"
                    onClick={() => cancelButton()}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}
