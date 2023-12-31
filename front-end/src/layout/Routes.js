import React from "react";
import { createTable, assign } from "../utils/api";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateTables from "../tables/CreateTables";
import Seating from "../reservation/Seating";
import Search from "../search/Search";
import EditReservation from "../reservation/EditReservation";
import CreateReservation from "../reservation/CreateReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
    const history = useHistory();

    const createTableHandler = (data) => {
        const abortController = new AbortController();

        createTable(data, abortController.signal)
            .then((e) => {
                history.push(`/dashboard`);
            })
            .catch();

        return () => abortController.abort();
    };

    const assignSeat = (data) => {
        const abortController = new AbortController();

        assign(data, abortController.signal)
            .then((e) => {
                history.push(`/dashboard`);
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
            <Route exact={true} path="/reservations/new">
                <CreateReservation date={today()} />
            </Route>
            <Route exact={true} path="/reservations/:reservation_id/edit">
                <EditReservation date={today()} />
            </Route>
            <Route exact={true} path="/reservations/:reservation_id/seat">
                <Seating submitHandler={assignSeat} />
            </Route>
            <Route exact={true} path="/search">
                <Search />
            </Route>
            <Route exact={true} path="/tables/new">
                <CreateTables submitHandler={createTableHandler} />
            </Route>
            <Route path="/dashboard">
                <Dashboard defaultDate={today()} />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

export default Routes;
