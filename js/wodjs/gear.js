//Add generate button
$('input[name="ok"').after('<input type="button" value="模拟" id="blockEmulator" class="button clickable blockEmulator">');

$('.blockEmulator').click(function () {
    $('.blockEmulator').addClass('disabled');
    $('.blockEmulator').attr('value', '数据生成中');
    Promise.all([loadLocalHeroAttributes(), loadHeroSkills(), loadHeroGear()])
        .then((dat) => {
            console.log(dat);

            $('.blockEmulator').removeClass('disabled');
            $('.blockEmulator').attr('value', '模拟');

        });
});

