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
 * 以下が対応もしくは認識するセレクタの一覧(CSS1, CSS2, CSS3, CSS4の一部 + 独自セレクタ)
 * *
 * E
 * E[foo]
 * E[foo="bar"]
 * E[foo="bar" i]
 * E[foo~="bar"]
 * E[foo^="bar"]
 * E[foo$="bar"]
 * E[foo*="bar"]
 * E[foo|="en"]
 * E:root
 * E:empty
 * E:nth-child(n)
 * E:nth-last-child(n)
 * E:nth-of-type(n)
 * E:nth-last-of-type(n)
 * E:last-child
 * E:first-of-type
 * E:last-of-type
 * E:only-child
 * E:only-of-type
 * E:column(selector)
 * E:nth-column(n)
 * E:nth-last-column(n)
 * E:dir(ltr)
 * E:lang(fr)
 * E:any-link
 * E:link
 * E:visited
 * E:local-link
 * E:local-link(0)
 * E:target
 * E:scope
 * E:active
 * E:hover
 * E:focus
 * E:enabled
 * E:disabled
 * E:checked
 * E:indeterminate
 * E:required
 * E:optional
 * E:read-only
 * E:read-write
 * E::first-line
 * E::first-letter
 * E::before
 * E::after
 * E.warning
 * E#myid
 * E:not(s)
 * E:not(s1, s2)
 * E:matches(s1, s2)
 * E F
 * E > F
 * E + F
 * E ~ F
 * E! > F
 * E:-jeeel-hidden
 * E:-jeeel-visible
 * E:-jeeel-animated
 * ただし、:link, :visitedはセキュリティ上の理由でJSから取得する手段が無いためCSSと違った挙動をし、::before, ::after, ::first-line, ::first-letterは完全に無視される。
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
        
        this._resetCaches();
        
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
        var nodeLists = this._nodeLists;
        
        var i, l = 0, res = [];
        
        for (i = nodeLists.length; i--;) {
            res[i] = [];

            if (l < nodeLists[i].length) {
                l = nodeLists[i].length;
            }
            
            nodeLists[i].init([root]);
        }
        
        while (l--) {
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
     * 指定した要素のリストをソーティングし、且重複を削除する
     * 
     * @param {Element} root ルートノード
     * @param {Element[]} elements 要素リスト
     * @return {Element[]} ソート・フィルタ後の要素リスト
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
    },
    
    _resetCaches: function () {
        Jeeel._Object.JeeelDomSelector.resetCache();
    }
};

/**
 * @private
 */
Jeeel._Object.JeeelDomSelector = {
    _caches: [],
    
    resetCache: function () {
        this._caches = [];
    },
    
    getSameCellCols: function (cell, reverse) {
        var name;

        var cells;
        
        var owner = cell.parentNode;
        var i, j;
        
        while (true) {
            name = owner.nodeName.toUpperCase();
            
            if (name === 'THEAD' || name === 'TBODY' || name === 'TFOOT') {
                break;
            }
            
            owner = owner.parentNode;
        }
        
        for ( i = this._caches.length; i--;) {
            if (this._caches[i].key === owner) {
                cells = this._caches[i].val;
            }
        }
        
        if ( ! cells) {
            cells = this._analyzeCells(owner);
        }
        
        var res = [];
        
        for (i = cells.length; i--;) {
            for (j = cells[i].length; j--;) {
                if (cells[i][j] === cell) {
                    
                    res.push(reverse ? cells[i].length - j : j + 1);
                }
            }
        }
        
        this._caches.push({
            key: owner,
            val: cells
        });
        
        return res;
    },
    
    _analyzeCells: function (owner) {
        var cells = [];

        var tr = owner.firstChild;
        var rowLen = 0, cell, name, i, j;

        while (tr) {
            if (tr.nodeName.toUpperCase() === 'TR') {

                if ( ! cells[rowLen]) {
                    cells[rowLen] = [];
                }

                cell = tr.firstChild;

                var row = rowLen, col = 0;

                while (cell) {
                    name = cell.nodeName.toUpperCase();

                    if (name === 'TD' || name === 'TH') {

                        while(cells[row] && cells[row][col]) {
                            col++;
                        }

                        for (i = cell.rowSpan; i--;) {
                            for (j = cell.colSpan; j--;) {

                                if ( ! cells[row + i]) {
                                    cells[row + i] = [];
                                }

                                if ( ! cells[row + i][col + j]) {
                                    cells[row + i][col + j] = cell;
                                }
                            }
                        }

                        col += cell.colSpan;
                    }

                    cell = cell.nextSibling;
                }

                rowLen++;
            }

            tr = tr.nextSibling;
        }
        
        return cells;
    }
};

Jeeel.file.Jeeel.Dom.Selector = ['Compiler', 'NodeList', 'Node', 'Mock'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Selector, Jeeel.file.Jeeel.Dom.Selector);
