
/**
 * コンストラクタ
 * 
 * @class セレクタの中で要素を示すクラス(スペース, ~, +, > などを除いたセレクタ)
 * @param {String} selector セレクタ
 * @param {String} relationType 一つ前のノードとの関係性を示す文字列
 */
Jeeel.Dom.Selector.Node = function (selector, relationType) {
    this.selector = selector;
    this.relationType = relationType || null;
    this.classes = [];
    this.mocks = [];
    
    if ( ! this.constructor.caches[selector]) {
        this.constructor.caches[selector] = {};
    }
    
    this.constructor.caches[selector][relationType] = this;
};

/**
 * キャッシュ
 * 
 * @type Hash
 */
Jeeel.Dom.Selector.Node.caches = {};

Jeeel.Dom.Selector.Node.prototype = {
    
    /**
     * セレクタ
     * 
     * @type String
     */
    selector: '',
    
    /**
     * 関係文字列
     * 
     * @type String
     */
    relationType: null,
    
    /**
     * タグ名
     * 
     * @type String
     */
    tag: '*',
    
    /**
     * ID名
     * 
     * @type String
     */
    id: '',
    
    /**
     * クラス名のリスト
     * 
     * @type String[]
     */
    classes: [],
    
    /**
     * 属性リスト
     * 
     * @type Hash[]
     */
    attrs: [],
    
    /**
     * 疑似クラスリスト
     * 
     * @type Jeeel.Dom.Selector.Mock[]
     */
    mocks: [],
    
    /**
     * 指定した要素がセレクタと一致するかどうか返す
     * 
     * @param {Element} element 調べる要素
     * @return {Boolean} 一致したかどうか
     */
    isMatch: function (element) {
        
        var i, l;
        
        // MOCK
        for (i = 0, l = this.mocks.length; i < l; i++) {
            if ( ! this.mocks[i].isMatch(element)) {
                return false;
            }
        }
        
        var nodeName = element.nodeName.toUpperCase();
        
        // TAG
        if (this.tag !== '*' && this.tag !== nodeName) {
            return false;
        }
        
        // ID
        if (this.id && this.id !== element.id) {
            return false;
        }
        
        var tmp, name, reg, val, classes;
        
        // CLASS
        if (this.classes.length) {
            tmp = element.classList;

            if (tmp) {
                classes = [];

                for (i = tmp.length; i--;) {
                    classes[i] = tmp.item(i);
                }
            } else {
                classes = element.className.split(/\s+/g);
            }

            for (i = this.classes.length; i--;) {
                if ( ! Jeeel.Type.inArray(this.classes[i], classes, true)) {
                    return false;
                }
            }
        }
        
        // ATTR
        if (this.attrs.length) {
            for (i = this.attrs.length; i--;) {
                name = this.attrs[i].name;
                reg = this.attrs[i].reg;
                val = element.getAttribute(name);
                
                if (val === null) {
                    return false;
                } else if (reg === '*') {
                    continue;
                } else if ( ! val.match(reg)) {
                    return false;
                }
            }
        }
        
        return true;
    },
    
    /**
     * 指定した要素リストをフィルタリングする
     * 
     * @param {Element[]} elements 要素リスト
     * @return {Element[]} フィルタリング後の要素リスト
     */
    filter: function (elements) {
        
        // MOCK
        for (var i = 0, l = this.mocks.length; i < l; i++) {
            elements = this.mocks[i].filter(elements);
        }
        
        return elements;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Selector.Node
};