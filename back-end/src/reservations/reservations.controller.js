const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */

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
    const { reservation_date } = req.body.data;
    const date = new Date(reservation_date);
    const todayDate = new Date();
    console.log(date, todayDate);

    if (date.getUTCDay() === 2) {
        next({
            status: 400,
            message: `restaurant is closed`,
        });
    }

    if (date < todayDate) {
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

/* 


END OF VALIDATORS 


*/

async function list(req, res) {
    const date = JSON.stringify(req.query.date);
    const data = await service.list(date);
    const sortedData = data.sort((elementA, elementB) => {
        const timeA = new Date(`1970-01-01T${elementA.reservation_time}`);
        const timeB = new Date(`1970-01-01T${elementB.reservation_time}`);
        return timeA - timeB;
    });
    res.json({ data: sortedData });
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
        people,
    };

    const data = await service.create(newReservation);

    res.status(201).json({ data });
}

module.exports = {
    list,
    create: [
        ...VALID_PROPERTIES.map(validator),
        dateValidation,
        numberValidation,
        timeValidation,
        create,
    ],
};
