import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { changeStatus } from "../utils/api";

export default function ReservationList({ reservation, reloadHandler }) {
    const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        status,
        people,
    } = reservation;

    const cancelHandler = (e) => {
        const confirmation = window.confirm(
            "Do you want to cancel this reservation? This cannot be undone."
        );
        if (confirmation) {
            changeStatus({ status: "cancelled", reservation_id }).then(
                reloadHandler
            );
        }
    };

    return (
        <div className="m-2 p-3 pt-4 text-center bg-dark rounded text-light">
            <div>
                <p>First Name: {first_name}</p>

                <p>Last Name: {last_name}</p>

                <p>Mobile Number: {mobile_number}</p>

                <p>Reservation Date: {reservation_date}</p>

                <p>Reservation Time: {reservation_time}</p>

                <p data-reservation-id-status={reservation.reservation_id}>
                    Status: {status}
                </p>

                <p>Party Size: {people}</p>
                {status === "booked" ? (
                    <Link
                        to={`/reservations/${reservation_id}/seat`}
                        className="btn btn-primary px-5"
                    >
                        Seat
                    </Link>
                ) : null}
            </div>
            <Link
                to={`/reservations/${reservation_id}/edit`}
                className="btn btn-warning px-4 mx-2 mt-1"
            >
                Edit
            </Link>
            <button
                data-reservation-id-cancel={reservation.reservation_id}
                onClick={cancelHandler}
                className="btn btn-danger px-4  mt-1"
            >
                Cancel
            </button>
        </div>
    );
}
