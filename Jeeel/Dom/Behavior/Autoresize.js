
/**
 * オートリサイズを有効にする
 * 
 * @param {Hash} [limit] サイズ制限
 * @return {Jeeel.Dom.Behavior} 自クラス
 */
Jeeel.Dom.Behavior.enableAutoresize = function (limit) {
  
    Jeeel.Dom.Behavior.Autoresize.addLoadEvent(limit);
    
    return this;
};

/**
 * オートリサイズを実現するクラス
 */
Jeeel.Dom.Behavior.Autoresize = {
    
    /**
     * サイズ制限
     * 
     * @type Hash
     * @constant
     */
    LIMIT: {
        min: 15,
        max: -1
    },
    
    /**
     * ストレージ取得の際に指定する名前
     * 
     * @type String
     * @constant
     */
    STORAGE_NAME: 'jeeel-dom-behavior-autoresize',
    
    /**
     * 使用可能な要素のリスト
     * 
     * @type Hash
     * @constant
     */
    USABLE_LIST: {
        NODES: ['INPUT', 'TEXTAREA'],
        TYPES: ['text', 'search', 'url', 'tel', 'email', 'password']
    },
    
    /**
     * 読み込み時のイベントに登録する
     * 
     * @param {Hash} [limit] サイズ制限
     * @return {Jeeel.Dom.Behavior.Autoresize} 自クラス
     */
    addLoadEvent: function (limit) {
        Jeeel.addLoadEvent(function () {
            var elms = Jeeel.Document.getElementsByTagName('input');

            this.resize(elms.concat(Jeeel.Document.getElementsByTagName('textarea')), limit);

            elms = null;
        }, this);
        
        return this;
    },
    
    /**
     * オートリサイズを有効にする
     * 
     * @param {Element|Element[]} inputs オートリサイズを適用する要素
     * @param {Hash} [limit] サイズ制限
     * @return {Jeeel.Dom.Behavior.Autoresize} 自クラス
     */
    resize: function (inputs, limit) {
        if (inputs instanceof Jeeel.Dom.ElementOperator) {
            inputs = inputs.getAll();
        } else if ( ! Jeeel.Type.isArray(inputs)) {
            inputs = [inputs];
        }
        
        if ( ! limit) {
            limit = {};
        }
        
        var keys = ['width', 'height'], 
            key, i;
        
        for (i = keys.length; i--;) {
            
            key = keys[i];
            
            if ( ! limit[key]) {
                limit[key] = {};
            }
            
            if ( ! ('min' in limit[key])) {
                limit[key].min = limit.min || this.LIMIT.min;
            }

            if ( ! ('max' in limit[key])) {
                limit[key].max = limit.max || this.LIMIT.max;
            }
        }
        
        for (i = inputs.length; i--;) {
            var input = inputs[i];
            var nodeName = input.nodeName.toUpperCase();

            if ( ! Jeeel.Type.inArray(nodeName, this.USABLE_LIST.NODES, true)) {
                continue;
            } else if (nodeName === 'INPUT' && ! Jeeel.Type.inArray(input.type, this.USABLE_LIST.TYPES, true)) {
                continue;
            }
            
            Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.KEY_DOWN, this._keyDown, this);
            Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.KEY_UP, this._keyUp, this);
            
            input.style.overflow = 'hidden';
            
            var storage = Jeeel.Storage.Object(input, this.STORAGE_NAME);
            
            storage.set('limit', limit);
        }
    },
    
    _keyDown: function (e) {
        var target = e.currentTarget;
        var value = target.value;
        var charCode = String.fromCharCode(e.getKeyCode()) || '';
        
        if (charCode === '\u000D') {
            charCode = target.nodeName.toUpperCase() === 'TEXTAREA' && '\n' || '';
        } else if (charCode === '\u0008') {
            value = value.slice(0, value.length - 1);
            charCode = '';
        } else if ( ! e.shiftKey) {
            charCode = charCode.toLowerCase();
        }
        
        if (charCode.length > 1) {
            charCode = '';
        }
        
        this._setSize(target, value + (charCode || ''));
    },
    
    _keyUp: function (e) {
        var target = e.currentTarget;
        
        this._setSize(target, target.value);
    },
    
    _setSize: function (target, txt) {
        var nodeName = target.nodeName.toUpperCase();
        var isMultiline = nodeName === 'TEXTAREA';
        var wrapper = new Jeeel.Dom.Element(target);
        
        var size = Jeeel.String.getTextSize(txt, {
            fontSize: wrapper.getStyle('fontSize'),
            fontFamily: wrapper.getStyle('fontFamily'),
            whiteSpace: wrapper.getStyle('whiteSpace'),
            lineHeight: wrapper.getStyle('lineHeight'),
            border: wrapper.getStyle('border'),
            padding: wrapper.getStyle('padding')
        });
        
        var storage = Jeeel.Storage.Object(target, this.STORAGE_NAME);
        var limit = storage.get('limit');
        
        var keys = isMultiline ? ['width', 'height'] : ['width'], 
            key, i;
        
        for (i = keys.length; i--;) {
            key = keys[i];
            
            if (limit[key].min > size[key]) {
                size[key] = limit[key].min;
            }

            if (limit[key].max >= 0 && limit[key].max < size[key]) {
                size[key] = limit[key].max;
            }
        }
        
        wrapper.setStyleList(isMultiline ? {
            width: size.width + 'px',
            height: size.height + 'px'
        } : {
            width: size.width + 'px'
        });
    }
};