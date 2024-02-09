
function loadHeroSkills() {
    return new Promise(function (resolve) {
        function fetchHeroSkills() {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: '/wod/spiel/hero/skills.php',
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr, status, error) {
                        reject(new Error("Failed to fetch hero skills"));
                    }
                });
            });
        }
        fetchHeroSkills()
            .then(function (data) {
                resolve(parseHeroSkills(data));
            })
            .catch(function (error) {
                console.error("Error fetching hero skills", error);
            });
    });
}

function parseHeroSkills(data) {
    const jq = $(data);
    const skillsTable = jq.find('table[class=content_table]').first();
    if (!skillsTable.length) {
        console.error('NOPE.', skillsTable);
        return;
    }

    const skillRows = $(skillsTable).find('tr[class^=row]')
    const rawRows = skillRows
        .map(function () {
            const cells = $(this).find('>td ');
            const skillName = cells.eq(1).text().trim();
            const valueCell = cells.eq(2).text().replace(/[\t\n ]/g, '').trim();

            var deltaStr = cells.eq(1)
                .first()
                .find('>a')
                .first()
                .attr('onmouseover');

            const skillDelta = splitStringIntoArray(extractHTMLFromScript(deltaStr));
            function extractHTMLFromScript(scriptContent) {
                // Use a regular expression to extract the HTML content
                var match = /return wodToolTip\(this,\'(.*?)\'\);/.exec(scriptContent);

                if (match && match[1]) {
                    var tmp = $(match[1]).html();
                    return tmp;
                } else {
                    return null; // No match found
                }
            }


            function splitStringIntoArray(inputString) {
                if (inputString == null) return [];
                // Split the input string into an array based on "<br>"
                var items = inputString.split('<br>');

                // Create an array of objects with the specified structure
                var resultArray = items.map(function (item) {
                    var match = /([^<]+)\s\(([-+]?\d+)\)/.exec(item);
                    if (match && match[1] && match[2]) {
                        return { factor: match[1].trim(), dat: parseInt(match[2]) };
                    } else {
                        return null;
                    }
                }).filter(Boolean); // Filter out null values

                return resultArray;
            }



            return { skillName, valueCell, skillDelta };
        })
        .toArray();
    const retVal = {};
    rawRows.forEach(function (x) {
        retVal[x.skillName] = {type:'skill', value:x.valueCell, valueDelta: x.skillDelta};
    });
    return retVal;
}
