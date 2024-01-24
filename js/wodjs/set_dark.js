const str = `<style id="offLight">html{filter: invert(0.9);}img {filter: invert(1);}</style>`
$("head").prepend(
    str
);
$('body').addClass('dark');