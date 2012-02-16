
Jeeel.Dom.Selector.Searcher = function (doc) {
    this._doc = doc || Jeeel.Document;
};

Jeeel.Dom.Selector.Searcher.prototype = {
    _doc: null,
    _matchers: [],
    _datas: [],
    
    addSelector: function (selector) {
        selector = selector.replace(/(^ +|\r\n|\n| +$)/g, ' ')
                          .replace(/ *, */, ',')
                          .replace(/ *> */, '>')
                          .replace(/ *\+ */, '+')
                          .replace(/ +/, ' ');
                          
        var css = selector.split(',');
        
        for (var i = 0, l = css.length; i < l; i++) {
            this._matchers[this._matchers.length] = new Jeeel.Dom.Selector.Matcher(css[i]);
        }
    },
    
    search: function (root) {
        var i, l = this._datas.length;
        var stack = [];
        var res = [];
        var node = root || this._doc.getDocumentElement();
        
        while (true) {

            while (node) {
                stack.push(node);
                
                for (i = 0; i < l; i++) {
                    if (this._datas[i].match(node)) {
                        res[res.length] = node;
                    }
                }
                
                node = node.firstChild;
            }

            node = stack.pop();
            
            if ( ! stack.length) {
                break;
            }
            
            node = node.nextSibling;
        }
    }
};