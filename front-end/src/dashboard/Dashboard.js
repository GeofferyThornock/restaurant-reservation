import React, { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import ReservationList from "./reservationList";
import { listReservations, listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import TablesList from "./tablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ defaultDate }) {
    const query = useQuery();

    const [reservations, setReservations] = useState([]);
    const [tables, setTables] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [date, setDate] = useState(defaultDate);

    useEffect(() => {
        const dateCheck = query.get("date");
        if (dateCheck) {
            setDate(dateCheck);
        } else {
            setDate(defaultDate);
        }
    }, [query, defaultDate]);

    useEffect(loadDashboard, [date]);

    function loadDashboard() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ date }, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setReservationsError);
        return () => abortController.abort();
    }

    const finishHandler = (data) => {
        const abortController = new AbortController();

        finishTable(data, abortController.signal)
            .then(loadDashboard)
            .catch(setReservationsError);

        return () => abortController.abort();
    };

    return (
        <main>
            <h1>Dashboard</h1>
            <div className="d-md-flex mb-3">
                <h4 className="mb-0">Reservations for date</h4>
            </div>
            <ErrorAlert error={reservationsError} />
            <div className="d-md-flex m-2">
                {reservations &&
                    // eslint-disable-next-line array-callback-return
                    reservations.map((e) => {
                        if (e.status !== "finished") {
                            return (
                                <ReservationList
                                    reservation={e}
                                    key={e.reservation_id}
                                    reloadHandler={loadDashboard}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
            </div>
            <div className="p-2 d-flex flex-xl-nowrap flex-wrap">
                {tables &&
                    tables.map((e) => (
                        <TablesList
                            table={e}
                            key={e.table_id}
                            finishHandler={finishHandler}
                        />
                    ))}
            </div>
        </main>
    );
}

export default Dashboard;
