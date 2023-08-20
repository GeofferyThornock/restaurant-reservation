const knex = require("../db/connection");

function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .whereNot({ status: "finished" });
}

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then((e) => e[0]);
}

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .then((e) => e[0]);
}

function update(id, status) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: id })
        .update({ status: status })
        .returning("*")
        .then((e) => e[0]);
}

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

module.exports = {
    list,
    create,
    read,
    update,
    search,
};
