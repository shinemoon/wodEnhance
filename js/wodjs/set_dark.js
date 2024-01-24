const str = `<style id="offLight">html{filter: invert(0.9);}img {filter: invert(1);}</style>`
function goDark() {
    $("head").prepend(
        str
    );
    $('body').addClass('dark');
}

goDark();
