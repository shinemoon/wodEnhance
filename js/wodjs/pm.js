//Report
if (window.location.href.indexOf("pm.php") >= 0) {
    console.log("优化消息界面");
    dat = null;
    //Add Button
    $('.buttons_below_table input[name="refresh"]').after('<span id="calcValue" class="button clickable"  >获取交易信息</span>');

    $('#calcValue').click(function () {
        console.log("Fetch trade info");
        var pmlist = $(".content_table.mail >tbody > tr[class*=row]");
        var tradelist = [];
        pmlist.each((ind, element) => {
            let msgtitle = pmlist.eq(ind).find('td:nth-child(4)').text();
            const regex = /(\S+)\s*以\s*(\d+):gold:\s*卖给了\s*(\S+)/;
            const matchResult = msgtitle.match(regex);
            if (matchResult) {
                const itemName = matchResult[1]; // 提取物品名字
                const price = matchResult[2]; // 提取售价
                const buyer = matchResult[3]; // 提前买家
                tradelist.push({
                    name: itemName,
                    price: price,
                    incoming: Math.round(price*0.9),
                    timestamp:'',
                    buyer: buyer
                })
            }
        });
        console.log(tradelist);
        dat = tradelist;
        chrome.runtime.sendMessage({ action: 'calcTradeMsg', data: dat }, response => {
            //            console.log(response);
        });
    })
};
