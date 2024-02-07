//Add generate button
$('input[name="ok"').after('<input type="button" value="模拟" id="blockEmulator" class="button clickable blockEmulator">');

$('.blockEmulator').click(function () {
    $('.blockEmulator').addClass('disabled');
    $('.blockEmulator').attr('value', '数据生成中');
    Promise.all([loadLocalHeroAttributes(), loadHeroSkills(), loadHeroGear()])
        .then((dat) => {
            // 遍历
            var eList = dat[2];
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
            /*
                        Promise.all(equipQueryList).then((dat) => {
                            console.log(dat);
                        });
            
            */
            $('.blockEmulator').removeClass('disabled');
            $('.blockEmulator').attr('value', '模拟');
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
                resolve(parseGearDetails(res[0],res[1]),res[2]);
            })
            .catch(function (error) {
                console.error("Error fetching gear details", error);
            });
    });
}

function parseGearDetails(data, iid) {
    console.log("Parse Item: " + iid);
}