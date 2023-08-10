import React from "react";
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

    const createReservationHandler = (data) => {
        const abortController = new AbortController();
        createReservation(data, abortController.signal)
            .then((e) => {
                console.log(e);
                history.push("/reservations");
            })
            .catch((err) => console.log(err.message));
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
            <Route path="/reservations/new">
                <Reservations submitHandler={createReservationHandler} />
            </Route>
            <Route path="/dashboard">
                <Dashboard date={today()} />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

export default Routes;
