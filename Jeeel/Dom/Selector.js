Jeeel.directory.Jeeel.Dom.Selector = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Selector/';
    }
};

/**
 * コンストラクタ
 *
 * @class セレクタを扱うクラス
 * @param {String} selector CSSセレクタ
 * @example
 * 以下が対応もしくは認識するセレクタの一覧
 * *
 * E
 * E[foo]
 * E[foo="bar"]
 * E[foo~="bar"]
 * E[foo^="bar"]
 * E[foo$="bar"]
 * E[foo*="bar"]
 * E[foo|="en"]
 * E:root
 * E:nth-child(n)
 * E:nth-last-child(n)
 * E:nth-of-type(n)
 * E:nth-last-of-type(n)
 * E:first-child
 * E:last-child
 * E:first-of-type
 * E:last-of-type
 * E:only-child
 * E:only-of-type
 * E:empty
 * E:link
 * E:visited
 * E:active
 * E:hover
 * E:focus
 * E:target
 * E:lang(fr)
 * E:enabled
 * E:disabled
 * E:checked
 * E:first-line
 * E:first-letter
 * E:before
 * E:after
 * E.warning
 * E#myid
 * E:not(s)
 * E F
 * E > F
 * E + F
 * E ~ F
 * ただし、:link, :visitedはセキュリティ上の理由でCSSと違った挙動をし、:before, :after, :first-line, :first-letterは完全に無視される。
 * また、:active, :hover, :focusは今のところ全て空になる
 */
Jeeel.Dom.Selector = function (selector) {
    this._selector = selector;
    
    this._compile();
};

/**
 * インスタンスの作成を行う
 *
 * @param {String} selector CSSセレクタ
 * @return {Jeeel.Dom.Selector} 作成したインスタンス
 */
Jeeel.Dom.Selector.create = function (selector) {
    return new this(selector);
};

Jeeel.Dom.Selector.prototype = {

    /**
     * CSSセレクタ
     *
     * @type String
     * @private
     */
    _selector: '',

    /**
     * CSSセレクタの対象別リスト
     *
     * @type Jeeel.Dom.Selector.NodeList[]
     * @private
     */
    _nodeLists: [],

    /**
     * セレクタの情報からElementのリストを得る
     *
     * @param {Element} root 検索ルート要素
     * @return {Element[]} Elementリスト
     */
    search: function (root) {
        
        if (Jeeel.Type.isDocument(root)) {
            root = root.documentElement;
        }
        
        if (root.uniqueID) {
            return this._quickSearch(root);
        }
        
        return this._search(root);
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Selector,
    
    /**
     * 通常検索を行う
     * 
     * @param {Element} root 検索のルートノード
     * @return {Element[]} 検索結果のリスト
     */
    _search: function (root) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        var nodeLists = this._nodeLists;
        
        var i, l = 0, res = [];
        
        for (i = nodeLists.length; i--;) {
            res[i] = [];
        }
        
        var search = function (target) {
            
            for (var i = nodeLists.length; i--;) {
                if (nodeLists[i][0].isMatch(target)) {
                    res[i].push(target);
                }
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    search(child);
                }

                child = child.nextSibling;
            }
        };
      
        search(root);
        
        for (i = nodeLists.length; i--;) {
            
            if (l < nodeLists[i].length) {
                l = nodeLists[i].length;
            }
            
            nodeLists[i].init(nodeLists[i][0].filter(res[i]));
        }
        
        while (--l) {
            for (i = nodeLists.length; i--;) {
                res[i] = nodeLists[i].search();
                
                nodeLists[i].next();
            }
        }
        
        var tmp = res;
        
        res = [];
        
        for (i = nodeLists.length; i--;) {
            res = tmp[i].concat(res);
        }

        return this._uniqueSort(root, res);
    },
    
    /**
     * IEのuniqueIDを使用して検索速度を速めた検索を行う(正確にはソーティングを高速化する)
     * 
     * @param {Element} root 検索のルートノード
     * @return {Element[]} 検索結果のリスト
     */
    _quickSearch: function (root) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        var nodeLists = this._nodeLists;
        
        var idx = 0, indexes = {};
        var i, l = 0, res = [];
        
        for (i = nodeLists.length; i--;) {
            res[i] = [];
        }
        
        var search = function (target) {
            
            indexes[target.uniqueID] = idx++;
            
            for (var i = nodeLists.length; i--;) {
                if (nodeLists[i][0].isMatch(target)) {
                    res[i].push(target);
                }
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    search(child);
                }

                child = child.nextSibling;
            }
        };
      
        search(root);
        
        for (i = nodeLists.length; i--;) {
            
            if (l < nodeLists[i].length) {
                l = nodeLists[i].length;
            }
            
            nodeLists[i].init(nodeLists[i][0].filter(res[i]));
        }
        
        while (--l) {
            for (i = nodeLists.length; i--;) {
                res[i] = nodeLists[i].search();
                
                nodeLists[i].next();
            }
        }
        
        var tmp = res;
        
        res = [];
        
        for (i = nodeLists.length; i--;) {
            res = tmp[i].concat(res);
        }
        
        res.sort(function (a, b) {
            var aIdx = indexes[a.uniqueID], bIdx = indexes[b.uniqueID];
            
            if (aIdx < bIdx) {
                return -1;
            } else if (aIdx > bIdx) {
                return 1;
            }
            
            return 0;
        });
        
        tmp = res;
        
        res = [];
        
        var belm;
        
        for (i = 0, l = tmp.length; i < l; i++) {
            if (belm !== tmp[i]) {
                res.push(tmp[i]);
            }
            
            belm = tmp[i];
        }
        
        return res;
    },
    
    /**
     * 指定した要素のリストをソーティングし、且重複を削除してする
     * 
     * @param {Element} root ルートノード
     * @param {Element[]} elements 要素リスト
     * @param {Element[]} ソート・フィルタ後の要素リスト
     */
    _uniqueSort: function (root, elements) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        var i, l, p, cnt, element, nodes = [];
        var idxLength = 0;
        
        for (i = 0, l = elements.length; i < l; i++) {
            element = elements[i];
            nodes[i] = {
                node: element,
                idxs: []
            };
            
            while (element && element !== root) {
                p = element.previousSibling;
                cnt = 1;

                while (p) {
                    if (p.nodeType === nodeType) {
                        cnt++;
                    }

                    p = p.previousSibling;
                }

                nodes[i].idxs.push(cnt);
                
                element = element.parentNode;
            }
            
            nodes[i].idxs.reverse();
            
            if (idxLength < nodes[i].idxs.length) {
                idxLength = nodes[i].idxs.length;
            }
        }
        
        nodes.sort(function (a, b) {
            var aidxs = a.idxs;
            var bidxs = b.idxs;
            
            for (var i = 0; i < idxLength; i++) {
                if ( ! aidxs[i] && ! bidxs[i]) {
                    break;
                } else if ( ! aidxs[i]) {
                    return -1;
                } else if ( ! bidxs[i]) {
                    return 1;
                }
                
                if (aidxs[i] < bidxs[i]) {
                    return -1;
                } else if (aidxs[i] > bidxs[i]) {
                    return 1;
                }
            }
            
            return 0;
        });
        
        var belm, res = [];
        
        for (i = 0, l = nodes.length; i < l; i++) {
            
            if (belm !== nodes[i].node) {
                res.push(nodes[i].node);
            }
            
            belm = nodes[i].node;
        }
        
        return res;
    },

    /**
     * CSSセレクタから対象となるDataのリストを作成する
     *
     * @private
     */
    _compile: function () {
        this._nodeLists = this.constructor.Compiler.compile(this._selector);
    }
};

Jeeel.file.Jeeel.Dom.Selector = ['Compiler', 'NodeList', 'Node', 'Mock'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Selector, Jeeel.file.Jeeel.Dom.Selector);
