
/**
 * コンストラクタ
 * 
 * @abstractClass Elementクラスの抽象クラス
 * @ignore 未完成
 */
Jeeel.Dom.Element.Abstract = function () {};

Jeeel.Dom.Element.Abstract.prototype = {

    /**
     * 対象のElement
     * 
     * @type Element
     * @protected
     */
    _element: null,

    /**
     * 内部で使用しているHTML要素を取得する
     *
     * @return {Element} HTML要素
     */
    getElement: function () {
        return this._element;
    },

    /**
     * IDを取得する
     *
     * @return {String} ID
     */
    getId: function () {
        return this._element.id;
    },

    /**
     * IDを設定する
     *
     * @param {String} id ID
     * @return {Jeeel.Dom.Element.Abstract} 自インスタンス
     */
    setId: function (id) {
        this._element.id = id;

        return this;
    },

    /**
     * このElement内のクラス名を全て取得する
     *
     * @return {String[]} クラス名のリスト
     */
    getClassNames: function () {},

    /**
     * クラス名を追加する
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.Element.Abstract} 自インスタンス
     */
    addClassName: function (className) {},

    /**
     * クラス名の削除を行う
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.Element.Abstract} 自インスタンス
     */
    removeClassName: function (className) {},

    /**
     * クラス名が存在していたら削除し、存在していなかったら追加を行う
     *
     * @param {String|String[]} className クラス名もしくはクラス名リスト
     * @return {Jeeel.Dom.Element.Abstract} 自インスタンス
     */
    toggleClassName: function (className) {},

    /**
     * クラス名を消去する
     *
     * @return {Jeeel.Dom.Element.Abstract} 自インスタンス
     */
    clearClassName: function () {
        this._element.className = '';

        return this;
    },

    /**
     * 指定したクラス名を保持しているかどうかを返す
     *
     * @param {String} className クラス名
     * @return {Boolean} クラス名を保持していたかどうか
     */
    hasClassName: function (className) {},

    /**
     * Nameを取得する
     *
     * @return {String} Name
     */
    getName: function () {
        return this._element.name;
    },

    /**
     * Nameを設定する
     *
     * @param {String} name Name
     * @return {this} 自インスタンス
     */
    setName: function (name) {
        this._element.name = name;

        return this;
    },

    /**
     * TagNameを取得する
     *
     * @return {String} TagName
     */
    getTagName: function () {
        return this._element.tagName;
    },

    /**
     * スタイルを取得する
     *
     * @return {CSSStyleDeclaration} スタイル
     */
    getStyle: function () {
        return this._element.style;
    },

    /**
     * イベントリスナーをセットする
     *
     * @param {String} type イベントの種類(Jeeel.Dom.Event.Type参照)
     * @param {Function} listener 登録リスナー
     * @return {this} 自インスタンス
     */
    setEvent: function (type, listener) {
        this._element['on' + type] = listener;

        return this;
    },
    
    _init: function () {
      
        if ( ! Jeeel._doc) {
            delete this._init;
            return;
        }
        
        var div = (Jeeel.Document || Jeeel._doc).createElement('div');
        var slice = Array.prototype.slice;
        
        var self = this;
        
        if (div.classList) {
            self.getClassNames = function () {
                return slice.call(this._element.classList);
            };
            
            self.addClassName = function (className) {
                if ( ! className) {
                    return this;
                }
                
                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                
                var classList = this._element.classList;
                
                for (var i = className.length; i--;) {
                    classList.add(className[i]);
                }
                
                return this;
            };
            
            self.removeClassName = function (className) {
                if ( ! className) {
                    return this;
                }

                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                var classList = this._element.classList;
                
                for (var i = className.length; i--;) {
                    classList.remove(className[i]);
                }

                return this;
            };
            
            self.toggleClassName = function (className) {
                if ( ! className) {
                    return this;
                }

                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                var classList = this._element.classList;
                
                for (var i = className.length; i--;) {
                    classList.toggle(className[i]);
                }

                return this;
            };
            
            self.hasClassName = function (className) {
                return this._element.classList.contains(className);
            };
            
        } else {
            self.getClassNames = function () {
                return this._element.className.split(' ');
            };
            
            self.addClassName = function (className) {
                if ( ! className) {
                    return this;
                }
                
                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                
                var ec = this._element.className;
                
                for (var i = 0, l = className.length; i < l; i++) {
                    if ( ! className[i]) {
                        continue;
                    } else if(ec === className[i] || ec.search('\\b' + className[i] + '\\b') !== -1) {
                        continue;
                    }
                    
                    ec += (ec ? ' ' : '') + className[i];
                }
                
                this._element.className = ec;
                
                return this;
            };
            
            self.removeClassName = function (className) {
                if ( ! className) {
                    return this;
                }
                
                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }
                
                var ec = this._element.className;
                
                for (var i = 0, l = className.length; i < l; i++) {
                    if ( ! className[i]) {
                        continue;
                    }
                    
                    ec = ec.replace(new RegExp('\\b' + className[i] + '\\b\\s*','g'),'');
                }
                
                this._element.className = ec.replace(/\s+$/g, '');
                
                return this;
            };
            
            self.toggleClassName = function (className) {
                if ( ! className) {
                    return this;
                }

                if ( ! Jeeel.Type.isArray(className)) {
                    className = [className];
                }

                var classNames = this.getClassNames();

                for (var i = 0, l = className.length; i < l; i++) {
                    if (Jeeel.Type.inArray(className[i], classNames, true)) {
                        this.removeClassName(className[i]);
                    } else {
                        this.addClassName(className[i]);
                    }
                }

                return this;
            };
            
            self.hasClassName = function (className) {
                if ( ! className) {
                    return false;
                }
                
                var ec = this._element.className;
                
                return ec === className
                    || ec.search('\\b' + className + '\\b') !== -1;
            };
        }
        
        delete this._init;
    }
};

Jeeel.Dom.Element.Abstract.prototype._init();
