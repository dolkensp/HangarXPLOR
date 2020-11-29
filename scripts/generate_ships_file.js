let fs = require('fs');
let request = require('request');

const url = 'https://robertsspaceindustries.com/ship-matrix/index';
const fields = {
    'name': 'name',
    'url': 'url',
    'thumbnail': 'media.0.images.heap_infobox'
};

request(url, function(error, response, body) {

    if(error) {
        console.log("Failed because an error occured: ", error);
        return;
    }

    if(response.statusCode !== 200) {
        console.error("Failed to fetch the ship matrix because it returned a non 200 status code. Status code: ", response.statusCode);
        return;
    }

    let parsedBody = JSON.parse(body);

    if(parsedBody.success === 1) {
        let ships = parsedBody.data;

        let processedShips = [];
        for(let i = 0; i < ships.length; i++) {
            let ship = ships[i];
            let data = {};

            for (let key in fields) {
                let path = fields[key].split('.');
                let current = ship;
                for (let j = 0; j < path.length; j++) {
                    current = current[path[j]];
                }
                data[key] = current;
            }

            processedShips.push(data);
        }
        console.log("Fetched %d ships and vehicles", processedShips.length);
        
        const content = 'var HangarXPLOR = HangarXPLOR || {};'
                    + '\n\n' 
                    + 'HangarXPLOR._ships = ' + JSON.stringify(processedShips, null, '\t');
        fs.writeFile('src/web_resources/HangarXPLOR.Ships.js', content, "utf-8", function (error) {
            if (error) {
                console.error("Failed to write the 'HangarXPLOR.Ships.js' file", error);
            };
            console.log("Successfully created the 'HangarXPLOR.Ships.js' file");
          });
    }

});