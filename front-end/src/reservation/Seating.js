import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { listTables } from "../utils/api";

export default function Seating({ submitHandler }) {
    const [tables, setTables] = useState([]);
    const [option, setOption] = useState(null);
    const { reservationId } = useParams();

    useEffect(() => {
        const abortController = new AbortController();
        listTables(abortController.signal).then(setTables);
        return () => abortController.abort();
    }, [reservationId]);

    const submitSeatingHandler = (e) => {
        e.preventDefault();
        console.log({ option, reservationId });

        submitHandler({ option, reservationId });
    };

    return (
        <div className="form-group mt-3">
            <select
                name="table_id"
                className="form-control"
                value={option}
                onChange={(e) => setOption(e.target.value)}
            >
                {tables.map((e) => (
                    <option value={e.table_id}>
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
