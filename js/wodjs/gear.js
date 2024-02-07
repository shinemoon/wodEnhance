//Add generate button
$('input[name="ok"').after('<input type="button" value="模拟" id="blockEmulator" class="button clickable blockEmulator">');

$('.blockEmulator').click(function () {
    Promise.all([loadLocalHeroAttributes(), loadHeroSkills(), loadHeroGear()])
        .then((dat) => {
            console.log(dat);
        });
});

