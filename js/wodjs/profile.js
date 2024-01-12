$(document).ready(function () {
    console.log("优化Profile")
    if (window.location.href.indexOf("hero/profile.php") >= 0) {
        $('#smarttabs__details_inner').on('mouseover', function () {
            // Remove resizer:
            $('textarea').off('mouseover');
            $('textarea').removeAttr('onmouseover');
            $('textarea').parent().removeClass('resizeable');
        }
        )
        function loadHeroAttributes() {
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
                        resolve(parseHeroAttributes(data));
                    })
                    .catch(function (error) {
                        console.error("Error fetching hero attributes", error);
                    });
            });
        }

        function parseHeroAttributes(data) {
            const jq = $(data);
            const attributesTable = jq.find('table[class=content_table]').first();
            if (!attributesTable.length) {
                console.error('NOPE.', attributesTable);
                return;
            }
            const attributeRows = $(attributesTable).find('tr[class^=row]')
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
                retVal[x.attributeName] = x.effectiveValueCell.length > 0 ? x.valueCell + "[" + x.effectiveValueCell + "]" : Number(x.valueCell);
            });
            return retVal;
        }

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
                    return { equipName, equipPos };
                })
                .toArray();

            const medalRows = $(medalTable).find('tr')
            const medalRawRows = medalRows
                .map(function () {
                    const cells = $(this).find('>td ');
                    const medalPos = cells.eq(0).text().trim();
                    const medalName = cells.eq(1).find('option[selected=selected]').text().trim();
                    return { medalName, medalPos };
                })
                .toArray();


            const bucketRows = $(bucketTable).find('tr')
            const bucketRawRows = bucketRows
                .map(function () {
                    const cells = $(this).find('>td ');
                    const bucketPos = cells.eq(0).text().trim();
                    const bucketName = cells.eq(1).find('option[selected=selected]').text().trim();
                    return { bucketName, bucketPos };
                })
                .toArray();

            const ringRows = $(ringTable).find('tr')
            const ringRawRows = ringRows
                .map(function () {
                    const cells = $(this).find('>td ');
                    const ringPos = cells.eq(0).text().trim();
                    const ringName = cells.eq(1).find('option[selected=selected]').text().trim();
                    return { ringName, ringPos };
                })
                .toArray();


            const retVal = {};
            equipRawRows.forEach(function (x) {
                retVal[x.equipPos] = x.equipName;
            });
            medalRawRows.forEach(function (x) {
                retVal[x.medalPos] = x.medalName;
            });
            bucketRawRows.forEach(function (x) {
                retVal[x.bucketPos] = x.bucketName;
            });
            ringRawRows.forEach(function (x) {
                retVal[x.ringPos] = x.ringName;
            });
            return retVal;
        }



        //Main function here
        Promise.all([loadHeroAttributes(), loadHeroSkills(), loadHeroGear()])
            .then((dat) => console.log(dat))
            .catch((err) => console.error(err));
    };
});