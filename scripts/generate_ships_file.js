const fs = require('fs');
const axios = require('axios');

const URL = 'https://robertsspaceindustries.com/ship-matrix/index'
const fields = {
    'name': 'name',
    'url': 'url',
    'thumbnail': 'media.0.images.heap_infobox'
};

axios.get(URL)
    .then((response) => {

        const processedShips = [];

        const axios_promises = [];
        const missing_shipyard_links = [];

        let parsedBody = response.data;

        if(parsedBody.success === 1) {
            let ships = parsedBody.data;

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

                    // --- handle the external fleetyard link
                    if(key === 'url') {
                        let exploded = current.split('/');
                        let ship_name =  exploded[exploded.length - 1].toLowerCase();

                        let fleetyard_api_url = ('https://api.fleetyards.net/v1/models/' + ship_name);

                        axios_promises.push(axios.get(fleetyard_api_url).then(function (response) {
                            data['fleetyard'] = ('https://fleetyards.net/ships/' + response.data.slug);
                        })
                        .catch(function (error) {
                            missing_shipyard_links.push(i);
                        }));
                    }
                }

                processedShips.push(data);
            }

            // --- wait for all fleetyards request to be resolved
            Promise.all(axios_promises).then(responses => {
                console.log("Fetched %d ships and vehicles", processedShips.length);
                console.log("%d missing fleetyard links", missing_shipyard_links.length);
    
    
                // TODO: Handle missing links e.g. some special edition ships do not have their own page on fleetyard... 
                // if(missing_shipyard_links.length > 0) {
                //     missing_shipyard_links.forEach(ship_id => {
                //         
                //     });
                // }
                
                const content = 'var HangarXPLOR = HangarXPLOR || {};'
                            + '\n\n' 
                            + 'HangarXPLOR._ships = ' + JSON.stringify(processedShips, null, '\t');
                fs.writeFile('src/web_resources/HangarXPLOR.Ships.js', content, "utf-8", function (error) {
                    if (error) {
                        console.error("Failed to write the 'HangarXPLOR.Ships.js' file", error);
                    };
                    console.log("Successfully created the 'HangarXPLOR.Ships.js' file");
                });
    
            });
            

            
        }
    })
    .catch(error => {
        if(error) {
            console.log(error);
            return;
        }
        if(error.response.status !== 200) {
            console.error("Failed to fetch the ship matrix because it returned a non 200 status code. Status code: ", error.response.status);
            return;
        }

        console.log("Failed because an error occured: ", error);
    });