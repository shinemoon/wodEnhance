
function loadHeroGear() {
    return new Promise(function (resolve) {
        function fetchHeroGear() {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: '/wod/spiel/hero/items.php?view=gear',
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr, status, error) {
                        reject(new Error("Failed to fetch hero gear"));
                    }
                });
            });
        }
        fetchHeroGear()
            .then(function (data) {
                resolve(parseHeroGear(data));
            })
            .catch(function (error) {
                console.error("Error fetching hero gear", error);
            });
    });
}

function parseHeroGear(data) {
    const jq = $(data);
    const gearTables = jq.find('#main_content form[name=the_form]>table:first table');
    if (!gearTables.length) {
        console.error('NOPE.', gearTables);
        return;
    }

    var equipTable = gearTables.eq(0);
    var medalTable = gearTables.eq(2);
    var bucketTable = gearTables.eq(4);
    var ringTable = gearTables.eq(6);

    const equipRows = $(equipTable).find('tr')
    const equipRawRows = equipRows
        .map(function () {
            const cells = $(this).find('>td ');
            const equipPos = cells.eq(0).text().trim();
            const equipName = cells.eq(1).find('option[selected=selected]').text().trim();
            let equipId = cells.eq(1).find('input[type="hidden"]').last().attr('value');
            return { equipName, equipPos , equipId};
        })
        .toArray();

    const medalRows = $(medalTable).find('tr')
    const medalRawRows = medalRows
        .map(function () {
            const cells = $(this).find('>td ');
            const medalPos = cells.eq(0).text().trim();
            const medalName = cells.eq(1).find('option[selected=selected]').text().trim();
            let equipId = cells.eq(1).find('input[type="hidden"]').last().attr('value');
            return { medalName, medalPos , equipId};
        })
        .toArray();


    const bucketRows = $(bucketTable).find('tr')
    const bucketRawRows = bucketRows
        .map(function () {
            const cells = $(this).find('>td ');
            const bucketPos = cells.eq(0).text().trim();
            const bucketName = cells.eq(1).find('option[selected=selected]').text().trim();
            let equipId= cells.eq(1).find('input[type="hidden"]').last().attr('value');
            return { bucketName, bucketPos, equipId};
        })
        .toArray();

    const ringRows = $(ringTable).find('tr')
    const ringRawRows = ringRows
        .map(function () {
            const cells = $(this).find('>td ');
            const ringPos = cells.eq(0).text().trim();
            const ringName = cells.eq(1).find('option[selected=selected]').text().trim();
            let equipId = cells.eq(1).find('input[type="hidden"]').last().attr('value');

            //Promise needed


            return { ringName, ringPos, equipId};
        })
        .toArray();


    const retVal = [];
    retVal.push(equipRawRows, medalRawRows, bucketRawRows, ringRawRows);
    return retVal;
}

