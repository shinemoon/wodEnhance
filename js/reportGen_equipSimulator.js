var eList = null;
function genEquipSimulator(dat) {
    console.log('//To Start create the fancy table!!');
    var datInfo = dat;
    console.log(datInfo);

    var matrixHtml = '<div id="tableMatrix">';
    $('body').append(matrixHtml);


    eList = dat[2];

    function getFirstKeyEndingWithName(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && key.endsWith('Name')) {
                return key;
            }
        }
        return undefined; // Return undefined if no matching key is found
    }

    function refineReqToString(objArray) {
        if (objArray === undefined) return "";
        return objArray.map(item => {
            if (item == null) return "";
            return "<div>" + item.name + item.rule + item.threshold + "</div>";
        }).join("");
    }

    function refineAddToString(objArray) {
        if (objArray === undefined) return "";
        return objArray.map(item => {
            if (item == null) return "";
            return "<div>" + item.name + ":" + item.value + "</div>";
        }).join("");

    }


    var i = 0;
    eList.forEach(element => {
        i = i + 1;
        //To Start create the fancy table!!
        var tableHtml = '<table id="equipEmulator-' + i + '" class="equipEmulator">';
        $('#tableMatrix').append(tableHtml);

        var tableItem = $('#equipEmulator-' + i);
        tableItem.append("<tr class='tbhead'>");
        $('.tbhead').last().append("<th>装备</th>");
        $('.tbhead').last().append("<th>要求</th>");
        $('.tbhead').last().append("<th>效果</th>");

        var j = 0;
        element.forEach(curItem => {
            j = j + 1;
            if (refineReqToString(curItem.req) != "" || refineAddToString(curItem.attrAdd) != "") {
                $('#equipEmulator-' + i).append("<tr class='equiprow'>")
                $('.equiprow').last().append("<td class='name' tabind=" + (i - 1) + " itemind = " + (j - 1) + ">" + curItem[getFirstKeyEndingWithName(curItem)] + "</td>");
                $('.equiprow').last().append("<td>" + refineReqToString(curItem.req) + "</td>");
                $('.equiprow').last().append("<td>" + refineAddToString(curItem.attrAdd) + "</td>");
            }
        })
    });

    $('td.name').hover(function () {
        if ($(this).hasClass('selected')) return;
        //mouseover
        $(this).css('background-color', '#e0e0e0');
    }, function () {
        if ($(this).hasClass('selected')) return;
        //mouseout
        $(this).css('background-color', '#f0f0f0');
    })


    $('td.name').click(function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('tr').removeClass('fade');
        } else {
            $('td.name.selected').removeClass('selected');
            calculateRelations($(this).attr('tabind'), $(this).attr('itemind'));
            $(this).addClass('selected');
            $('tr').addClass('fade');
            $(this).parent().removeClass('fade');
        }
    });

    function calculateRelations(ti, ii) {
        console.log(ti + ":" + ii);
        console.log(eList[ti][ii]);
    }

};