
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
            return { skillName, valueCell };
        })
        .toArray();
    const retVal = {};
    rawRows.forEach(function (x) {
        retVal[x.skillName] = x.valueCell;
    });
    return retVal;
}
