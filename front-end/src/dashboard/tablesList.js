import React from "react";

export default function TablesList({ tables }) {
    const { table_name, capacity, reservation_id } = tables;
    return (
        <div className="m-2 p-3 pt-4 bg-info rounded text-light text-center">
            <p className="mr-auto">Table Name: {table_name}</p>

            <p className="mr-auto">Capacity: {capacity}</p>

            {reservation_id ? (
                <p
                    data-table-id-status={tables.table_id}
                    className="text-danger"
                >
                    Occupied
                </p>
            ) : (
                <p
                    data-table-id-status={tables.table_id}
                    className="text-warning"
                >
                    Free
                </p>
            )}
        </div>
    );
}
