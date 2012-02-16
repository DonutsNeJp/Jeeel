
/**
 * コンストラクタ
 * 
 * @class XMLの内部ノードを示すクラス
 * @param {Element} xmlNode XMLノード
 */
Jeeel.Dom.Xml.Node = function (xmlNode) {
    this._init(xmlNode);
};

Jeeel.Dom.Xml.Node.prototype = {
    
    /**
     * この要素の名前
     * 
     * @type String
     * @private
     */
    _name: '',
    
    /**
     * この要素の名前空間
     * 
     * @type String
     * @private
     */
    _namespace: '',
    
    /**
     * この要素の名前空間URI
     * 
     * @type String
     * @private
     */
    _namespaceUri: '',
    
    /**
     * この要素を示す定数
     * 
     * @type Integer
     * @private
     */
    _type: 0,
    
    /**
     * この要素の持つ値
     * 
     * @type String
     * @private
     */
    _value: '',
    
    /**
     * この要素の持つ属性
     * 
     * @type Hash[]
     * @private
     */
    _attr: [],
    
    /**
     * この要素が持つ子要素リスト
     * 
     * @type Jeeel.Dom.Xml.Node[]
     * @private
     */
    _childNodes: [],
    
    /**
     * この要素の名前を取得する
     * 
     * @return {String} 要素名
     */
    getName: function () {
        return this._name;
    },
    
    /**
     * この要素の名前空間を取得する
     * 
     * @return {String} 名前空間
     */
    getNamespace: function () {
        return this._namespace;
    },
    
    /**
     * この要素の名前空間URIを取得する
     * 
     * @return {String} 名前空間URI
     */
    getNamespaceUri: function () {
        return this._namespaceUri;
    },
    
    /**
     * この要素の種類を取得する
     * 
     * @return {Integer} 要素の種類定数
     * @see Jeeel.Dom.Node
     */
    getType: function () {
        return this._type;
    },
    
    /**
     * この要素の値を取得する
     * 
     * @return {Mixied} 要素値
     */
    getValue: function () {
        return this._value;
    },
    
    /**
     * この要素に定義付けられている属性値を取得する
     * 
     * @param {String} attribute 属性名
     * @return {String} 属性値
     */
    getAttribute: function (attribute) {
        if (Jeeel.Type.isSet(this._attr[attribute])) {
            return this._attr[attribute];
        }
        
        return null;
    },
    
    /**
     * 属性の名前と値を連想配列にして返す
     * 
     * @return {Hash} 属性のリスト
     */
    getAttributes: function () {
        return this._attr;
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
    toHash: function () {
        var res = {},
            len = this._childNodes.length;
        
        if (len === 0) {
            return '';
        }
        else if (len === 1 && this._childNodes[0]._type === Jeeel.Dom.Node.TEXT_NODE) {
            return this._childNodes[0] && this._childNodes[0]._value || '';
        }
        
        for (var i = 0; i < len; i++) {
            var child = this._childNodes[i];
            
            if (child._type !== Jeeel.Dom.Node.ELEMENT_NODE) {
                continue;
            }
            
            if (res[child._name]) {
                res[child._name].push(child.toHash());
            } else {
                var hash = child.toHash();
                
                if ( ! Jeeel.Type.isHash(hash)) {
                    res[child._name] = hash;
                } else {
                    res[child._name] = [hash];
                    
                    for (var key in hash) {
                        res[child._name][key] = hash[key];
                    }
                }
            }
        }
        
        return res;
    },
    
    /**
     * この要素の内部XMLを文字列にして返す
     * 
     * @return {String} XML文字列
     */
    toXmlString: function () {
        switch (this._type) {
            case Jeeel.Dom.Node.TEXT_NODE:
                return this._value;
                break;
                
            case Jeeel.Dom.Node.COMMENT_NODE:
                return '<!--' + this._value + '-->';
                break;
                
            case Jeeel.Dom.Node.CDATA_SECTION_NODE:
                return '<![CDATA[' + this._value + ']]>';
                break;
                
            case Jeeel.Dom.Node.PROCESSING_INSTRUCTION_NODE:
                return '<?' + this._name + ' ' + this._value + '?>';
                break;
                
            case Jeeel.Dom.Node.DOCUMENT_TYPE_NODE:
                return '<!DOCTYPE ' + this._name + '>';
                break;
            
            default:
                break;
        }
        
        var attrs = [],
            children = [],
            i;
        
        for (i = this._attr.length; i--;) {
            var attr = this._attr[i];
            attrs[i] = attr.name + '="' + attr.value + '"';
        }
        
        for (i = this._childNodes.length; i--;) {
            children[i] = this._childNodes[i].toXmlString();
        }
        
        return '<' + this._name
             + (attrs.length ? ' ' + attrs.join(' ') : '')
             + '>'
             + children.join('')
             + '</' + this._name + '>';
    },
    
    /**
     * この要素の要素値もしくはXML文字列を返す
     * 
     * @return {String} 要素値もしくはXML文字列
     */
    toString: function () {
        return this._value || this.toXmlString();
    },
    
    /**
     * この要素の値を取得する
     * 
     * @return {Mixied} 要素値
     */
    valueOf: function () {
        return this._value;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Element} xmlNode XMLノード
     * @constructor
     */
    constructor: Jeeel.Dom.Xml.Node,
    
    /**
     * 初期化
     * 
     * @param {Element} xmlNode XMLノード
     */
    _init: function (xmlNode) {
        delete this._init;
        
        this._value        = xmlNode.nodeValue;
        this._name         = xmlNode.nodeName;
        this._namespace    = xmlNode.prefix;
        this._namespaceUri = xmlNode.namespaceURI;
        this._type         = xmlNode.nodeType;
        this._attr         = [];
        this._childNodes   = [];
        
        var i, l, attrs = xmlNode.attributes;
        
        if (attrs) {
            for (i = attrs.length; i--;) {
                var attr = attrs[i];
                
                this._attr[i] = {
                    name: attr.nodeName,
                    value: attr.nodeValue
                };
            }
        }
        
        var elmType = Jeeel.Dom.Node.ELEMENT_NODE;
        var nodes = xmlNode.childNodes;
        
        for (i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            var nodeName = node.nodeName;
            var xml = new Jeeel.Dom.Xml.Node(node);
            
            this._childNodes[i] = xml;

            if (node.nodeType !== elmType) {
                if (l === 1) {
                    this._value = node.nodeValue;
                }

                continue;
            }
            
            if ( ! this[nodeName]) {
                this[nodeName] = [];
            }
            
            var accessNodes = this[nodeName];
            
            accessNodes[accessNodes.length] = xml;
            
            if (accessNodes.length === 1) {
                for (var property in xml) {
                    if (property !== '_init') {
                        accessNodes[property] = xml[property];
                    }
                }
            }
        }
    }
};
