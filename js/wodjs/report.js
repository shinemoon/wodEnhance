//Report
if (window.location.href.indexOf("report.php") >= 0) {
    console.log("优化战报界面");
    //let user = $('.hero_short tr:nth-child(1) td:nth-child(1) a:nth-child(3)').text();
    let user = $('.font_Hero_Name').text();
    $('body').append("<div id='showOff'>S</div>")
    //高亮本人战报
    $('.content_table table').css('width', '100%');
    $('.rep_status_table tr:contains("' + user + '")').css('background', '#b8c35070');
    $('.rep_status_table~hr~table:not(.rep_status_table) tr:contains("' + user + '")').css('color', 'blue').css('background', '#b8c35070').css('font-size', '1.4em');
    $('.rewards:contains("' + user + '")').css('background', '#34b54b33');
    $('#showOff').click(function () {
        $('.rep_status_table tr:not(:contains("' + user + '"))').toggle();
        $('.rep_status_table~hr~table:not(.rep_status_table) tr:not(:contains("' + user + '"))').toggle();
        $('.rewards:not(:contains("' + user + '"))').toggle();
    });
};
