
# Restaurant Reservation System

A fullstack app for a restaurant business to track and manage tables, reservations and booking

#### DEPLOYED AT: https://restaurant-front-end-621t.onrender.com/dashboard
## Screenshots

#### Dashboard Page

![App Screenshot](https://i.imgur.com/dhUUm4h.png)

#
#### Create/Edit Reservation

![App Screenshot](https://i.imgur.com/hCRHcxX.png)

#
#### Search Reservations

![App Screenshot](https://i.imgur.com/f3LGSpp.png)

#
#### Create Table

![App Screenshot](https://i.imgur.com/42yWC9R.png)
## API Reference

### Get Reservations By Date

```http
  GET /reservations?date=YYYY-DD-MM
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `date`      | `query` | **Required**. Date of items to fetch |  

Response should be

```
{
  "data": [
    {
        "first_name": "Tiger",
        "last_name": "Lion",
        "mobile_number": "808-555-0140",
        "reservation_date": "YYYY-DD-MM",
        "reservation_time": "18:00",
        "people": 3,
        "created_at": "2020-12-10T08:31:32.326Z",
        "updated_at": "2020-12-10T08:31:32.326Z"
    },
    //...
  ]
}
```

### Get Reservation

```http
  GET /reservations/:reservation_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

Fetches a single reservation object based on its id

```
{
  "data": {
        "first_name": "Tiger",
        "last_name": "Lion",
        "mobile_number": "808-555-0140",
        "reservation_date": "YYYY-DD-MM",
        "reservation_time": "18:00",
        "people": 3,
        "created_at": "2020-12-10T08:31:32.326Z",
        "updated_at": "2020-12-10T08:31:32.326Z"
    }
}
```

### Create a Reservation 


```http
POST /reservations
```
| Parameter          | Type     | Description  |
| :---------------   | :------- | :----------- |
| `first_name`       | `string` | **Required** |
| `last_name`        | `string` | **Required** |
| `mobile_number`    | `string` | **Required** |
| `reservation_date` | `string` | **Required** |
| `reservation_time` | `string` | **Required** |
| `people`           | `number` | **Required** |

The response from the server should look like the following.
```
{
  "data": {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people.
  }
}
```

### Update Reservation
This route will update a reservation based on an id

```html
PUT /reservations/:reservation_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

The server should respond with updated content

```
{
  "data": {
      updated first_name,
      updated last_name,
      updated mobile_number,
      updated reservation_date,
      updated reservation_time,
      updated people.
  }
}
```

### Update Reservation Status

This route will allow you to update a specific reservations status

```html
UPDATE /reservation/:reservation_id
```

| Options    |
| :--------  |
| `booked`   |
| `seated`   |
| `finished` |
| `cancelled`|
 
A body like the following should be passed along with the request:

```
{
  status: "seated"
}
```
The response should include the entire reservation with the newly updated status
```
{
  "data": {
        "first_name": "Tiger",
        "last_name": "Lion",
        "mobile_number": "808-555-0140",
        "reservation_date": "YYYY-DD-MM",
        "reservation_time": "18:00",
        "people": 3,
        "status": ..."seated",
        "created_at": "2020-12-10T08:31:32.326Z",
        "updated_at": "2020-12-10T08:31:32.326Z"
    }
}
```

### Get Tables

Gets a list of all Tables

```html
GET /tables
```

response from the server should be

```
{
    "data": { 
        table_name: "Bar #1", 
        capacity: 1 
    }
}
```

### Create Table

Creates a new table

```html
POST /tables
```

a body like the following should be passed
```
{
    "data": {
        table_name: string,
        capacity: number,
    }
}
```

response from the server should be the newly created object

```
{
    table_name: string,
    capacity: number,
}
```

### Updates a Tables Status

Updates a tables status to be Occupied and sets the corrosponding reservation to be "seated"

```html
PUT /tables/:table_id/seat
```

should include a body with the following

```
{
    "data": {
        reservation_id: "number"
    }
}
```

response from the server should be the newly updated object

```
{
    "data": {
        table_name: "string",
        capacity: "number",
        reservation_id: "number"
    }
}
```

### Updates a Table and Reservation

Updates a table to be free and updates the reservation to be finished

```html
DELETE /tables/:table_id/seat
```

returns the newly empty table

```
{
    "data": {
        table_name: "string",
        capacity: "number",
        reservation_id: null,
    }
}
