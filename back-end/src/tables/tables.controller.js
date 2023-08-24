const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundry");

const VALID_PROPERTIES = ["table_name", "capacity"];

function validator(field) {
    return function (req, res, next) {
        if (req.body.data && req.body.data[field]) {
            next();
        } else {
            next({
                status: 400,
                message: `Request body must include ${field}`,
            });
        }
    };
}

function tableNameLength(req, res, next) {
    if (req.body.data) {
        const { table_name } = req.body.data;
        if (table_name.length >= 2) {
            next();
        } else {
            next({
                status: 400,
                message: `table_name must be longer than 1 character`,
            });
        }
    }
}

function numberCheck(req, res, next) {
    if (req.body.data) {
        const { capacity } = req.body.data;
        if (typeof capacity !== "number") {
            next({
                status: 400,
                message: `capacity must be a number`,
            });
        }
        next();
    }
}

async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    const response = await reservationService.read(reservation_id);
    if (response) {
        res.locals.reservation = response;
        next();
    } else {
        next({
            status: 404,
            message: `${reservation_id} not found`,
        });
    }
}

async function tableExists(req, res, next) {
    const { table_id } = req.params;
    const response = await service.read(table_id);
    if (response) {
        res.locals.table = response;
        next();
    } else {
        next({
            status: 404,
            message: `${table_id} not found`,
        });
    }
}

function tableCapacity(req, res, next) {
    const reservation = res.locals.reservation;
    const table = res.locals.table;
    if (reservation.people <= table.capacity) {
        next();
    } else {
        next({
            status: 400,
            message: "not a big enough capacity",
        });
    }
}

function tableOccupied(req, res, next) {
    const table = res.locals.table;
    if (table.reservation_id) {
        next({
            status: 400,
            message: "table is occupied",
        });
    }

    next();
}

function tableNotOccupied(req, res, next) {
    const table = res.locals.table;
    if (!table.reservation_id) {
        next({
            status: 400,
            message: `${table.table_id} is not occupied`,
        });
    } else {
        next();
    }
}
function statusNotSeated(req, res, next) {
    const { status, reservation_id } = res.locals.reservation;

    if (status === "seated") {
        next({
            status: 400,
            message: `${reservation_id} is already seated`,
        });
    }
    next();
}

/****
 *
 *
 * END OF ERROR HANDLERS
 *
 *
 */

async function list(req, res) {
    const response = await service.list();
    const sorted = response.sort((a, b) => {
        const nameA = a.table_name;
        const nameB = b.table_name;
        return nameA - nameB;
    });
    res.json({ data: sorted });
}

async function create(req, res, next) {
    const { table_name, capacity } = req.body.data;
    const newTable = {
        table_name,
        capacity,
    };
    if (req.body.data.reservation_id) {
        newTable.reservation_id = req.body.data.reservation_id;
    }

    const response = await service.create(newTable);
    res.status(201).json({ data: response });
}

async function update(req, res, next) {
    const { reservation_id } = req.body.data;
    const { table_id } = req.params;
    const id = Number(table_id);
    const resId = Number(reservation_id);

    const updated = await reservationService.update(reservation_id, "seated");
    const response = await service.update(id, resId);

    res.json({ data: response });
}

async function read(req, res) {
    const { table_id } = req.params;
    const response = await service.read(table_id);
    res.json({ data: response });
}

async function finish(req, res) {
    const { reservation_id } = res.locals.table;
    const { table_id } = req.params;
    const updated = await reservationService.update(reservation_id, "finished");
    const table = await service.update(table_id, null);
    res.json({ data: table });
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [
        ...VALID_PROPERTIES.map(validator),
        tableNameLength,
        numberCheck,
        asyncErrorBoundary(create),
    ],
    update: [
        ["reservation_id"].map(validator),
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableExists),
        tableCapacity,
        tableOccupied,
        statusNotSeated,
        asyncErrorBoundary(update),
    ],
    finish: [
        asyncErrorBoundary(tableExists),
        tableNotOccupied,
        asyncErrorBoundary(finish),
    ],
};
