const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
    const response = await service.list(req.query.date);
    console.log(response);
    res.json({ data: response });
}

async function create(req, res) {
    console.log(req.body);
    const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
    } = req.body;

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
    create,
};
