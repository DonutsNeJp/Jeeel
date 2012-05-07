Jeeel.directory.Jeeel.Gui.Tree.Node = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Gui.Tree + 'Node/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 階層構造のノードクラス
 */
Jeeel.Gui.Tree.Node = function (body, icon, data) {
    
    this._body = body || 'Nothing';
    this._icon = icon || null;
    this._data = data || null;
    this._children = [];
    
    this._init();
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Gui.Tree.Node} 作成したインスタンス
 */
Jeeel.Gui.Tree.Node.create = function (body, data) {
    return new this(body, data);
};

Jeeel.Gui.Tree.Node.prototype = {
    
    _parent: null,
    _node: null,
    _body: null,
    _icon: null,
    _data: null,
    
    _nodeOwner: null,
    _childrenOwner: null,
    _bodyOwner: null,
    
    /**
     * 子要素のリスト
     * 
     * @type Jeeel.Gui.Tree.Node[]
     * @private
     */
    _children: [],
    
    /**
     * 内部で使用している要素を取得する
     * 
     * @return {Element} 要素
     */
    getNode: function () {
        return this._node;
    },
    
    /**
     * 要素のボディを取得する
     * 
     * @return {Node[]} ボディ
     */
    getBody: function () {
        return this._body;
    },
    
    /**
     * 要素のボディを設定する
     * 
     * @param {String|String[]|Node|Node[]} body ボディ
     * @return {Jeeel.Gui.Tree.Node} 自インスタンス
     */
    setBody: function (body) {
        
        body = this._formatBody(body);
        
        this._body = body;
        
        this._bodyOwner
            .clearChildNodes()
            .appendChild(body);
        
        return this;
    },
    
    /**
     * この要素に紐付けられているデータを取得する
     * 
     * @return {Mixed} データ
     */
    getData: function () {
        return this._data;
    },
    
    /**
     * 親ノードを取得する
     * 
     * @return {Jeeel.Gui.Tree.Node} 親ノード
     */
    getParent: function () {
        return this._parent;
    },
    
    /**
     * 子ノードリストを取得する
     * 
     * @return {Jeeel.Gui.Tree.Node[]} 子ノードリスト
     */
    getChildren: function () {
        return this._children;
    },
    
    /**
     * 最初に追加した子ノードを取得する
     * 
     * @return {Jeeel.Gui.Tree.Node} 最初の子ノード
     */
    getFirstChild: function () {
        return this._children[0] || null;
    },
    
    /**
     * 最後に追加した1子ノードを取得する
     * 
     * @return {Jeeel.Gui.Tree.Node} 最後の子ノード
     */
    getLastChild: function () {
        return this._children[this._children.length - 1] || null;
    },
    
    /**
     * 子要素を追加する
     * 
     * @param {Jeeel.Gui.Tree.Node} node 追加要素
     * @return {Jeeel.Gui.Tree.Node} 自インスタンス
     */
    appendChild: function (node) {
        var tr = Jeeel.Document.createElement('tr');
        var th = Jeeel.Document.createElement('th');
        var td = Jeeel.Document.createElement('td');
        
        this._childrenOwner.appendChild(tr);
        
        tr.appendChild(th);
        tr.appendChild(td);
        
        td.colSpan = 2;
        
        td.appendChild(node.getNode());
        
        this._children.push(node);
        
        node._parent = this;
        
        return this;
    },
    
    /**
     * 子要素を取り除く
     * 
     * @param {Jeeel.Gui.Tree.Node} node 取り除く要素
     * @return {Jeeel.Gui.Tree.Node} 自インスタンス
     */
    removeChild: function (node) {
        for (var i = this._children.length; i--;) {
            if (this._children[i] === node) {
                var tr = node.getNode().parentNode.parentNode;
                
                this._childrenOwner.removeChild(tr);
                
                this._children.splice(i, 1);
                
                node._parent = null;
                
                break;
            }
        }
        
        return this;
    },
    
    /**
     * 子ノードの数を取得する
     * 
     * @return {Integer} 子ノードの数
     */
    getDegree: function () {
        return this._children.length;
    },
    
    /**
     * 子要素を開閉する
     * 
     * @return {Jeeel.Gui.Tree.Node} 自インスタンス
     */
    toggle: function () {
        var disp = this._childrenOwner.getCss('display');
        var img;
        
        if (disp === 'none') {
            img = this._nodeOwner.$CLASS(Jeeel.Gui.Tree.CLASS.BUTTON).get(0);
            img.src = Jeeel.directory.Jeeel.Gui.Tree.Node + 'images/minus.gif';
            
//            img = this._nodeOwner.$CLASS(Jeeel.Gui.Tree.CLASS.DIRECTORY).get(0);
//            
//            img.src = Jeeel.directory.Jeeel.Gui.Tree + '_open/00.ico';
        } else {
            img = this._nodeOwner.$CLASS(Jeeel.Gui.Tree.CLASS.BUTTON).get(0);
            img.src = Jeeel.directory.Jeeel.Gui.Tree.Node + 'images/plus.gif';
            
//            img = this._nodeOwner.$CLASS(Jeeel.Gui.Tree.CLASS.DIRECTORY).get(0);
//            
//            img.src = Jeeel.directory.Jeeel.Gui.Tree + '_close/00.ico';
        }
        
        this._childrenOwner.toggle();
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Gui.Tree.Node,
    
    /**
     * ノード内のデータを返す
     * 
     * @return {Mixied} データ
     */
    valueOf: function () {
        return this._data;
    },
    
    _formatBody: function (body) {
        if (Jeeel.Type.isString(body)) {
            return [Jeeel.Document.createTextNode(body)];
        }
        else if (Jeeel.Type.isNode(body)) {
            return [body];
        }
        else if ( ! Jeeel.Type.isHash(body)) {
            return [];
        }
        else if ( ! Jeeel.Type.isArray(body)) {
            body = Jeeel.Hash.getValues(body);
        }
        
        var tmp, res = [];
        
        for (var i = body.length; i--;) {
            if (Jeeel.Type.isNode(body[i])) {
                res[i] = body[i];
            } else {
                tmp = this._formatBody(body[i]);
                res = res.concat(tmp);
            }
        }
        
        return res;
    },

    _init: function () {
        var table = Jeeel.Document.createElement('table');
        var thead = Jeeel.Document.createElement('thead');
        var tbody = Jeeel.Document.createElement('tbody');
        
        table.appendChild(thead);
        table.appendChild(tbody);
        
        tbody.style.display = 'none';
        
        this._nodeOwner = new Jeeel.Dom.ElementOperator(thead);
        this._childrenOwner = new Jeeel.Dom.ElementOperator(tbody);
        
        var tr = Jeeel.Document.createElement('tr');
        var th = Jeeel.Document.createElement('th');
        var td = Jeeel.Document.createElement('td');
        
        thead.appendChild(tr);
        
        tr.appendChild(th);
        
        var img = Jeeel.Document.createElement('img');
        
        img.src = Jeeel.directory.Jeeel.Gui.Tree + 'plus.gif';
        img.className = Jeeel.Gui.Tree.CLASS.BUTTON;
        
        Jeeel.Dom.Event.addEventListener(img, Jeeel.Dom.Event.Type.CLICK, this.toggle, this);

        th.appendChild(img);
        
        th = Jeeel.Document.createElement('th');
        tr.appendChild(th);
        
        tr.appendChild(td);
        
        this._bodyOwner = new Jeeel.Dom.ElementOperator(td);

        img = Jeeel.Document.createElement('img');
        
        img.src = this._icon;
        img.width = 18;
        img.height = 18;
        
        img.className = [Jeeel.Gui.Tree.CLASS.ICON, Jeeel.Gui.Tree.CLASS.DIRECTORY].join(' ');
        
        th.appendChild(img);
        
        this.setBody(this._body);
        
        table.className = Jeeel.Gui.Tree.CLASS.NODE;
        
        this._node = table;
    }
};

Jeeel.file.Jeeel.Gui.Tree.Node = ['File'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Gui.Tree.Node, Jeeel.file.Jeeel.Gui.Tree.Node);
