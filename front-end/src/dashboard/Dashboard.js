import React, { useEffect, useState } from "react";
import ReservationList from "./reservationList";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);

    useEffect(loadDashboard, [date]);

    function loadDashboard() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ date }, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError);
        return () => abortController.abort();
    }

    return (
        <main>
            <h1>Dashboard</h1>
            <div className="d-md-flex mb-3">
                <h4 className="mb-0">Reservations for date</h4>
            </div>
            <ErrorAlert error={reservationsError} />
            <div className="d-md-flex m-2">
                {reservations &&
                    reservations.map((e) => (
                        <ReservationList reservation={e} />
                    ))}
            </div>
        </main>
    );
}

export default Dashboard;
