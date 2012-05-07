Jeeel.directory.Jeeel.Dom.Xml = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Xml/';
    }
};

/**
 * コンストラクタ
 * 
 * @class XMLを簡単にアクセス可能にするクラス
 * @param {Document} xmlDocument XMLドキュメント
 * @throws {Error} xmlDocumentがXMLのドキュメントオブジェクトでない場合に発生
 */
Jeeel.Dom.Xml = function (xmlDocument) {
    this._init(xmlDocument);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Document} xmlDocument XMLドキュメント
 * @return {Jeeel.Dom.Xml} 作成したインスタンス
 * @throws {Error} xmlDocumentがXMLのドキュメントオブジェクトでない場合に発生
 */
Jeeel.Dom.Xml.create = function (xmlDocument) {
    return new this(xmlDocument);
};

/**
 * XMLを読み込んでインスタンスの作成を同期的行う
 * 
 * @param {String} url XMLのURL
 * @param {Hash} [params] XML取得の際にサーバーに渡すパラメータ
 * @return {Jeeel.Dom.Xml} 作成したインスタンス
 */
Jeeel.Dom.Xml.load = function (url, params) {
    var ajax = Jeeel.Net.Ajax.create(url)
                    .setAsynchronous(false)
                    .setAll(params || {})
                    .execute();
    
    return new this(ajax.getResponse().responseXML);
};

/**
 * XMLを読み込んでインスタンスの作成を非同期で行う
 * 
 * @param {String} url XMLのURL
 * @param {Function} callback 指定すると非同期読み込みになり引数にXMLが渡される<br />
 *                             void callback(Jeeel.Dom.Xml xml)
 * @param {Hash} [params] XML取得の際にサーバーに渡すパラメータ
 */
Jeeel.Dom.Xml.loadAsync = function (url, callback, params) {
  
    if ( ! callback) {
        return;
    }
  
    var ajax = Jeeel.Net.Ajax.create(url);
    
    ajax.setAll(params || {})
        .setSuccessMethod(function (response) {
            callback(new this(response.responseXML));
        }, this).execute();
};

Jeeel.Dom.Xml.prototype = {
    
    /**
     * XMLエンコーディング
     * 
     * @type String
     * @private
     */
    _encoding: '',
    
    /**
     * XMLバージョン
     * 
     * @type String
     * @private
     */
    _version: '',
    
    /**
     * XMLドキュメント
     * 
     * @type Document
     * @private
     */
    _doc: null,
    
    /**
     * ルートノード
     * 
     * @type Jeeel.Dom.Xml.Node
     * @private
     */
    _root: null,
    
    /**
     * この要素が持つ子要素リスト
     * 
     * @type Jeeel.Dom.Xml.Node[]
     * @private
     */
    _childNodes: [],
    
    /**
     * XMLのバージョンを取得する
     * 
     * @return {String} バージョン
     */
    getVersion: function () {
        return this._version;
    },
    
    /**
     * XMLのエンコーディングを取得する
     * 
     * @return {String} エンコーディング
     */
    getEncoding: function () {
        return this._encoding;
    },
    
    /**
     * ルートノードを取得する
     * 
     * @return {Jeeel.Dom.Xml.Node} ルートノード
     */
    getDocumentElement: function () {
        return this._root;
    },
    
    /**
     * この要素の子要素を全て取得する
     * 
     * @return {Jeeel.Dom.Xml.Node[]} 子要素リスト
     */
    getChildNodes: function () {
        return this._childNodes;
    },
    
    /**
     * 簡単なHashに変換して返す<br />
     * 変換対象はタグ・テキストのみである
     * 
     * @return {Hash} 変換後のHash
     */
    toHash: function() {
        var res = {};
        
        if (this._root) {
            res[this._root._name] = this._root.toHash();
        }
        
        return res;
    },
    
    /**
     * このXMLを文字列に変換して返す
     * 
     * @return {String} XML文字列
     */
    toString: function () {
        var header = '<?xml version="'
                   + this._version + '"'
                   + (this._encoding ? ' encoding="' + this._encoding + '"' : '')
                   + '?>\n';
        
        var children = [];
        
        for (var i = this._childNodes.length; i--;) {
            children[i] = this._childNodes[i].toXmlString();
        }
        
        return header
             + children.join('\n');
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Document} xmlDocument XMLドキュメント
     * @constructor
     */
    constructor: Jeeel.Dom.Xml,
    
    /**
     * 初期化
     * 
     * @param {Document} xmlDocument XMLドキュメント
     * @private
     */
    _init: function (xmlDocument) {
        delete this._init;
        
        if (xmlDocument.nodeType !== Jeeel.Dom.Node.DOCUMENT_NODE || Jeeel.Type.isEmpty(this._version)) {
            throw new Error('XMLドキュメントを指定して下さい。');
        }
        
        this._doc = xmlDocument;
        this._version  = xmlDocument.xmlVersion;
        this._encoding = xmlDocument.xmlEncoding;
        
        var root = xmlDocument.documentElement;
        var nodeName = root.nodeName;

        var nodes = xmlDocument.childNodes;
        
        for (var i = 0, l = nodes.length; i < l; i++) {
            this._childNodes[i] = new Jeeel.Dom.Xml.Node(nodes[i]);
            
            if (root === nodes[i]) {
                this._root = this[nodeName] = this._childNodes[i];
            }
        }
    }
};

Jeeel.file.Jeeel.Dom.Xml = ['Node'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Xml, Jeeel.file.Jeeel.Dom.Xml);
