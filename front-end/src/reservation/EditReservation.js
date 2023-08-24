import React, { useEffect, useState } from "react";
import {
    useParams,
    useHistory,
} from "react-router-dom/cjs/react-router-dom.min";
import { findReservation, updateReservation } from "../utils/api";
import Reservation from "./Reservation";
import ErrorAlert from "../layout/ErrorAlert";

export default function EditReservation() {
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({});
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        findReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);

        return () => abortController.abort();
    }, [reservation_id]);

    const submitHandler = (data) => {
        const abortController = new AbortController();
        console.log(error);
        updateReservation(reservation_id, data, abortController.signal)
            .then((e) => {
                history.push(`/dashboard?date=${data.reservation_date}`);
            })
            .catch(setError);

        return () => abortController.abort();
    };

    return (
        <div>
            {error && <ErrorAlert error={error} />}
            {reservation.status === "booked" ? (
                <Reservation
                    submitHandler={submitHandler}
                    initialFormData={{
                        first_name: reservation.first_name,
                        last_name: reservation.last_name,
                        mobile_number: reservation.mobile_number,
                        reservation_date: reservation.reservation_date,
                        reservation_time: reservation.reservation_time,
                        people: reservation.people,
                    }}
                    error={error}
                    setError={setError}
                />
            ) : null}
        </div>
    );
}
