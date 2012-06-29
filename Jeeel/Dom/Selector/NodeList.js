
/**
 * コンストラクタ
 * 
 * @class セレクタの1つのグループを管理するクラス
 * @param {String} selector セレクタ
 */
Jeeel.Dom.Selector.NodeList = function (selector) {
    this.selector = selector;
    
    this.constructor.caches[selector] = this;
};

/**
 * インスタンスキャッシュ
 * 
 * @type Hash
 */
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
    
    /**
     * 検索対象となるノードのインデックス
     * 
     * @type Integer
     */
    targetIndex: -1,
    
    /**
     * 検索結果の要素リスト
     * 
     * @type Element[]
     * @private
     */
    _elements: null,
    
    /**
     * 検索結果の要素リストの履歴
     * 
     * @type Element[]
     * @private
     */
    _histories: null,
    
    /**
     * 現在の実行ノードのインデックス
     * 
     * @type Integer
     * @private
     */
    _currentIndex: 0,
    
    /**
     * 初期化を行う
     * 
     * @param {Element[]} elements 要素リスト
     * @return {Jeeel.Dom.Selector.NodeList} 自インスタンス
     */
    init: function (elements) {
        this._elements = elements;
        this._histories = [];
        this._currentIndex = 0;
        
        return this;
    },
    
    /**
     * 次の要素単位に移る
     * 
     * @return {Jeeel.Dom.Selector.NodeList} 自インスタンス
     */
    next: function () {
        this._currentIndex++;
        
        return this;
    },
    
    /**
     * 現在の要素位置で検索を行い検索結果を返す
     * 
     * @return {Element[]} 要素リスト
     */
    search: function () {
        if (this.length <= this._currentIndex) {
            return this._elements;
        }
        
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        var i, l, res = [], node = this[this._currentIndex];
        var tmp, history = [];
        var targetIndex = this.targetIndex;
        
        var search = function (target, f) {
            if ( ! f && node.isMatch(target)) {
                res.push(target);
                
                if (targetIndex >= 0) {
                    history.push({
                        idx: i,
                        elm: target
                    });
                }
                
                if (node.isOnlyNode) {
                    return;
                }
            } else if ( ! f && res.length && node.isOnlyNode) {
                return;
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
                    
                case 'reference':
                    break;
            }
        };
        
        for (i = 0, l = this._elements.length; i < l; i++) {
            search(this._elements[i], true);
        }
        
        this._elements = res;
        
        if (targetIndex >= 0) {
            this._histories.push(history);

            var j = this._currentIndex;

            while (targetIndex < j--) {
                history = this._histories[j + 1];

                tmp = [];
                
                var map = {};

                for (i = 0, l = history.length; i < l; i++) {
                  
                    if (map[history[i].idx]) {
                        history[i].idx = map[history[i].idx];
                    } else {
                        tmp.push(this._histories[j][history[i].idx]);
                        
                        map[history[i].idx] = history[i].idx = tmp.length - 1;
                    }
                }

                this._histories[j] = tmp;
            }

            if (this._currentIndex === this.length - 1) {
                for (i = 0; i < this.length; i++) {
                    if (this[i].isTarget) {
                        return this._convertHistory(this._histories[i]);
                    }
                }
            }
        }
        
        return this._elements;
    },
    
    _convertHistory: function (history) {
        var res = [];
        
        for (var i = history.length; i--;) {
            res[i] = history[i].elm;
        }
        
        return res;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Selector.NodeList
};