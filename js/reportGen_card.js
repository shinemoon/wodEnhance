function genCardPage(dat) {
    console.log('Generate for Character Card')
    console.log(dat);

    var tableHtml = '<table id="charCard" class="dark">';
    $('body').append(tableHtml);
    // Attribute card
    var attrCard = $('#charCard');
    var attrItem = dat[0][0];
    attrCard.append("<tr class='row2'>");
    attrCard.find('tr:last').append("<td class='header' colspan=2><b>角色卡：<span id='nametitle'></span></b></td>");
    attrCard.find('tr:last').append("<td colspan=2 class='header' ><b>属性</b></td>");
    attrCard.append("<tr class='row2'>");
    attrCard.find('tr:last').append("<td id='avatar'><img src='" + attrItem['头像'].value + "'></td>");
    attrCard.find('tr:last').append("<td id='otherTable' style='vertical-align:top'><table></table></td>");
    attrCard.find('tr:last').append("<td id='attrTable' style='vertical-align:top'><table></table></td>");
    var curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => value.type === "attr")
    );
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            attrCard.find('#attrTable table').append("<tr><td class='label'><u>" + key + "</u></td><td>" + element.value + "</td></tr>");
        }
    }
    curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => value.type === "charattr")
    );
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            if (key == '名字')
                attrCard.find('#nametitle').text(element.value);

            if (key != '头像')
                attrCard.find('#otherTable table').append("<tr><td class='label'><u>" + key + "</u></td><td>" + element.value + "</td></tr>");
        }
    }
    attrCard.find('.row2:last').after("<tr class='row2'>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top; ' class='header'><b> 其他属性 </b></td>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top;' class='header'><b>装备</b></td>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top;' class='header'><b>口袋</b></td>");



    attrCard.find('.row2:last').after("<tr class='row2'>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top'><table id='attrIITable' ></table></td>");
    attrCard.find('tr:last td:last').append("<div >护甲加成</div>");
    attrCard.find('tr:last td:last').append("<table id='armorTable' ></table>");
    attrCard.find('tr:last td:last').append("<div >损害</div>");
    attrCard.find('tr:last td:last').append("<table id='hurtTable' ></table>");
    attrCard.find('tr:last td:last').append("<div >攻击加成</div>");
    attrCard.find('tr:last td:last').append("<table id='attTable' ></table>");
    attrCard.find('tr:last td:last').append("<div >防御加成</div>");
    attrCard.find('tr:last td:not(.label):last').append("<table id='defendTable' ></table>");
    //    attrCard.find('tr:last').append("<td id='attTable'  style='vertical-align:top'><table></table></td>");
    //   attrCard.find('tr:last').append("<td id='defendTable' style='vertical-align:top'><table></table></td>");
    attrCard.find('tr:last').append("<td id='equipTable' style='vertical-align:top'><table></table></td>");
    attrCard.find('tr:last').append("<td id='bucketTable' style='vertical-align:top'><table></table></td>");

    curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => value.type === "attrII")
    );
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            attrCard.find('table#attrIITable').append("<tr><td class='label'><u>" + key + "</u></td><td>" + element.value + "</td></tr>");
        }
    }




    attrItem = dat[0][1];
    curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => value.type === "armor")
    );
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            attrCard.find('table#armorTable').append("<tr><td class='label'><u>" + key + "</u></td><td>" + element.value + "</td></tr>");
        }
    }

    attrItem = dat[0][2];
    curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => value.type === "attack")
    );
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            attrCard.find('table#attTable').append("<tr><td class='label'><u>" + key + "</u></td><td>" + element.value + "</td></tr>");
        }
    }

    attrItem = dat[0][3];
    curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => value.type === "defend")
    );
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            attrCard.find('table#defendTable').append("<tr><td class='label'><u>" + key + "</u></td><td>" + element.value + "</td></tr>");
        }
    }

    attrItem = dat[0][4];
    curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => value.type === "hurt")
    );
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            attrCard.find('table#hurtTable').append("<tr><td class='label'><u>" + key + "</u></td><td>" + element.value + "</td></tr>");
        }
    }


    curattr = dat[2][0];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            if (element['equipName'] == "")
                attrCard.find('#equipTable table').append("<tr><td class='label'><u>" + element['equipPos'] + "</u>:</td><td>" + element['equipName'] + "</td></tr>");
            else
                attrCard.find('#equipTable table').append("<tr><td class='label'><u>" + element['equipPos'] + "</u>:</td><td><a href='item'>" + element['equipName'] + "</a></td></tr>");
        }
    }
    curattr = dat[2][1];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            if (element['medalName'] == "")
                attrCard.find('#equipTable table').append("<tr><td class='label'><u>" + element['medalPos'] + "</u>:</td><td>" + element['medalName'] + "</td></tr>");
            else
                attrCard.find('#equipTable table').append("<tr><td class='label'><u>" + element['medalPos'] + "</u>:</td><td><a href='item'>" + element['medalName'] + "</a></td></tr>");
        }
    }
    curattr = dat[2][3];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            attrCard.find('#equipTable table').append("<tr><td class='label'><u>" + element['ringPos'] + "</u>:</td><td><a href='item'>" + element['ringName'] + "</a></td></tr>");
        }
    }

    curattr = dat[2][2];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            if (element['bucketName'] == "")
                attrCard.find('#bucketTable table').append("<tr><td class='label'><u>" + element['bucketPos'] + "</u>:</td><td>" + element['bucketName'] + "</td></tr>");
            else
                attrCard.find('#bucketTable table').append("<tr><td class='label'><u>" + element['bucketPos'] + "</u>:</td><td><a href='item'>" + element['bucketName'] + "</a></td></tr>");

        }
    }

    // SKILL TABLES
    attrCard.find('.row2:last').after("<tr class='row2'>");
    attrCard.find('tr:last').append("<td colspan=3  class='header'><b>技能</b></td>");
    attrCard.find('.row2:last').after("<tr class='row2'>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top'><table id='skillTableI'></table></td>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top'><table id='skillTableII'></table></td>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top'><table id='skillTableIII'></table></td>");
    attrItem = dat[1];
    // Loop through the new object and display its elements
    curattr = Object.fromEntries(
        Object.entries(attrItem)
            .filter(([key, value]) => !value.includes('可学习'))
    );
    var killSubLen = Math.ceil(Object.keys(curattr).length / 3);
    console.log(killSubLen);
    function breakObject(inputObject, killSubLen) {
        var result = [];
        var chunkSize = killSubLen;
        var keys = Object.keys(inputObject);
        for (var i = 0; i < keys.length; i += chunkSize) {
            var chunkKeys = keys.slice(i, i + chunkSize);
            var chunkObject = {};

            for (var j = 0; j < chunkKeys.length; j++) {
                var key = chunkKeys[j];
                chunkObject[key] = inputObject[key];
            }
            result.push(chunkObject);
        }
        return result;
    }
    var brokenArrays = breakObject(curattr, killSubLen);
    console.log(brokenArrays);
    for (const key in brokenArrays[0]) {
        attrCard.find('#skillTableI').append("<tr><td class='label'><a href='skill'>" + key + "</a>:</td><td style='text-align:right'>" + curattr[key] + "</td></tr>");
    }
    for (const key in brokenArrays[1]) {
        attrCard.find('#skillTableII').append("<tr><td class='label'><a href='skill'>" + key + "</a>:</td><td style='text-align:right'>" + curattr[key] + "</td></tr>");
    }
    for (const key in brokenArrays[2]) {
        attrCard.find('#skillTableIII').append("<tr><td class='label'><a href='skill'>" + key + "</a>:</td><td style='text-align:right'>" + curattr[key] + "</td></tr>");
    }


    //Gen
    //$('#charCard').append(attrCard);
    $('body').append(' <div id="buttonList" style="margin-top:20px;margin-bottom:20px;padding-top:10px;padding-bottom:10px;background:rgba(0,0,0,0.1);"> \
                                                <div id="exportbutton" class="elegant-button"> 导出BBCODE</div> \
                                                <div id="themes" class="switch-button"> <input id="themecheck" type=checkbox></div><div> 预览暗色(论坛效果)</div> \
                                         </div > ');

    $('#exportbutton').click(function () {
        if (!isDarkTheme)
            $('#charCard').addClass('dark');
        var exportBB = bbcode_generate_CreateBB($('#charCard')[0], "", "", "")
            .replace(/^ \[table\]/, '[table border=1]')         //Set border
            .replace(/\[\/?(font|color|size)[^\]]*\]/g, '');        // Remove color size font
        //Handle the url
        // Regex to match the specified BBCode pattern
        var regex = /\[url=([^[\]]+)\]([^\]]+?)\s*(?:\!\s*)?(?:\(\d+\/\d+\)\s*)?\[\/url\]/g;

        // Replace with the desired format
        exportBB = exportBB.replace(regex, '[$1:$2]');


        $('#popupOverlay textarea').eq(0).val(exportBB);
        $("#popupOverlay").fadeIn();
        if (!isDarkTheme)
            $('#charCard').removeClass('dark');

    })

    //Theme select
    const darkThemeToggle = $('#themecheck');
    // Check if the dark theme preference is stored in localStorage
    var isDarkTheme = localStorage.getItem('darktheme') === 'true';
    if (isDarkTheme)
        $('#charCard').addClass('dark');
    else
        $('#charCard').removeClass('dark');
    // Set the initial state based on localStorage
    darkThemeToggle.prop('checked', isDarkTheme);
    // Handle changes to the checkbox
    darkThemeToggle.on('change', function () {
        // Update localStorage with the new state
        isDarkTheme = darkThemeToggle.prop('checked');
        localStorage.setItem('darktheme', isDarkTheme);
        if (isDarkTheme)
            $('#charCard').addClass('dark');
        else
            $('#charCard').removeClass('dark');
    });


}

