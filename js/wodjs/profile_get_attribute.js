function loadLocalHeroAttributes() {
    return new Promise(function (resolve) {
        function fetchHeroAttributes() {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: '/wod/spiel/hero/attributes.php',
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (xhr, status, error) {
                        reject(new Error("Failed to fetch hero attributes"));
                    }
                });
            });
        }
        fetchHeroAttributes()
            .then(function (data) {
                resolve(parseLocalHeroAttributes(data));
            })
            .catch(function (error) {
                console.error("Error fetching hero attributes", error);
            });
    });
}

function parseLocalHeroAttributes(data) {
    const jq = $(data);
    var attributesTable = jq.find('table[class=content_table]').first();
    if (!attributesTable.length) {
        console.error('NOPE.', attributesTable);
        return;
    }
    var attributeRows = $(attributesTable).find('tr[class^=row]')
    const rawRows = attributeRows
        .map(function () {
            const cells = $(this).find('> td');
            const attributeName = cells
                .first()
                .text()
                .trim();
            const valueCell = cells
                .find(':nth-child(2)')
                .contents()
                .filter(function () {
                    return this.nodeType == 3;
                })
                .text()
                .trim();
            const effectiveValueCell = cells
                .find(':nth-child(2) > span[class=effective_value]')
                .text()
                .trim()
                .replace(/\D/g, '');
            return { attributeName, valueCell, effectiveValueCell };
        })
        .toArray();
    const retVal = {};
    rawRows.forEach(function (x) {
        retVal[x.attributeName] = {type:'attr',value:x.effectiveValueCell.length > 0 ? x.valueCell + "[" + x.effectiveValueCell + "]" : Number(x.valueCell)};
    });


    // Table II
    attributesTable = jq.find('table[class=content_table]').eq(1);
    attributeRows = $(attributesTable).find('tr[class^=row]')
    // hp
    retVal["体力"] = {type:'attrII', value:attributeRows.eq(4).find('>td').eq(1).text().trim().replace(/[\n ]/g, '')};
    // hp-recover
    retVal["体力恢复"] = {type:'attrII', value:attributeRows.eq(4).find('>td').eq(2).find('.effective_value').text().trim()};
    // mp
    retVal["法力"] = {type:'attrII', value:attributeRows.eq(5).find('>td').eq(1).text().trim().replace(/[\n ]/g, '')};
    // mp-recover
    retVal["法力恢复"] = {type:'attrII', value:attributeRows.eq(5).find('>td').eq(2).find('.effective_value').text().trim()};
    // rounds
    retVal['每回合行动次数'] = {type:'attrII', value:attributeRows.eq(6).find('>td').eq(1).text().trim().replace(/[\n ]/g, '')};
    // pre-act
    retVal['先攻附加值'] = {type:'attrII', value:attributeRows.eq(7).find('>td').eq(1).text().trim().replace(/[\n ]/g, '')};

    //Table III
    attributesTable = jq.find('table[class=content_table]').eq(2);
    attributeRows = $(attributesTable).find('tr[class^=row]')
    const rawAmourRows = attributeRows
        .map(function () {
            const cells = $(this).find('> td');
            const attributeName = cells
                .first()
                .text()
                .trim();
            const valueType = cells.eq(1)
                .text()
                .trim();
            const effectiveValueCell = cells.eq(2)
                .text()
                .trim();
            return { attributeName, valueType, effectiveValueCell };
        })
        .toArray();
    rawAmourRows.forEach(function (x) {
        retVal[x.attributeName] = {type:'armor', value:x.effectiveValueCell};
    });

    //Table IV
    attributesTable = jq.find('table[class=content_table]').eq(3);
    attributeRows = $(attributesTable).find('tr[class^=row]')
    const rawAttRows = attributeRows
        .map(function () {
            const cells = $(this).find('> td');
            const attributeName = cells
                .first()
                .text()
                .trim();
            const effectiveValueCell = cells.eq(1)
                .text()
                .trim();
            return { attributeName, effectiveValueCell };
        })
        .toArray();
    rawAttRows.forEach(function (x) {
        retVal[x.attributeName] = {type:'attack',value:x.effectiveValueCell};
    });

    //Table V
    attributesTable = jq.find('table[class=content_table]').eq(4);
    attributeRows = $(attributesTable).find('tr[class^=row]')
    const rawDefRows = attributeRows
        .map(function () {
            const cells = $(this).find('> td');
            const attributeName = cells
                .first()
                .text()
                .trim();
            const effectiveValueCell = cells.eq(1)
                .text()
                .trim();
            return { attributeName, effectiveValueCell };
        })
        .toArray();
    rawAttRows.forEach(function (x) {
        retVal[x.attributeName] = {type:'defend',value:x.effectiveValueCell};
    });




    // Additional item in profile page:
    retVal["头衔"] = {type:'charattr', value:$('div.hero_full .heroTitle').text().trim()};
    retVal["种族"] = {type:'charattr', value:$('div.hero_full .heroRace').text().trim()};
    retVal["职业"] = {type:'charattr', value:$('div.hero_full .heroClass').text().trim()};
    retVal["级别"] = {type:'charattr', value:$('div.hero_full .heroLevel').text().trim()};
    retVal["头像"] = {type:'charattr', value:$('.boardavatar:first').attr('src')};

    // amor


    console.log(retVal);
    return retVal;
}
