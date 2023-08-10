import React from "react";
import { useState } from "react";

export default function Reservation({ submitHandler }) {
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    };
    const [formData, setFormData] = useState(initialFormData);

    const handleInput = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    // const handleSubmit = (formData) => {
    //     console.log(formData);
    //     const abortController = new AbortController();
    //     createReservation(formData, abortController).then((e) => {
    //         history.push("/reservations");
    //     });
    //     return () => abortController.abort();
    // };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        submitHandler(formData);

        setFormData({ ...initialFormData });
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
                    value={formData.people}
                    onChange={handleInput}
                ></input>
                <button type="submit" className="btn btn-primary mr-5 mt-3">
                    Submit
                </button>
                <button className="btn btn-danger mt-3">Cancel</button>
            </form>
        </div>
    );
}
