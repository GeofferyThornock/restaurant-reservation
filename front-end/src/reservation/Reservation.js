import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Reservation({
    submitHandler,
    initialFormData,
    date,
    error,
    setError,
}) {
    const history = useHistory();

    const [formData, setFormData] = useState(initialFormData);

    const handleInput = (event) => {
        setError(null);
        if (event.target.name === "reservation_date") {
            const resDate = new Date(event.target.value);
            const todayDate = new Date(date);

            if (resDate < todayDate) {
                setError({ message: "Reservation cannot be made in the past" });
            }
            if (resDate.getUTCDay() === 2) {
                setError({ message: "Restaurant is closed on Tuesdays" });
            }
            if (resDate < todayDate && resDate.getUTCDay() === 2) {
                setError({
                    message:
                        "Reservation cannot be made in the past and Restaurant is closed on Tuesdays",
                });
            }
        }
        if (event.target.name === "people") {
            if (Number.isNaN(event.target.value)) {
                setError("people is not a number");
            } else {
                setFormData({
                    ...formData,
                    [event.target.name]: Number(event.target.value),
                });
            }
        } else {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const time = Number(formData.reservation_time.replace(":", ""));

        if (time >= 2200 || time <= 1030) {
            setError({ message: "Must pick a time during work hours" });
            return;
        }

        submitHandler(formData);

        setFormData({ ...initialFormData });
    };

    const cancelButton = (e) => {
        history.goBack();
    };

    return (
        <div>
            <form className="mb-3" onSubmit={handleFormSubmit}>
                <label htmlFor="first_name" className="form-label mt-2">
                    First Name
                </label>
                <input
                    name="first_name"
                    className="form-control mb-2"
                    placeholder="e.g. John"
                    value={formData.first_name}
                    onChange={handleInput}
                ></input>
                <label htmlFor="last_name" className="form-label">
                    Last Name
                </label>
                <input
                    name="last_name"
                    className="form-control"
                    placeholder="e.g. Doe"
                    value={formData.last_name}
                    onChange={handleInput}
                ></input>
                <label htmlFor="mobile_number" className="form-label mt-2">
                    Mobile Phone
                </label>
                <input
                    name="mobile_number"
                    className="form-control"
                    placeholder="Phone Number"
                    value={formData.mobile_number}
                    onChange={handleInput}
                ></input>
                <label htmlFor="reservation_date" className="form-label mt-2">
                    Reservation Date
                </label>
                <input
                    name="reservation_date"
                    type="date"
                    className="form-control"
                    value={formData.reservation_date}
                    onChange={handleInput}
                ></input>
                <label htmlFor="reservation_time" className="form-label mt-2">
                    Reservation Time
                </label>
                <input
                    name="reservation_time"
                    type="time"
                    className="form-control"
                    value={formData.reservation_time}
                    onChange={handleInput}
                ></input>
                <label htmlFor="people" className="form-label mt-2">
                    Number of People:
                </label>
                <input
                    name="people"
                    type="number"
                    className="form-control"
                    pattern="[1-9]+"
                    value={formData.people}
                    onChange={handleInput}
                ></input>
                <button type="submit" className="btn btn-primary mr-5 mt-3">
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
