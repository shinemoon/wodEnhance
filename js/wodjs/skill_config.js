//Report
if (window.location.href.indexOf("skillconfig.php") >= 0 || window.location.href.indexOf("hero/skillconf") >= 0) {
    console.log("优化配置界面");
    var confighint = $('div:contains("这些提示会显示在物品装备页面。"):last').parent().find('textarea').val();
    var newDiv = $("<div class='message_info'>").html(confighint.replace(/\n/g, '<br>'));
    // Insert the new div after the ul with class wod-tabs
    $("ul.wod-tabs:nth-child(1)").after(newDiv);
};
