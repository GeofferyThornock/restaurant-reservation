const asyncErrorBoundary = require("../errors/asyncErrorBoundry");
const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */

async function reservationExists(req, res, next) {
    const { reservation_id } = req.params;
    const reservation = await service.read(reservation_id);
    if (reservation) {
        res.locals.reservation = reservation;
        next();
    } else {
        next({
            status: 404,
            message: `${reservation_id} does not exist`,
        });
    }
}

const VALID_PROPERTIES = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
];

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

function dateValidation(req, res, next) {
    const { reservation_date, reservation_time } = req.body.data;
    const time = reservation_time.split(":");
    const day = reservation_date.split("-");
    const date = new Date(Date.parse(reservation_date));
    date.setHours(time[0], time[1]);
    date.setDate(Number(day[2]));
    const todayDate = new Date();

    if (date.getUTCDay() === 2) {
        next({
            status: 400,
            message: `restaurant is closed`,
        });
    }
    if (date.toJSON() < todayDate.toJSON()) {
        next({
            status: 400,
            message: `date needs to be in the future`,
        });
    }

    if (date.toString() !== "Invalid Date") {
        next();
    } else {
        next({
            status: 400,
            message: `Current reservation_date is invalid`,
        });
    }
}

function numberValidation(req, res, next) {
    const { people } = req.body.data;
    if (typeof people === "number") {
        next();
    } else {
        next({
            status: 400,
            message: `Current people is invalid`,
        });
    }
}

function timeValidation(req, res, next) {
    const { reservation_time } = req.body.data;
    if (reservation_time.toString() !== "not-a-time") {
        next();
    } else {
        next({
            status: 400,
            message: `Current reservation_time is invalid`,
        });
    }
}

function stateValidation(req, res, next) {
    if (req.body.data.status) {
        const { status } = req.body.data;
        if (status !== "booked") {
            next({
                status: 400,
                message: "status cannot be seated or finished",
            });
        }
        next();
    } else {
        next();
    }
}

function finishValidation(req, res, next) {
    const reservation = res.locals.reservation;
    if (reservation.status === "finished") {
        next({
            status: 400,
            message: "finished reservation cannot be updated",
        });
    }
    next();
}

function updateStatus(req, res, next) {
    if (req.body.data.status) {
        if (req.body.data.status === "unknown") {
            next({
                status: 400,
                message: "reservation status cannot be unknown",
            });
        }
        next();
    }
}

/* 


END OF VALIDATORS 


*/

async function list(req, res) {
    if (req.query.mobile_number) {
        const mobile_number = JSON.stringify(req.query.mobile_number);
        console.log("MOBILE", mobile_number);
        const response = await service.search(mobile_number);
        res.json({ data: response });
    } else {
        const date = JSON.stringify(req.query.date);
        const data = await service.list(date);
        const sortedData = data.sort((elementA, elementB) => {
            const timeA = new Date(`1970-01-01T${elementA.reservation_time}`);
            const timeB = new Date(`1970-01-01T${elementB.reservation_time}`);
            return timeA - timeB;
        });
        res.json({ data: sortedData });
    }
}

async function create(req, res) {
    const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
    } = req.body.data;

    let newReservation = {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        status: "booked",
        people,
    };

    const data = await service.create(newReservation);

    res.status(201).json({ data });
}

async function update(req, res) {
    const { status } = req.body.data;
    const { reservation_id } = res.locals.reservation;
    console.log(status, reservation_id);
    const response = await service.update(reservation_id, status);
    res.json({ data: response });
}

async function read(req, res) {
    const { reservation_id } = req.params;
    const response = await service.read(reservation_id);
    res.json({ data: response });
}

module.exports = {
    list,
    create: [
        ...VALID_PROPERTIES.map(validator),
        dateValidation,
        numberValidation,
        timeValidation,
        stateValidation,
        create,
    ],
    read,
    update: [
        asyncErrorBoundary(reservationExists),
        updateStatus,
        finishValidation,
        update,
    ],
};
