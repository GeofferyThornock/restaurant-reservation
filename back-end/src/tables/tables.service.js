const knex = require("../db/connection");

function list() {
    return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then((e) => e[0]);
}

function update(id, reservationId) {
    return knex("tables")
        .select("*")
        .where({ table_id: id })
        .update({ reservation_id: reservationId })
        .returning("*")
        .then((e) => e[0]);
}

function read(id) {
    return knex("tables")
        .select("*")
        .where({ table_id: id })
        .then((e) => e[0]);
}

module.exports = {
    create,
    list,
    update,
    read,
};
