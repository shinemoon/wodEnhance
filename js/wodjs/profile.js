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
    };
});