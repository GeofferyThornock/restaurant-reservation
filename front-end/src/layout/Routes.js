import React, { useState } from "react";
import { createReservation } from "../utils/api";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservation/Reservation";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
    const history = useHistory();
    const [error, setError] = useState(null);

    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };

    const createReservationHandler = (data) => {
        const abortController = new AbortController();

        const time = Number(data.reservation_time.replace(":", ""));
        console.log(time);
        if (time >= 2200 || time <= 1030) {
            setError("Must pick a time during work hours");
            return;
        }

        setError(null);
        createReservation(data, abortController.signal)
            .then((e) => {
                history.push(`/dashboard?date=${data.reservation_date}`);
            })
            .catch();

        return () => abortController.abort();
    };

    return (
        <Switch>
            <Route exact={true} path="/">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route exact={true} path="/reservations">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route path="/dashboard">
                <Dashboard defaultDate={today()} />
            </Route>
            <Route path="/reservations/new">
                <Reservations
                    submitHandler={createReservationHandler}
                    initialFormData={initialFormData}
                    date={today()}
                    errors={error}
                    setErrors={setError}
                />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

export default Routes;
