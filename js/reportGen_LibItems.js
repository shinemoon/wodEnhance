
function genLibPage(dat) {
    var tommyList = ParseTreasure(dat);
    console.info(tommyList);
    var tableHtml = displayInventoryTable(tommyList);
    $('body').append(' <div id="buttonList" style="margin-top:20px;margin-bottom:20px;padding-top:10px;padding-bottom:10px;background:rgba(0,0,0,0.1);"> \
                                                <div id="exportbutton" class="elegant-button"> 导出BBCODE</div> \
                                         </div > ');
    $('body').append(tableHtml);

    $('#inventory').DataTable({
        fixedHeader: {
            header: true,
            footer: true
        },
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    let column = this;
                    if ([0,1,4,5,6].includes(column.index()) ){
                        // Create select element
                        let select = document.createElement('select');
                        select.add(new Option(''));
                        column.footer().replaceChildren(select);
                        // Apply listener for user change in value
                        select.addEventListener('change', function () {
                            var val = DataTable.util.escapeRegex(select.value);
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });
                        // Add list of options
                        column
                            .data()
                            .unique()
                            .sort()
                            .each(function (d, j) {
                                select.add(new Option(d));
                            });
                    };
                });
        }
    });

    $('#exportbutton').click(function () {
        var exportBB = bbcode_generate_CreateBB($('#inventory')[0], "", "", "")
            .replace(/^ \[table\]/, '[table border=1]')         //Set border
            .replace(/\[\/?(font|color|size)[^\]]*\]/g, '');        // Remove color size font
        //Handle the url
        // Regex to match the specified BBCode pattern
        var regex = /\[url=([^[\]]+)\]([^\]]+?)\s*(?:\!\s*)?(?:\(\d+\/\d+\)\s*)?\[\/url\]/g;

        // Replace with the desired format
        exportBB = exportBB.replace(regex, '[$1:$2]');


        $('#popupOverlay textarea').eq(0).val(exportBB);
        $("#popupOverlay").fadeIn();
    })

}

//-----------------------------------------------------------------------------
// "functionality" functions
//-----------------------------------------------------------------------------

function ParseTreasure(text) {
    var ret = new Object();
    ret.Treasury = new Object();
    ret.Consumables = new Object();

    var lines = text.split("\n");
    for (var i = 1; i < lines.length; ++i) {

        var data = lines[i].split(";");

        if (data.length < 8) continue;

        for (var j = 0; j < data.length; ++j) {
            data[j] = data[j].substring(1, data[j].length - 1);
        }

        var tmpData = { Name: data[0], Count: parseInt(data[1]), ClassType: ((data[5].split(","))[0]), FullClassType: data[5], Unique: data[6], Grafting: "" };
        // var tmpData = {Name:data[0], Count:parseInt(data[1]),ClassType:data[5], Unique:data[6], Grafting:""};
        if (data.length > 9) tmpData.Grafting = data[9];

        var ccount = data[2];
        var place = data[4];
        if (ccount.length > 0) {
            // consumables
            if (!ret.Consumables.hasOwnProperty(place)) ret.Consumables[place] = new Array();

            var count = ccount.split("/");
            tmpData.MaxCCount = parseInt(count[1]);
            tmpData.CCount = parseInt(count[0]) * tmpData.Count;

            var found = false;
            for (var j = 0; j < ret.Consumables[place].length; ++j) {
                if (tmpData.Name == ret.Consumables[place][j].Name && tmpData.MaxCCount == ret.Consumables[place][j].MaxCCount && tmpData.Grafting == ret.Consumables[place][j].Grafting) {
                    ret.Consumables[place][j].Count += tmpData.Count;
                    ret.Consumables[place][j].CCount += tmpData.CCount;
                    found = true;
                    break;
                }
            }

            if (!found) {
                ret.Consumables[place].push(tmpData);
            }
        } else {
            // treasury
            if (!ret.Treasury.hasOwnProperty(place)) ret.Treasury[place] = new Array();

            var hitpoints = data[3].split("/");
            if (hitpoints.length < 2) {
                tmpData.MaxHitpoints = undefined;
                tmpData.Hitpoints = undefined;
            } else {
                tmpData.MaxHitpoints = parseInt(hitpoints[1]);
                tmpData.Hitpoints = parseInt(hitpoints[0]);
            }

            var found = false;
            for (var j = 0; j < ret.Treasury[place].length; ++j) {
                if (tmpData.Name == ret.Treasury[place][j].Name && tmpData.Hitpoints == ret.Treasury[place][j].Hitpoints && tmpData.MaxHitpoints == ret.Treasury[place][j].MaxHitpoints && tmpData.Grafting == ret.Treasury[place][j].Grafting) {
                    ret.Treasury[place][j].Count += tmpData.Count;
                    found = true;
                    break;
                }
            }

            if (!found) {
                ret.Treasury[place].push(tmpData);
            }
        }
    }

    return ret;
}

// Render

function displayInventoryTable(inventory) {
    let table = '<table id="inventory">';
    table += '<thead><tr><th>耗材/非耗材</th><th>装备位</th><th>名称</th><th>数量</th><th>类型</th><th>唯一性</th><th>镶嵌孔</th><th>总使用次数</th><th>最大使用次数</th><th>耐久度</th><th>最大耐久度</th></tr></thead><tbody>';
    //table += '<tr><th>装备位</th><th>名称</th><th>数量</th><th>类型</th><th>唯一性</th><th>镶嵌孔</th><th>总使用次数</th><th>最大使用次数</th><th>耐久度</th><th>最大耐久度</th></tr>';

    for (let category in inventory) {
        for (let slot in inventory[category]) {
            for (let item of inventory[category][slot]) {
                table += `<tr>
                        <td>${category === 'Consumables' ? '耗材' : (category === 'Treasury' ? '非耗材' : '')}</td>
                        <td>${slot || '-'}</td>
                        <td><a href='item'>${item.Name || ''}</a></td>
                        <td>${item.Count || '-'}</td>
                        <td>${item.ClassType || '-'}</td>
                        <td>${item.Unique || '-'}</td>
                        <td>${item.Grafting || '-'}</td>
                        <td>${item.CCount || '-'}</td>
                        <td>${item.MaxCCount || '-'}</td>
                        <td>${item.Hitpoints || '-'}</td>
                        <td>${item.MaxHitpoints || '-'}</td>
                    </tr>`;
                /*
            table += `<tr>
                    <td>${slot || ''}</td>
                    <td><a href='item'>${item.Name || ''}</a></td>
                    <td>${item.Count || ''}</td>
                    <td>${item.ClassType || ''}</td>
                    <td>${item.FullClassType || '-'}</td>
                    <td>${item.Unique || ''}</td>
                    <td>${item.Grafting || ''}</td>
                    <td>${item.CCount || ''}</td>
                    <td>${item.MaxCCount || ''}</td>
                    <td>${item.Hitpoints || ''}</td>
                    <td>${item.MaxHitpoints || ''}</td>
                </tr>`;
                */
            }
        }
    }
    table += '<tfoot><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tfoot><tbody>';
    //table += '</tbody></table>';
    return table;
};