function genCardPage(dat) {
    console.log('Generate for Character Card')
    console.log(dat);
    var tableHtml = '<table id="charCard">';
    $('body').append(tableHtml);
    // Attribute card
    var attrCard = $('<table id="attriCard">');
    var attrItem = dat[0][0];
    attrCard.append("<tr class='row2'>");
    attrCard.find('tr:last').append("<td class='label' colspan=2 style='background:#aaa;'>概况</td>");
    attrCard.find('tr:last').append("<td colspan=2 class='label' style='background:#aaa;'>属性</td>");
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
            attrCard.find('#attrTable table').append("<tr><td>" + key + "</td><td>" + element.value + "</td></tr>");
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
            if (key != '头像')
                attrCard.find('#otherTable table').append("<tr><td>" + key + "</td><td>" + element.value + "</td></tr>");
        }
    }
    attrCard.find('.row2:last').after("<tr class='row2'>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top; background-color:#aaa;' class='header'> 其他属性 </td>");
    attrCard.find('tr:last').append("<td style='vertical-align:top;background-color:#aaa;' class='header'>装备</td>");
    attrCard.find('tr:last').append("<td colspan=2 style='vertical-align:top;background-color:#aaa;' class='header'>口袋</td>");



    attrCard.find('.row2:last').after("<tr class='row2'>");
    attrCard.find('tr:last').append("<td  style='vertical-align:top'><table id='attrIITable'></table></td>");
    attrCard.find('tr:last td:last').append("<div style='background:#aaa'>护甲加成</div>");
    attrCard.find('tr:last td:last').append("<table id='armorTable' ></table>");
    attrCard.find('tr:last td:last').append("<div style='background:#aaa'>攻击加成</div>");
    attrCard.find('tr:last td:last').append("<table id='attTable' ></table>");
    attrCard.find('tr:last td:last').append("<div style='background:#aaa'>防御加成</div>");
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
            attrCard.find('table#attrIITable').append("<tr><td>" + key + "</td><td>" + element.value + "</td></tr>");
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
            attrCard.find('table#armorTable').append("<tr><td>" + key + "</td><td>" + element.value + "</td></tr>");
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
            attrCard.find('table#attTable').append("<tr><td>" + key + "</td><td>" + element.value + "</td></tr>");
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
            attrCard.find('table#defendTable').append("<tr><td>" + key + "</td><td>" + element.value + "</td></tr>");
        }
    }


    curattr = dat[2][0];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            console.log(element);
            attrCard.find('#equipTable table').append("<tr><td class='label'>" + element['equipPos']+ ":</td><td>" + element['equipName'] + "</td></tr>");
        }
    }
    attrCard.find('#equipTable table').append("<tr><td colspan=2 style='background:#aaa;'>戒指</td></tr>");
    curattr = dat[2][1];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            console.log(element);
            attrCard.find('#equipTable table').append("<tr><td class='label'>" + element['medalPos']+ ":</td><td>" + element['medalName'] + "</td></tr>");
        }
    }
    attrCard.find('#equipTable table').append("<tr><td colspan=2 style='background:#aaa;'>徽章</td></tr>");
    curattr = dat[2][3];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            console.log(element);
            attrCard.find('#equipTable table').append("<tr><td class='label'>" + element['ringPos']+ ":</td><td>" + element['ringName'] + "</td></tr>");
        }
    }

    curattr = dat[2][2];
    // Loop through the new object and display its elements
    for (const key in curattr) {
        if (curattr.hasOwnProperty(key)) {
            const element = curattr[key];
            console.log(element);
            attrCard.find('#bucketTable table').append("<tr><td class='label'>" + element['bucketPos']+ ":</td><td style='text-align:right'>" + element['bucketName'] + "</td></tr>");
        }
    }



    //Gen
    $('#charCard').append(attrCard);
}

