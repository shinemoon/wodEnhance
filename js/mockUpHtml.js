function genHtmlfromJson(inputJson) {
    console.log(inputJson);
    var htmlStub = $("<div id='generatedTop'></div>")
    htmlStub.append("<h1>"+inputJson[0].setTitle+"</h1>")
    htmlStub.append("<h2>一般设置</h2>")
    htmlStub.append("<div class='general layerSettings'> </div>")
    htmlStub.append("<h2> 缺省设置</h2>")
    htmlStub.append("<div class='default layerSettings'> </div>")
    htmlStub.append("<h2>分层设置</h2>")
    htmlStub.append("<div class='sublayer layerSettings'> </div>")
    // - Position, Def, Order
    htmlStub.find('.general').append("<div class='position'>"+inputJson[0].position+"</div>")
    console.log(htmlStub);
    var ret = "";
    return ret;
}