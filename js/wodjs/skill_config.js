//Report
if (window.location.href.indexOf("skillconfig.php") >= 0 || window.location.href.indexOf("hero/skillconf") >= 0) {
    console.log("优化配置界面");
    var confighint = $('div:contains("这些提示会显示在物品装备页面。"):last').parent().find('textarea').val();
    var newDiv = $("<div class='message_info'>").html(confighint.replace(/\n/g, '<br>'));
    // Insert the new div after the ul with class wod-tabs
    $("ul.wod-tabs:nth-child(1)").after(newDiv);
    // Find the td containing "BBCode"
    var lastButton = $('#wod-orders input[type="button"]:visible:first')
    console.log(lastButton.attr('value'));
    var exportButton = lastButton.clone().attr('value', '导出当前').addClass("exportCurrent");
    //    var exportButtonA = lastButton.clone().attr('value', '导出全部').addClass('exportAll');
    // Clone its contents and append to the next td
    lastButton.before(exportButton);
    //    lastButton.before(exportButtonA);

    $(".exportCurrent").click(function () {
        for (var i = 0; i < 11; i++) {
            $('.wod-tabs:nth-child(1)').find('li').eq(i).click();
            var titem = $("div.message_info+div").eq(0);
            var nitem = parseSetting(titem, i);
            if (nitem.customzied || nitem.layer == 0) {
                console.log("- 层数: ", nitem.layer);
                console.log(nitem);
            }
            //titem.find(':not(.wod-list-item-label-skill)').remove();
            //           var tnode = titem.get(0);
            //            var bbstr = bbcode_generate_CreateBB(tnode, "", "", "");
            //console.log(bbstr);
        }
    })
};

function parseSetting(inputItem, layer) {
    // Parse Default Setting
    var position = null;
    var preAction = null;
    var noDefault = null;
    var preList = null;
    var preSkills = [];
    var inList = null;
    var inSkills = [];

    //Parse Default
    if (layer == 0) {
        position = inputItem.find('div:visible:first').find('select:visible:first').val()
    } else {
        //Parse L1 ~ L10
        preAction = inputItem.find('div:visible:first').find('select:visible:first').val()
        noDefault = inputItem.find('input[type=checkbox]:visible').eq(0).is(":checked")
        preList = inputItem.find('.wod-list').eq(1);
        preList.find('.wod-list-item').each(function (ind, content) {
            preSkills.push({
                name: $(content).find('.wod-list-item-label-skill').text(),
                item: $(content).find('.wod-list-item-label-item').text(),
                ammo: $(content).find('.wod-list-item-label-ammo').text(),
                position: $(content).find('.wod-list-item-label-positions').text(),
            })
        })
        inList = inputItem.find('.wod-list').eq(3);
        inList.find('.wod-list-item').each(function (ind, content) {
            inSkills.push({
                name: $(content).find('.wod-list-item-label-skill').text(),
                item: $(content).find('.wod-list-item-label-item').text(),
                ammo: $(content).find('.wod-list-item-label-ammo').text(),
                position: $(content).find('.wod-list-item-label-positions').text(),
            })
        });
    };
    return {
        layer: layer,
        position: position,
        preAction: preAction,
        customzied: noDefault,
        preSkills: preSkills,
        inSkills: inSkills
    }
}