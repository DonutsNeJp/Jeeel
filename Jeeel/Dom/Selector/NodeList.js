
Jeeel.Dom.Selector.NodeList = function (selector) {
    this.selector = selector;
    
    this.constructor.caches[selector] = this;
};

Jeeel.Dom.Selector.NodeList.caches = {};

Jeeel.Dom.Selector.NodeList.prototype = {
    
    /**
     * 元のselector
     * 
     * @type String
     */
    selector: '',
    
    /**
     * 要素数
     * 
     * @type Integer
     */
    length: 0,
    
    _elements: null,
    
    _currentIndex: 0,
    
    init: function (elements) {
        this._elements = elements;
        this._currentIndex = 1;
        
        return this;
    },
    
    next: function () {
        this._currentIndex++;
        
        return this;
    },
    
    search: function () {
        if (this.length <= this._currentIndex) {
            return this._elements;
        }
        
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        var res = [], node = this[this._currentIndex];
        
        var search = function (target, f) {
            if ( ! f && node.isMatch(target)) {
                res.push(target);
            }

            var child;

            switch (node.relationType) {
              
                case 'default':
                    child = target.firstChild;
                    
                    while(child) {

                        if (child.nodeType === nodeType) {
                            search(child, false);
                        }

                        child = child.nextSibling;
                    }
                    break;
              
                case 'child':
                    child = target.firstChild;
                    
                    while(f && child) {

                        if (child.nodeType === nodeType) {
                            search(child, false);
                        }

                        child = child.nextSibling;
                    }
                    break;
                    
                case 'next':
                    child = target.nextSibling;
                    
                    while(f && child) {

                        if (child.nodeType === nodeType) {
                            search(child, false);
                            break;
                        }

                        child = child.nextSibling;
                    }
                    break;
                    
                case 'sbrother':
                    child = target.nextSibling;
                    
                    while(f && child) {

                        if (child.nodeType === nodeType) {
                            search(child, false);
                        }

                        child = child.nextSibling;
                    }
                    break;
            }
        };
        
        for (var i = 0, l = this._elements.length; i < l; i++) {
            search(this._elements[i], true);
        }
        
        this._elements = node.filter(res);
        
        return this._elements;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Selector.NodeList
};