import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function ReservationList({ reservation }) {
    const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
    } = reservation;
    return (
        <div className="m-2 p-3 pt-4 text-center bg-dark rounded text-light">
            <p>First Name: {first_name}</p>

            <p>Last Name: {last_name}</p>

            <p>Mobile Number: {mobile_number}</p>

            <p>Reservation Date: {reservation_date}</p>

            <p>Reservation Time: {reservation_time}</p>

            <p>Party Size: {people}</p>

            <Link
                to={`/reservations/${reservation_id}/seat`}
                className="btn btn-primary px-5"
            >
                Seat
            </Link>
        </div>
    );
}
