//Report
let ind_pre = 1;
let ind_in = 3;

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
    var setList = [];

    $(".exportCurrent").click(function () {
        setList = [];
        $('#wod-orders-tab-dungeon').click();
        for (var i = 0; i < 11; i++) {
            $('.wod-tabs:nth-child(1)').find('li').eq(i).click();
            var titem = $("div.message_info+div").eq(0);
            var nitem = parseSetting(titem, i);
            if (nitem.customzied || nitem.layer == 0) {
                setList.push(nitem);
            }
            //titem.find(':not(.wod-list-item-label-skill)').remove();
            //           var tnode = titem.get(0);
            //            var bbstr = bbcode_generate_CreateBB(tnode, "", "", "");
            //console.log(bbstr);
        }
        $('#wod-orders-tab-general').click();
        var defSkills = { near: null, far: null, magic: null, mental: null };
        defSkills.near = $("h4:contains('近战') + span label").text() + $("h4:contains('近战') + span select:first").text() + ($("h4:contains('近战') + span select:nth-child(2)").length > 0 ? $("h4:contains('近战') + span select:nth-child(2)").val() : "");
        defSkills.far = $("h4:contains('远程') + span label").text() + $("h4:contains('远程') + span select:first").text() + ($("h4:contains('远程') + span select:nth-child(2)").length > 0 ? $("h4:contains('远程') + span select:nth-child(2)").val() : "");
        defSkills.magic = $("h4:contains('法术') + span label").text() + $("h4:contains('法术') + span select:first").text() + ($("h4:contains('法术') + span select:nth-child(2)").length > 0 ? $("h4:contains('法术') + span select:nth-child(2)").val() : "");
        defSkills.mental = $("h4:contains('心理') + span label").text() + $("h4:contains('心理') + span select:first").text() + ($("h4:contains('心理') + span select:nth-child(2)").length > 0 ? $("h4:contains('心理') + span select:nth-child(2)").val() : "");
        // Attack Order
        var aorder = $('.wod-list').eq(9).find('.wod-list-items').find('.wod-list-item');
        var attOrder = "";
        aorder.each(function (ind, cont) {
            attOrder = attOrder + ">" + $(cont).text();
        })
        // Support Order
        var sorder = $('.wod-list').eq(8).find('.wod-list-items').find('.wod-list-item');
        var sptOrder = "";
        sorder.each(function (ind, cont) {
            sptOrder = sptOrder + ">" + $(cont).text();
        });
        // Other
        var defaultAtt = $('h3:contains("杂项")+span input[type=checkbox]').is(":checked");

        // Title
        var setTitle = $('h1').eq(1).text();

        otherSetting = { defSkills: defSkills, attOrder: attOrder, sptOrder: sptOrder, defaultAtt: defaultAtt, setTitle: setTitle };

        for (let key in otherSetting) {
            setList[0][key] = otherSetting[key];
        }

        console.log(setList);
        chrome.runtime.sendMessage({ action: 'generateSettingPage', data: setList }, response => {
            //            console.log(response);
        });
    });
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
    var cureSetting = { light: null, mid: null, heavy: null };
    // To fetch general setting
    //Parse Default
    if (layer == 0) {
        position = inputItem.find('div:visible:first').find('select:visible:first').val()
        preAction = inputItem.find('div:visible:first').find('select:visible:nth-child(1)').val()
    } else {
        preAction = inputItem.find('div:visible:first').find('select:visible:first').val()
    };
    //Parse L1 ~ L10
    noDefault = inputItem.find('input[type=checkbox]:visible').eq(0).is(":checked")
    preList = inputItem.find('.wod-list').eq(ind_pre);
    preList.find('.wod-list-item>div:first-child:not(.disabled)').each(function (ind, content) {
        preSkills.push({
            name: $(content).find('.wod-list-item-label-skill').text(),
            item: $(content).find('.wod-list-item-label-item').text(),
            ammo: $(content).find('.wod-list-item-label-ammo').text(),
            position: $(content).find('.wod-list-item-label-positions').text(),
        })
    })
    inList = inputItem.find('.wod-list').eq(ind_in);
    inList.find('.wod-list-item>div:first-child:not(.disabled)').each(function (ind, content) {
        inSkills.push({
            name: $(content).find('.wod-list-item-label-skill').text(),
            item: $(content).find('.wod-list-item-label-item').text(),
            ammo: $(content).find('.wod-list-item-label-ammo').text(),
            position: $(content).find('.wod-list-item-label-positions').text(),
        })
    });

    cureSetting.light = inputItem.find('div:visible:first').find("h4:contains('轻伤') + span label").text() + $("h4:contains('轻伤') + span select:first").text() + ($("h4:contains('轻伤') + span select:nth-child(2)").length > 0 ? $("h4:contains('轻伤') + span select:nth-child(2)").val() : "");
    cureSetting.mid = inputItem.find('div:visible:first').find("h4:contains('受伤') + span label").text() + $("h4:contains('受伤') + span select:first").text() + ($("h4:contains('受伤') + span select:nth-child(2)").length > 0 ? $("h4:contains('受伤') + span select:nth-child(2)").val() : "");
    cureSetting.heavy = inputItem.find('div:visible:first').find("h4:contains('重伤') + span label").text() + $("h4:contains('重伤') + span select:first").text() + ($("h4:contains('重伤') + span select:nth-child(2)").length > 0 ? $("h4:contains('重伤') + span select:nth-child(2)").val() : "");

    return {
        layer: layer,
        position: position,
        preAction: preAction,
        customzied: noDefault,
        preSkills: preSkills,
        inSkills: inSkills,
        cureSetting: cureSetting,
        //       defSkills:defSkills
    }
}