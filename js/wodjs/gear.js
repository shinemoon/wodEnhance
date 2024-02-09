//Add generate button
var gearSwtich = true;

if (gearSwtich) {
    $('input[name="ok"').after('<input type="button" value="模拟" id="blockEmulator" class="button clickable blockEmulator">');
    var eList = null;

    $('.blockEmulator').click(function () {
        $('.blockEmulator').addClass('disabled');
        $('.blockEmulator').attr('value', '数据生成中');
        Promise.all([loadLocalHeroAttributes(), loadHeroSkills(), loadHeroGear()])
            .then((dat) => {
                // 遍历
                eList = dat[2];
                //Equip
                //Medal
                //Bucket
                //Ring
                const equipQueryList = [];
                for (let i = 0; i < eList.length; i++) {
                    for (let j = 0; j < eList[i].length; j++) {
                        let curItem = eList[i][j];
                        if (typeof curItem["equipId"] !== 'undefined') {
                            equipQueryList.push(loadGearDetails(curItem["equipId"], [i, j]));
                        }
                    }
                }
                Promise.all(equipQueryList).then((dat) => {
                    console.log(eList);
                    $('.blockEmulator').removeClass('disabled');
                    $('.blockEmulator').attr('value', '模拟');
                });

            });
    });

    function loadGearDetails(iid, ind) {
        return new Promise(function (resolve) {
            function fetchGearDetails() {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/wod/spiel/hero/item.php?item_instance_id=' + iid,
                        type: 'GET',
                        crossDomain: true,
                        success: function (data) {
                            resolve([data, iid, ind]);
                        },
                        error: function (xhr, status, error) {
                            reject(new Error("Failed to fetch gear details"));
                        }
                    });
                });
            }
            fetchGearDetails()
                .then(function (res) {
                    resolve(parseGearDetails(res[0], res[1], res[2]));
                })
                .catch(function (error) {
                    console.error("Error fetching gear details", error);
                });
        });
    }

    function parseGearDetails(data, iid, ind) {
        const jq = $(data);
        console.log("Parse Item: " + jq.find('h1').text());
        var tmpHtml = jq.find("#details .content_table tr[class^='row']:contains('装备要求')>td:nth-child(2)").html();
        // Mapping function
        const mapToFormat = function (inputString) {
            // Check if the string contains an <a> tag
            const isSkill = inputString.includes('<a');

            //Remove tag
            inputString = inputString.replace(/<[^>]*>/g, '');
            // Extract the name, rule, and threshold from the string
            const match = inputString.match(/([\u4e00-\u9fa5]+)(至少为|最高到)(\d+)/);

            if (match) {
                const [, name, rule, threshold] = match;

                // Determine the type based on whether it's a skill or not
                const type = isSkill ? 'skill' : 'attr';

                return {
                    type,
                    name,
                    rule: rule === '至少为' ? '>=' : '<=',
                    threshold: parseInt(threshold, 10)
                };
            }
            return null;
        };
        try {
            eList[ind[0]][ind[1]]["req"] = tmpHtml.split('<br>').map(function (item) {
                return mapToFormat(item.trim());
            });
        } catch {

        };

        // Add
        const attrArray = [];
        jq.find('h2:contains("作用在物品持有者上的效果") ').siblings("h3:contains('属性奖励')~table.content_table").first().find("tr").each(function () {
            // Find the columns within the current row
            const columns = $(this).find("td.content_table");
            if (columns.length > 0) {

                // Extract the values from the columns
                const attributeName = columns.eq(0).text().trim();
                //const attributeValue = parseInt(columns.eq(1).find("span").text().trim(), 10);
                const attributeValue = columns.eq(1).find("span").text().trim();

                // Push the result into the array
                attrArray.push({ name: attributeName, type: 'attr', value: attributeValue });
            }
        });
        eList[ind[0]][ind[1]]["attrAdd"] = attrArray;
        const skillArray = [];
        jq.find('h2:contains("作用在物品持有者上的效果") ').siblings("h3:contains('对技能等级的奖励')~table.content_table").first().find("tr").each(function () {
            // Find the columns within the current row
            const columns = $(this).find("td.content_table");
            if (columns.length > 0) {

                // Extract the values from the columns
                const attributeName = columns.eq(0).text().trim();
                //const attributeValue = parseInt(columns.eq(1).find("span").text().trim(), 10);
                const attributeValue = columns.eq(1).find("span").text().trim();

                // Push the result into the array
                attrArray.push({ name: attributeName, type: 'skill', value: attributeValue });
            }
        });
        eList[ind[0]][ind[1]]["skillAdd"] = skillArray;
    }
}