import React from "react";

export default function TablesList({ table, finishHandler }) {
    const { table_name, capacity, reservation_id } = table;

    const btnHandler = (e) => {
        e.preventDefault();
        const confirmation = window.confirm(
            "Is this table ready to seat new guests? This cannot be undone."
        );
        if (confirmation) {
            finishHandler({ table_id: table.table_id, reservation_id });
        }
    };

    return (
        <div className="m-2 p-3 pt-4 bg-info rounded text-light text-center">
            <p className="mr-auto">Table Name: {table_name}</p>

            <p className="mr-auto">Capacity: {capacity}</p>

            {reservation_id && <p>{reservation_id}</p>}

            {reservation_id ? (
                <div>
                    <p
                        data-table-id-status={table.table_id}
                        className="text-danger"
                    >
                        Occupied
                    </p>
                    <button
                        className="btn btn-danger"
                        data-table-id-finish={table.table_id}
                        onClick={btnHandler}
                    >
                        Finish
                    </button>
                </div>
            ) : (
                <p
                    data-table-id-status={table.table_id}
                    className="text-warning"
                >
                    Free
                </p>
            )}
        </div>
    );
}
