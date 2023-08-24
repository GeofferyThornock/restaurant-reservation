import React, { useState } from "react";
import { searchReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../dashboard/reservationList";

export default function Search() {
    const [formData, setFormData] = useState({
        mobile_number: "",
    });
    const [reservations, setReservations] = useState([]);
    const [err, setErr] = useState({});
    const [text, setText] = useState({});

    const handleInput = (e) => {
        setFormData({
            [e.target.name]: e.target.value,
        });
    };

    const reloadHandler = () => {
        const abortController = new AbortController();

        searchReservations(formData.mobile_number, abortController.signal)
            .then((e) => {
                if (e.length) {
                    setReservations(e);
                    setText({});
                } else {
                    setReservations([]);
                    setText({ message: "No reservations found" });
                }
            })
            .catch(setErr);

        return () => abortController.abort();
    };

    const searchHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();

        searchReservations(formData.mobile_number, abortController.signal)
            .then((e) => {
                if (e.length) {
                    setReservations(e);
                    setText({});
                } else {
                    setReservations([]);
                    setText({ message: "No reservations found" });
                }
            })
            .catch(setErr);

        return () => abortController.abort();
    };
    return (
        <div>
            {err.message && <ErrorAlert error={err} />}
            <form className="form-group mt-3" onSubmit={searchHandler}>
                <input
                    name="mobile_number"
                    className="form-control mb-3"
                    placeholder="Enter a customer's phone number"
                    value={formData.search}
                    onChange={handleInput}
                ></input>
                <button
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                >
                    Find
                </button>
            </form>
            <div className="d-md-flex m-2 flex-wrap">
                {reservations &&
                    reservations.map((e) => (
                        <ReservationList
                            key={e.reservation_id}
                            reservation={e}
                            reloadHandler={reloadHandler}
                        />
                    ))}
                {text && <p>{text.message}</p>}
            </div>
        </div>
    );
}
