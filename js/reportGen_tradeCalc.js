
function genTradePage(dat) {
    let summaryHtml="";
    let summaryBB="";
    let tradeList = dat;
    var tableHtml = displayTradeTable(tradeList);

    $('body').append(' <div id="buttonList" style="margin-top:20px;margin-bottom:20px;padding-top:10px;padding-bottom:10px;background:rgba(0,0,0,0.1);"> \
                                                <div id="exportbutton" class="elegant-button"> 导出BBCODE</div> \
                                         </div > ');
    $('body').append(tableHtml);
    $('#inventory').DataTable({
        "oLanguage": {
            "sLengthMenu": 'Display <select>' +
                '<option value="10">10</option>' +
                '<option value="50">50</option>' +
                '<option value="100">100</option>' +
                '<option value="150">150</option>' +
                '<option value="200">200</option>' +
                '<option value="300">300</option>' +
                '<option value="400">400</option>' +
                '<option value="500">500</option>' +
                '<option value="-1">All</option>' +
                '</select> records'
        },
        "iDisplayLength": 200,
        fixedHeader: {
            header: true,
            footer: true
        },
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    let column = this;
                    if ([0, 1].includes(column.index())) {
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
                                select.add(new Option($(d).text()));
//                                select.add(new Option(d));
                            });
                    };
                });
        },
        footerCallback: function (row, data, start, end, display) {
            let api = this.api();
            // Remove the formatting to get integer data for summation
            let intVal = function (i) {
                return typeof i === 'string'
                    ? i.replace(/[\$,]/g, '') * 1
                    : typeof i === 'number'
                        ? i
                        : 0;
            };
            // Total over all pages
            total = api
                .column(3)
                .data()
                .reduce((a, b) => intVal(a) + intVal(b), 0);

            // Total over this page
            pageTotal = api
                .column(3, { page: 'current' })
                .data()
                .reduce((a, b) => intVal(a) + intVal(b), 0);

            // Update footer
            summaryHtml = 
                '总收入：<u>' + pageTotal + ' / ' + total + ' (' + Math.round((pageTotal / total) * 100) + '%)</u>';
            summaryBB = 
                '[b]总收入：[u]' + pageTotal + ' / ' + total + ' (' + Math.round((pageTotal / total) * 100) + '%)[/u][/b]';

            api.column(3).footer().innerHTML = summaryHtml;
        }
    });

    $('#exportbutton').click(function () {
        var exportBB = bbcode_generate_CreateBB($('#inventory')[0], "", "", "")
            .replace(/^ \[table\]/, '[table border=1]')         //Set border
            .replace(/\[\/?(font|color|size)[^\]]*\]/g, '');        // Remove color size font
        exportBB = exportBB.replace(/\[url=(.*item\.php.*?)\](.*?)\[\/url\]/g, '[item:$2]');
        exportBB = exportBB.replace(/\[url=(.*profile\.php.*?)\](.*?)\[\/url\]/g, '[hero:$2]');
        exportBB = exportBB.replace(/\[tr\]((?:(?!\[\/tr\]).|\n)*)\[td rowspan=1\]((?:(?!\[\/td\]).|\n)*)\[\/td\]((?:(?!\[\/tr\]).|\n)*)\[\/tr\]/g, '');
        exportBB = exportBB + '\n' +summaryBB;

        $('#popupOverlay textarea').eq(0).val(exportBB);
        $("#popupOverlay").fadeIn();
    })

};


function displayTradeTable(inventory) {
    let table = '<table id="inventory">';
    table += '<thead><tr><th>物品</th><th>卖家</th><th>售价</th><th>收入</th></tr></thead><tbody>';

    for (let i in inventory) {
        console.log(inventory[i]);
        let item = inventory[i];
        table += `<tr>
                        <td><a href='https://delta.world-of-dungeons.org/wod/spiel/hero/item.php?name=${item.name || ''}&IS_POPUP=1&is_popup=1'>${item.name || ''}</a></td>
                        <td><a href='https://delta.world-of-dungeons.org/wod/spiel/hero/profile.php?name=${item.buyer || ''}&IS_POPUP=1&is_popup=1'>${item.buyer || ''}</a></td>
                        <td>${item.price || '-'}</td>
                        <td>${item.incoming || '-'}</td>
                    </tr>`;
    }
    table += '<tfoot><tr><td></td><td></td><td></td><td></td></tr></tfoot><tbody>';
    return table;
};