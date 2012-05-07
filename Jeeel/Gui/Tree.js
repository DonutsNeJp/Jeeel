Jeeel.directory.Jeeel.Gui.Tree = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Gui + 'Tree/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 階層構造を表示するクラス
 * @param {Jeeel.DataStructure.Tree} [tree] 再現データ
 */
Jeeel.Gui.Tree = function (target, tree) {
    this._treeData = tree || new Jeeel.DataStructure.Tree();
    
    this._init(target);
};

Jeeel.Gui.Tree.create = function (target, tree) {
    return new this(target, tree);
};

Jeeel.Gui.Tree.initStyle = function () {
    if (this.initStyle.ignore) {
        return;
    }
    
    this.initStyle.ignore = true;
    
    var className = this.CLASS.TREE;
    var style = 'table.' + className + ' {\n'
              + '  border-spacing: 0;\n'
              + '  width: auto;\n'
              + '  height: auto;\n'
              + '  border: 1px solid #B6BAC0;\n'
              + '  background-color: #F9FAFC;\n'
              + '  overflow: hidden;\n'
              + '}\n'
              + 'table.' + className + ' th {\n'
              + '  padding: 0;\n'
              + '  margin: 0;\n'
              + '  width: 18px;\n'
              + '  height: 18px;\n'
              + '}\n'
              + 'table.' + className + ' .' + this.CLASS.NODE + ' {\n'
              + '  border-spacing: 0;\n'
              + '}\n'
              + 'table.' + className + ' img {\n'
              + '  padding: 0;\n'
              + '  margin: 0;\n'
              + '  vertical-align: middle;\n'
              + '}\n'
              + 'table.' + className + ' .' + this.CLASS.BUTTON + ' {\n'
              + '  cursor: pointer;\n'
              + '}';

    this._styleTag = Jeeel.Loader.addStyle(style);
};

Jeeel.Gui.Tree.CLASS = {
    TREE: 'jeeel-gui-tree',
    NODE: 'jeeel-gui-node',
    BUTTON: 'jeeel-gui-tree-button',
    ICON: 'jeeel-gui-tree-icon',
    DIRECTORY: 'jeeel-gui-tree-directory'
};

Jeeel.Gui.Tree.prototype = {
    
    /**
     * ルートノード
     * 
     * @type Jeeel.Gui.Tree
     * @private
     */
    _root: null,
    
    /**
     * ルートノードを取得する
     * 
     * @return {Jeeel.Gui.Tree.Node} ルートノード
     */
    getRoot: function () {
        return this._root;
    },
    
    /**
     * 新しくノードを生成する
     * 
     * @param {String|String[]|Node|Node[]} body ノードボディ
     * @param {Mixed} [data] データ
     * @return {Jeeel.Gui.Tree.Node} 生成ノード
     */
    createNode: function (body, data) {
        return new this.constructor.Node(body, data);
    },
    
    /**
     * ルートノードに対してノードを追加する
     * 
     * @param {Jeeel.Gui.Tree.Node} node 追加ノード
     * @return {Jeeel.Gui.Tree} 自インスタンス
     */
    appendToRoot: function (node) {
        this._root.appendChild(node);
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Gui.Tree,
    
    _init: function (target) {
        var node = new this.constructor.Node();
        var tree = node.getNode();
        
        tree.className = this.constructor.CLASS.TREE;
        
        (target || Jeeel.Document.getBody()).appendChild(tree);
        
        this._root = node;
        
        this.constructor.initStyle();
        
        this._styleTag = this.constructor._styleTag;
    }
};

Jeeel.Class.extend(Jeeel.Gui.Tree, Jeeel.Gui.Abstract);

Jeeel.file.Jeeel.Gui.Tree = ['Node'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Gui.Tree, Jeeel.file.Jeeel.Gui.Tree);
