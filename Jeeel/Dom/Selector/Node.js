
/**
 * コンストラクタ
 * 
 * @class セレクタの中で要素を示すクラス(スペース, ~, +, > などを除いたセレクタ)
 * @param {String} selector セレクタ
 * @param {String} relationType 一つ前のノードとの関係性を示す文字列
 * @param {String} [referenceKey] relationTypeが属性参照だった場合に指定
 */
Jeeel.Dom.Selector.Node = function (selector, relationType, referenceKey) {
    this.selector = selector;
    this.relationType = relationType || null;
    this.referenceKey = referenceKey || null;
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

Jeeel.Dom.Selector.Node.IGNORE_CASE = {
    align: true,
    charset: true,
    type: true,
    'http-equiv': true,
    method: true,
    'accept-charset': true,
    lang: true,
    dir: true,
    rel: true,
    shape: true
};

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
     * 関係が属性参照だった場合の属性名
     * 
     * @type String
     */
    referenceKey: null,
    
    /**
     * 関係が属性参照だった場合の複数のIDリスト
     * 
     * @type String[]
     */
    referenceAttrs: null,
    
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
     * このノードのヒットする要素が一つのみかどうか
     * 
     * @type Boolean
     */
    isOnlyNode: false,
    
    /**
     * この要素が検索結果の対象になるかどうか
     * 
     * @type Boolean
     */
    isTarget: false,
    
    /**
     * 指定した要素がセレクタと一致するかどうか返す
     * 
     * @param {Element} element 調べる要素
     * @return {Boolean} 一致したかどうか
     */
    isMatch: function (element) {
        
        var i, l;
        
        // ID
        if (this.id && this.id !== element.id) {
            return false;
        }
        
        var nodeName = element.nodeName.toUpperCase();
        
        // TAG
        if (this.tag !== '*' && this.tag !== nodeName) {
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
            } else if (element.className && ('baseVal' in Object(element.className))) {
                classes = element.className.baseVal.replace(/\s+/g, ' ').split(' ');
            } else {
                classes = element.className.replace(/\s+/g, ' ').split(' ');
            }

            for (i = this.classes.length; i--;) {
                if ( ! Jeeel.Hash.inHash(this.classes[i], classes, true)) {
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
        
        // MOCK
        for (i = 0, l = this.mocks.length; i < l; i++) {
            if ( ! this.mocks[i].isMatch(element)) {
                return false;
            }
        }
        
        return true;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Selector.Node
};