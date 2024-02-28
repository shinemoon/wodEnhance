var eList = null;
var attList = null;
var skillList = null;

function genEquipSimulator(dat) {
    console.log('//To Start create the fancy table!!');
    var datInfo = dat;
    console.log(datInfo);

    var matrixHtml = '<div id="tableMatrix">';
    $('body').append(matrixHtml);
    $('body').append("<table id='legend'>\
                                  <tr class='high-risk'><td>互有影响</td></tr>\
                                  <tr class='medium-risk'><td>受本装备影响</td></tr>\
                                  <tr class='low-risk'><td>本装备依赖</td></tr>\
                                  </table>");


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
                            curItem['impactedBy'] = curItem['impactedBy'].concat(attList[curReq.name].valueDelta);
                        } else if (skillList.hasOwnProperty(curReq.name)) {
                            curItem['impactedBy'] = curItem['impactedBy'].concat(skillList[curReq.name].valueDelta);
                        } else {
                            curItem['impactedBy'] = curItem['impactedBy'].concat([null]);
                        }
                    }
                })
            }
        })
    })
    // Now backwards 
    eList.forEach(element => {
        element.forEach(curItem => {
            if (curItem['impactedBy'] != undefined) {
                //Scan and backwardc:w
                curItem['impactedBy'].forEach(curImpact => {
                    console.log(curImpact);
                    if (curImpact != null) {
                        // to find and register every item back
                        eList.forEach(scanArr => {
                            scanArr.forEach(scanItem => {
                                if (!scanItem.hasOwnProperty('impacting')) scanItem['impacting'] = [];
                                let nameStr = getItemName(scanItem);
                                //                            console.log(cleanItemName(nameStr));
                                //                           console.log(curImpact);
                                if (cleanItemName(nameStr) == curImpact.factor) uniquePush(getItemName(curItem), scanItem['impacting']);
                            })
                        })
                    }
                })
            }
        })
    });


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
            $('tr').removeClass('impactedBy');
            $('tr').removeClass('impacting');
            $('tr').removeClass('fade');
            $('#addInfo').remove();
        } else {
            $('td.name.selected').removeClass('selected');
            calculateRelations($(this).attr('tabind'), $(this).attr('itemind'));
            $(this).addClass('selected');
            $('tr').addClass('fade');
            $(this).parent().removeClass('fade');
            $(this).parent().removeClass('impactedBy');
            $(this).parent().removeClass('impacting');
        }
    });

    function calculateRelations(ti, ii) {
        //console.log(eList[ti][ii]);
        $('body').append("<div id='addInfo'>");

        $('.impactedBy').removeClass("impactedBy");
        $('.impacting').removeClass("impacting");
        let impactedBy = eList[ti][ii]['impactedBy'];
        let impacting = eList[ti][ii]['impacting'];
        if (impactedBy != undefined) {
            let otherItems = [];
            impactedBy.forEach(element => {
                if (element != null) {
                    if ($('td.name:contains(' + element.factor + ')').length > 0)
                        $('td.name:contains(' + element.factor + ')').parent().addClass('impactedBy');
                    else {
                        uniquePush(element.factor, otherItems);
                    }
                }
            })
            console.log(otherItems);
            $('#addInfo').html("<div id='itemlist'> 此外，还有其他对本装备生效的因素包括：</div>");
            otherItems.forEach(oi => {
                $('#addInfo div#itemlist').append("<span>" + oi + "</span>");
            })

        }
        if (impacting != undefined) {
            impacting.forEach(element => {
                $('td.name:contains(' + element + ')').parent().addClass('impacting');

            })
        }
    }

};