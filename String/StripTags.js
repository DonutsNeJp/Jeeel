
/**
 * HTML文字列からタグ文字を全て取り除く
 *
 * @param {String} html HTML文字列
 * @return {String} タグを取り除いた文字列
 */
Jeeel.String.stripTags = function (html) {

//    return html.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');

    var nodes = {childNodes: Jeeel.Document.createNodeList(html)};

    var res = [];
    var txt = Jeeel.Dom.Node.TEXT_NODE;

    function _search(target) {
        if (target.nodeType === txt) {
            res[res.length] = target.data;
        }

        for (var i = 0, l = target.childNodes.length; i < l; i++) {
            _search(target.childNodes[i]);
        }
    }

    _search(nodes);

    return res.join('');
};
