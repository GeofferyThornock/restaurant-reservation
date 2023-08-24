import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { findReservation, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Seating({ submitHandler }) {
    const [tables, setTables] = useState([]);
    const [reservation, setReservation] = useState({});
    const [option, setOption] = useState({});
    const [error, setError] = useState(null);
    const { reservation_id } = useParams();

    useEffect(() => {
        const abortController = new AbortController();
        listTables(abortController.signal).then((e) => {
            setTables(e);
            setOption(e[0].table_id);
        });
        findReservation(reservation_id, abortController.signal).then(
            setReservation
        );
        return () => abortController.abort();
    }, [reservation_id]);

    const submitSeatingHandler = (e) => {
        e.preventDefault();

        if (reservation.capacity < option.capacity) {
            setError({ message: "cannot seat here" });
            return;
        } else {
            submitHandler({
                option,
                reservation_id,
                status: "seated",
            });
        }
    };

    return (
        <div className="form-group mt-3">
            {error && <ErrorAlert error={error} />}
            <select
                name="table_id"
                className="form-control"
                value={option}
                onChange={(e) => setOption(e.target.value)}
            >
                {tables.map((e) => (
                    <option value={e.table_id} key={e.table_id}>
                        {e.table_name} - {e.capacity}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                className="btn btn-primary mt-2 btn-block"
                onClick={submitSeatingHandler}
            >
                Submit
            </button>
        </div>
    );
}
