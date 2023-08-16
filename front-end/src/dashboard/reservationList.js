import React from "react";

export default function ReservationList({ reservation }) {
    const {
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
        </div>
    );
}
