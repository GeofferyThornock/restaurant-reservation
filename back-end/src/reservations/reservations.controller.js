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
    const date = new Date(reservation_date);
    date.setFullYear(Number(day[0]));
    date.setDate(Number(day[2]));
    date.setMonth(Number(day[1]) - 1);

    date.setHours(time[0], time[1]);
    const todayDate = new Date();
    console.log(date.getDay(), Number(day[2]), date);

    if (date.toJSON() < todayDate.toJSON()) {
        next({
            status: 400,
            message: `date needs to be in the future`,
        });
    }
    if (date.getDay() === 2) {
        next({
            status: 400,
            message: `restaurant is closed`,
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
    console.log(reservation_time);
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

function validateTime(req, res, next) {
    const time = req.body.data.reservation_time;
    const selectedTime = new Date(`1970-01-01T${time}`);
    const earliestTime = new Date(`1970-01-01T10:30:00`);
    const latestTime = new Date(`1970-01-01T21:30:00`);

    if (selectedTime < earliestTime || selectedTime > latestTime) {
        return next({
            status: 400,
            message: "Please choose a time within business hours.",
        });
    } else {
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

    console.log(data);

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

async function updateReservation(req, res) {
    const updatedReservation = {
        ...res.locals.reservation,
        ...req.body.data,
        reservation_id: res.locals.reservation.reservation_id,
    };
    const data = await service.updateReservation(updatedReservation);
    res.json({ data });
}

module.exports = {
    list,
    create: [
        ...VALID_PROPERTIES.map(validator),
        validateTime,
        timeValidation,
        dateValidation,
        numberValidation,
        stateValidation,
        create,
    ],
    read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
    update: [
        asyncErrorBoundary(reservationExists),
        updateStatus,
        finishValidation,
        update,
    ],
    updateReservation: [
        ...VALID_PROPERTIES.map(validator),
        asyncErrorBoundary(reservationExists),
        timeValidation,
        dateValidation,
        numberValidation,
        stateValidation,
        updateReservation,
    ],
};
