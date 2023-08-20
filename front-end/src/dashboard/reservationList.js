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
        status,
        people,
    } = reservation;
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
        </div>
    );
}
