const fetch = require('node-fetch');

exports.getArrivalDataForDay = async (req, res) => {
    // res.status(200).send(`Hello ${req.body.trainNumber} ${req.body.date}!`);

    const viaResult = await fetch(`http://reservia.viarail.ca/tsi/GetTrainStatus.aspx?l=en&TsiCCode=VIA&TsiTrainNumber=${req.body.trainNumber}&DepartureDate=${req.body.tripDate}&ArrivalDate=${req.body.tripDate}&TrainInstanceDate=${req.body.tripDate}`);

    console.log(req.body.trainNumber);
    console.log(req.body.tripDate);
    console.log(viaResult);

    const resJson = {
        status: viaResult.status,
        statusText: viaResult.statusText,
        url: viaResult.url,
        body: viaResult.text()
    };

    res.json(resJson);
};
