var eList = null;
var attList = null;
var skillList = null;

function genEquipSimulator(dat) {
    console.log('//To Start create the fancy table!!');
    var datInfo = dat;
    console.log(datInfo);

    var matrixHtml = '<div id="tableMatrix">';
    $('body').append(matrixHtml);


    eList = dat[2];
    attList = dat[0][0];
    skillList = dat[1];

    //ToDo
    // Build the network! 
    // Find the req att/skill => to read the 'contributors' from each att/skill => build the impacted batch by that info!
    // But pls remember , we just need one 'being impacted by' list for each equipment in first round, and 
    // after this net work done, to backward scan and create 'being impacing to ' list again for every eList item
    eList.forEach(element => {
        element.forEach(curItem => {
            if (curItem.req != undefined) {
                curItem['impactedBy'] = [];
                curItem.req.forEach(curReq => {
                    if (curReq != null) {
                        //To find att list item
                        if (attList.hasOwnProperty(curReq.name)) {
                            curItem['impactedBy']= curItem['impactedBy'].concat(attList[curReq.name].valueDelta);
                        }
                        //To find att list item
                        if (skillList.hasOwnProperty(curReq.name)) {
                            curItem['impactedBy']= curItem['impactedBy'].concat(skillList[curReq.name].valueDelta);
                        }

                    }
                })
            }
        })
    })
    // Now backwards 
    

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
            //Done: judge risk level here!!
            // ==: red
            // +1-+2: yellow
            // >2: green
            // And add current actual value behind
            let gap = 0;
            let risk = 'normal';
            let realNumber = 0;

            if (attList.hasOwnProperty(item.name)) {
                let inputString = String(attList[item.name].value);
                realNumber = (inputString.match(/\[(\d+)\]/) || [])[1] || parseInt(inputString, 10) || 0;
            } else if (skillList.hasOwnProperty(item.name)) {
                let inputString = String(skillList[item.name].value);
                realNumber = (inputString.match(/\[(\d+)\]/) || [])[1] || parseInt(inputString, 10) || 0;
            } else
                return "<div>" + item.name + item.rule + item.threshold + "</div>";

            gap = parseInt(realNumber - item.threshold);
            risk = (gap == 0) ? 'high' : (gap <= 2) ? 'medium' : 'low';
            return "<div class='" + risk + "'>" + item.name + item.rule + item.threshold + " (" + realNumber + ")</div>";

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
            $(this).parent().removeClass('impactedBy');
        }
    });

    function calculateRelations(ti, ii) {
        console.log(eList[ti][ii]);
        $('.impactedBy').removeClass("impactedBy");
        let impactedBy = eList[ti][ii]['impactedBy'];
        if(impactedBy!=undefined) {
            impactedBy.forEach(element=>{
                $('td.name:contains('+element.factor+')').parent().addClass('impactedBy');
            })
        }
    }

};