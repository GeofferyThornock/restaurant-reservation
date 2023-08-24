import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Reservation from "./Reservation";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateReservation() {
    const history = useHistory();
    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };
    const [error, setError] = useState(null);

    const createReservationHandler = (data) => {
        const abortController = new AbortController();
        console.log(error);
        createReservation(data, abortController.signal)
            .then((e) => {
                history.push(`/dashboard?date=${data.reservation_date}`);
            })
            .catch(setError);

        return () => abortController.abort();
    };

    return (
        <div>
            {error && <ErrorAlert error={error} />}
            <Reservation
                submitHandler={createReservationHandler}
                initialFormData={initialFormData}
                error={error}
                setError={setError}
            />
        </div>
    );
}
