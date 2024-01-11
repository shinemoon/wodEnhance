document.addEventListener('DOMContentLoaded', function () {
    let port = chrome.runtime.connect({ name: "reportGen" });

    // Listen for responses from the service worker
    port.onMessage.addListener((message) => {
        console.log("Response from service worker:", message);
        //Initial Request
        if (message.action == 'init') {
            console.log("Request Data for page Generation")
            port.postMessage({ action: 'requestData', data: null });
        } else if (message.action == 'dataInput') {
            genPage(message.data);
        }
    });
});

function genPage(dat) {
    if (dat.action == 'skillConfigPage') {
        genSkillSetPage(dat.data);
    }

}


function genSkillSetPage(dat) {
    //Gen SkillSet Page
    console.log(dat);
    var htmlHdl = $('<div id="reportPage"> \
    <h1 id="pageTitle"> </h1> \
    <h2 id="defaultSection"> 默认及一般设置 </h2> \
    <div class="defaultLayer settingLayer"></div> \
    <h2 id="LayersSection"> 分层设置</h2> \
    <div class="layers settingLayer"></div> \
    </div > ');

    //Default
    var curSetting = $('<div class="setting-row"></div>');
    curSetting.append("<h3>一般设置</h3>");
    curSetting.append("<div class='skillInfo'><label>位置:</label><span>" + dat[0].position + "</span></div>");
    curSetting.append("<h3>防御技能</h3>");
    curSetting.append("<ol>");
    curSetting.append("<li class='skillInfo'><label>近战:</label><span>" + dat[0].defSkills.near + "</span></li>");
    curSetting.append("<li class='skillInfo'><label>远程:</label><span>" + dat[0].defSkills.far + "</span></li>");
    curSetting.append("<li class='skillInfo'><label>法术:</label><span>" + dat[0].defSkills.magic + "</span></li>");
    curSetting.append("<li class='skillInfo'><label>心理:</label><span>" + dat[0].defSkills.mental + "</span></li>");
    curSetting.append("</ol>");

    // Default & General
    generalLayer(curSetting, dat[0]);
    curSetting.append("<h3>缺省行动</h3>");
    if (dat[0].defaultAtt)
        curSetting.append("<span>若所设置行为无法进行，允许自动进行其他攻击动作(仅限于回合中攻击技能)</span>");
    else
        curSetting.append("<span>禁止自动攻击</span>");
    curSetting.append("<h3>行为顺序</h3>");
    curSetting.append("<ol>");
    curSetting.append("<li class='skillInfo'><label>攻击:</label><span>" + dat[0].attOrder + "</span></li>");
    curSetting.append("<li class='skillInfo'><label>辅助:</label><span>" + dat[0].sptOrder + "</span></li>");
    curSetting.append("</ol>");

    htmlHdl.find('.defaultLayer').eq(0).append(curSetting);

    // Other Layers
    /*
    for(var i =1; i< dat.length;i++) {
        generalLayer(curSetting,dat[i]);
        htmlHdl.find('.layers').eq(0).append(curSetting);
    }
    */

    for (var i = 1; i < dat.length; i++) {
        curSetting = $('<div class="setting-row"></div>');
        generalLayer(curSetting, dat[i]);
        htmlHdl.find('.layers').eq(0).append("<h2 class='subLayerTitle'>L"+i+"</h2>");
        htmlHdl.find('.layers').eq(0).append("<div class='single-layer'></div>");
        htmlHdl.find('.single-layer:last').eq(0).append(curSetting);
    }


    $('body').append(htmlHdl);
    $('Title').text(dat[0].setTitle);
    $('h1').eq(0).text(dat[0].setTitle);
};

function generalLayer(curSetting, curDat) {
    curSetting.append("<h3>先攻技能:</h3>");
    curSetting.append("<div class='skillInfo'><span class='skillname'>" + curDat.preAction + "</span></div>");
    curSetting.append("<h3>回合前</h3>");
    curSetting.append("<ol>");
    curDat.preSkills.forEach(function (cont) {
        curSetting.append("<li class='skillInfo'><span class='skillname'>" + cont.name + "</span><span class='skillitem'>" + cont.item + " </span><span class='skillammo'>" + cont.ammo + " </span><span class='skillpos'>" + cont.position + "</span></li>");
    })
    curSetting.append("</ol>");
    curSetting.append("<h3>回合中</h3>");
    curSetting.append("<ol>");
    curDat.inSkills.forEach(function (cont) {
        curSetting.append("<li class='skillInfo'><span class='skillname'>" + cont.name + "</span><span class='skillitem'>" + cont.item + " </span><span class='skillammo'>" + cont.ammo + " </span><span class='skillpos'>" + cont.position + "</span></li>");
    })
    curSetting.append("</ol>");
    curSetting.append("<h3>治疗设置</h3>");
    curSetting.append("<ol>");
    curSetting.append("<li class='skillInfo'><label>轻伤:</label><span>" + curDat.cureSetting.light + "</span></li>");
    curSetting.append("<li class='skillInfo'><label>受伤:</label><span>" + curDat.cureSetting.mid + "</span></li>");
    curSetting.append("<li class='skillInfo'><label>重伤:</label><span>" + curDat.cureSetting.heavy + "</span></li>");
    curSetting.append("</ol>");
}