$(document).ready(function () {
    console.log("优化Profile")
    if (window.location.href.indexOf("hero/profile.php") >= 0) {
        $('#smarttabs__details_inner').on('mouseover', function () {
            // Remove resizer:
            $('textarea').off('mouseover');
            $('textarea').removeAttr('onmouseover');
            $('textarea').parent().removeClass('resizeable');
        }
        )
        $('#smarttabs__details_inner>table tr:first>td:first').append("<div class='button' id='gencard'>生成角色卡</div>");
        $('#gencard:not(.disabled)').click(function () {
            $('#gencard').addClass('disabled');
            $('#gencard').text("生成数据中");
            //Main function here
            Promise.all([loadLocalHeroAttributes(), loadHeroSkills(), loadHeroGear()])
                .then((dat) => {
                    console.log(dat);
                    chrome.runtime.sendMessage({ action: 'generateCharacterCard', data: dat}, response => {
                        //            console.log(response);
                    });

                    $('#gencard').removeClass('disabled');
                    $('#gencard').text("生成角色卡");
                })
                .catch((err) => console.error(err));
        })
    };
});