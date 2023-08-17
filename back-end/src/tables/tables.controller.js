const service = require("./tables.service");

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

    const response = await service.create(newTable);
    console.log(response);
    res.json({ data: response });
}

async function update(req, res, next) {
    const { option, reservationId } = req.body.data;
    const id = Number(option);
    const resId = Number(reservationId);
    console.log(option, reservationId);

    const response = await service.update(id, resId);

    res.json({ data: response });
}

module.exports = {
    list,
    create: [...VALID_PROPERTIES.map(validator), create],
    update,
};
