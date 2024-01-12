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
    // Close popup when the close button is clicked
    $("#closePopup").click(function () {
        $("#popupOverlay").fadeOut();
    });
});

function genPage(dat) {
    if (dat.action == 'skillConfigPage') {
        genSkillSetPage(dat.data);
    }

}
/*
'<label class="switch-container"> \
    <input type="checkbox" class="switch-input"> \
    <div class="switch-slider"> \
      <div class="switch-indicator"></div> \
    </div> \
  </label>'
  */

function genSkillSetPage(dat) {
    //Gen SkillSet Page
    console.log(dat);
    var htmlHdl = $('<h1 id="pageTitle"> </h1> \
    <div id="buttonList"> \
    <div id="exportbutton" class="elegant-button"> 导出BBCODE</div> \
    <div id="themes" class="switch-button"> <input id="themecheck" type=checkbox></div><div>  适配暗色主题论坛</div> \
    </div> \
    <div id="reportPage"> \
    <h2 id="defaultSection"> 默认及一般设置 </h2> \
    <div id="defaultLayer" class="settingLayer"></div> \
    <h2 id="LayersSection"> 分层设置</h2> \
    <div class="layers" id="settingLayer"></div> \
    </div > ');

    //Default
    var curSetting = $('<div class="setting-row"></div>');
    curSetting.append("<h3>一般设置</h3>");
    curSetting.append("<div class='skillInfo'><label>位置:</label><span>" + dat[0].position + "</span></div>");
    curSetting.append("<h3>防御技能</h3>");
    curSetting.append("<ol>");
    var lihdl = curSetting.find('ol:last');
    lihdl.append("<li class='skillInfo'><label>近战:</label><span>" + dat[0].defSkills.near + "</span></li>");
    lihdl.append("<li class='skillInfo'><label>远程:</label><span>" + dat[0].defSkills.far + "</span></li>");
    lihdl.append("<li class='skillInfo'><label>法术:</label><span>" + dat[0].defSkills.magic + "</span></li>");
    lihdl.append("<li class='skillInfo'><label>心理:</label><span>" + dat[0].defSkills.mental + "</span></li>");

    // Default & General
    generalLayer(curSetting, dat[0]);
    curSetting.append("<h3>缺省行动</h3>");
    if (dat[0].defaultAtt)
        curSetting.append("<span>若所设置行为无法进行，允许自动进行其他攻击动作(仅限于回合中攻击技能)</span>");
    else
        curSetting.append("<span>禁止自动攻击</span>");
    curSetting.append("<h3>行为顺序</h3>");
    curSetting.append("<ol>");
    lihdl = curSetting.find('ol:last');
    lihdl.append("<li class='skillInfo'><label>攻击:</label><span>" + dat[0].attOrder + "</span></li>");
    lihdl.append("<li class='skillInfo'><label>辅助:</label><span>" + dat[0].sptOrder + "</span></li>");

    htmlHdl.find('#defaultLayer').eq(0).append(curSetting);

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
        htmlHdl.find('.layers').eq(0).append("<h2 class='subLayerTitle'>L" + i + "</h2>");
        htmlHdl.find('.layers').eq(0).append("<div class='single-layer'></div>");
        htmlHdl.find('.single-layer:last').eq(0).append(curSetting);
    }
    $('body').append(htmlHdl);
    $('Title').text(dat[0].setTitle);
    $('h1').eq(0).text(dat[0].setTitle);
    //Add Action
    //Theme select
    const darkThemeToggle = $('#themecheck');
    // Check if the dark theme preference is stored in localStorage
    const isDarkTheme = localStorage.getItem('darktheme') === 'true';
    // Set the initial state based on localStorage
    darkThemeToggle.prop('checked', isDarkTheme);
    // Handle changes to the checkbox
    darkThemeToggle.on('change', function () {
        // Update localStorage with the new state
        localStorage.setItem('darktheme', darkThemeToggle.prop('checked'));
    });

    $('#pageTitle').click(function () {
        if ($(this).hasClass('zap')) {
            $('#reportPage').removeClass('zap').show();
        } else {
            $('#reportPage').addClass('zap').hide();
        }
        $(this).toggleClass('zap');
    });

    $('h2#defaultSection').click(function () {
        if ($(this).hasClass('zap')) {
            $('#defaultLayer').removeClass('zap').show();
        } else {
            $('#defaultLayer').addClass('zap').hide();
        }
        $(this).toggleClass('zap');
    })

    $('h2#LayersSection').click(function () {
        if ($(this).hasClass('zap')) {
            $('#settingLayer').removeClass('zap').show();
        } else {
            $('#settingLayer').addClass('zap').hide();
        }
        $(this).toggleClass('zap');
    });

    $('h2.subLayerTitle').click(function () {
        if ($(this).hasClass('zap')) {
            $(this).next('div.single-layer').removeClass('zap').show();
        } else {
            $(this).next('div.single-layer').addClass('zap').hide();
        }
        $(this).toggleClass('zap');
    })

    $('#exportbutton').click(function () {
        var exportBB = "[h1]" + $('title').text() + " 战术设置[/h1]";
        exportBB = exportBB + "[hr]";
        if (!$('#defaultSection').hasClass('zap')) {
            exportBB = exportBB + "[h2]缺省及通用设置[/h2]";
            exportBB = exportBB + "[hr]";
            exportBB = exportBB + bbcode_generate_CreateBB($('#defaultLayer')[0], "", "", "");
        }
        if (!$('#LayerSection').hasClass('zap')) {
            exportBB = exportBB + "[h2]分层设置[/h2]";
            exportBB = exportBB + "[hr]";
            var tmpHdl = $('#settingLayer');
            for (var i = 1; i < 11; i++) {
                //if set in place and not zapped
                if ($("h2.subLayerTitle:contains(L" + i + ")").length > 0 && !$("h2.subLayerTitle:contains(L" + i + ")").hasClass('zap')) {
                    exportBB = exportBB + "[h3]第" + i + "层[/h3]";
                    exportBB = exportBB + "[hr]";
                    exportBB = exportBB + bbcode_generate_CreateBB($("h2.subLayerTitle:contains(L" + i + ")~ div.single-layer")[0], "", "", "");
                }
            }
        }
        $('#popupOverlay textarea').eq(0).val(refineBB(exportBB));
        $("#popupOverlay").fadeIn();
    })
};

function refineBB(strin) {
    // remove space before '[list]'
    var resultString = strin.replace(/ \[list\]/g, '[list]');
    var isDarkTheme = localStorage.getItem('darktheme') === 'true';
    if (isDarkTheme) {
        // refine the color 
        /*
        resultString = resultString.replace(/#1f3847/g, '#eeeeee');
        resultString = resultString.replace(/#000000/g, '#cccccc');
        resultString = resultString.replace(/#00008b/g, '#eeeeee');
        */
       //To use default value
        resultString = resultString.replace(/\[color=[^\]]+\]/g, '').replace(/\[\/color\]/g, '');
    }
    return resultString;
}

function generalLayer(curSetting, curDat) {
    curSetting.append("<h3>先攻技能:</h3>");
    curSetting.append("<div class='skillInfo'><span class='skillname'>" + curDat.preAction + "</span></div>");
    curSetting.append("<h3>回合前</h3>");
    curSetting.append("<ol>");
    var lihdl = curSetting.find('ol:last');
    curDat.preSkills.forEach(function (cont) {
        lihdl.append("<li class='skillInfo'><span class='skillname'>" + cont.name + "</span><span class='skillitem'>" + cont.item + " </span><span class='skillammo'>" + cont.ammo + " </span><span class='skillpos'>" + cont.position + "</span></li>");
    })
    curSetting.append("<h3>回合中</h3>");
    curSetting.append("<ol>");
    lihdl = curSetting.find('ol:last');
    curDat.inSkills.forEach(function (cont) {
        lihdl.append("<li class='skillInfo'><span class='skillname'>" + cont.name + "</span><span class='skillitem'>" + cont.item + " </span><span class='skillammo'>" + cont.ammo + " </span><span class='skillpos'>" + cont.position + "</span></li>");
    })
    curSetting.append("<h3>治疗设置</h3>");
    curSetting.append("<ol>");
    lihdl = curSetting.find('ol:last');
    lihdl.append("<li class='skillInfo'><label>轻伤:</label><span>" + curDat.cureSetting.light + "</span></li>");
    lihdl.append("<li class='skillInfo'><label>受伤:</label><span>" + curDat.cureSetting.mid + "</span></li>");
    lihdl.append("<li class='skillInfo'><label>重伤:</label><span>" + curDat.cureSetting.heavy + "</span></li>");
};