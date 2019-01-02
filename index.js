const http = require('http');
const agent = new http.Agent({keepAlive: true});

exports.getArrivalDataForDay = (req, res) => {
    // res.status(200).send(`Hello ${req.body.trainNumber} ${req.body.date}!`);

    const returnData = (viaResponse) => {
        res.status(200).send(viaResponse);
    };

    http.get({
        host: 'reservia.viarail.ca',
        port: 80,
        path: `/tsi/GetTrainStatus.aspx?l=en&TsiCCode=VIA&TsiTrainNumber=${req.body.trainNumber}&DepartureDate=${req.body.tripDate}&ArrivalDate=${req.body.tripDate}&TrainInstanceDate=${req.body.tripDate}`,
        agent: agent
    }, (viaRes) => {
        const statusCode = viaRes.statusCode;
        const contentType = viaRes.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.log(error.message);
            // consume response data to free up memory
            viaRes.resume();
            return;
        }

        viaRes.setEncoding('utf8');
        let rawData = '';
        viaRes.on('data', (chunk) => rawData += chunk);
        viaRes.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                returnData(parsedData);
            } catch (e) {
                console.log(e.message);
            }
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });

};
