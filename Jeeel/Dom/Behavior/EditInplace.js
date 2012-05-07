
/**
 * エディットインプレースを有効にする
 * 
 * @param {Integer} [type)] 挙動の種類
 * @return {Jeeel.Dom.Behavior} 自クラス
 */
Jeeel.Dom.Behavior.enableEditInplace = function (type) {
  
    Jeeel.Dom.Behavior.EditInplace.addLoadEvent(type);
    
    return this;
};

/**
 * その場編集の機能を実現するためのクラス
 */
Jeeel.Dom.Behavior.EditInplace = {
    
    /**
     * ストレージ取得の際に指定する名前
     * 
     * @type String
     * @constant
     */
    STORAGE_NAME: 'jeeel-dom-behavior-editinplace',
    
    /**
     * フォーカスが当たった際に編集可能になる挙動を示す
     * 
     * @type String
     * @constant
     */
    EDIT_TYPE_FOCUS: 0,
    
    /**
     * マウスオーバーしたら編集可能になる挙動を示す
     * 
     * @type String
     * @constant
     */
    EDIT_TYPE_OVER: 1,
    
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
     * @param {Integer} [type)] 挙動の種類
     * @return {Jeeel.Dom.Behavior.EditInplace} 自クラス
     */
    addLoadEvent: function (type) {
        Jeeel.addLoadEvent(function () {
            var elms = Jeeel.Document.getElementsByTagName('input');

            this.enable(elms.concat(Jeeel.Document.getElementsByTagName('textarea')), type);

            elms = null;
        }, this);
        
        return this;
    },
    
    /**
     * その場編集を適用する
     * 
     * @param {Element|Element[]} inputs その場編集を適用する要素
     * @param {Integer} [type)] 挙動の種類
     * @return {Jeeel.Dom.Behavior.EditInplace} 自クラス
     */
    enable: function (inputs, type) {
        if (inputs instanceof Jeeel.Dom.ElementOperator) {
            inputs = inputs.getAll();
        } else if ( ! Jeeel.Type.isArray(inputs)) {
            inputs = [inputs];
        }
        
        for (var i = inputs.length; i--;) {
            var input = inputs[i];
            var nodeName = input.nodeName.toUpperCase();

            if ( ! Jeeel.Type.inArray(nodeName, this.USABLE_LIST.NODES, true)) {
                continue;
            } else if (nodeName === 'INPUT' && ! Jeeel.Type.inArray(input.type, this.USABLE_LIST.TYPES, true)) {
                continue;
            }
            
            switch (type) {
                case this.EDIT_TYPE_OVER:
                    Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.MOUSE_OVER, this._over, this);
                    Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.MOUSE_OUT, this._out, this);
                    Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.FOCUS, this._focus, this);
                    Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.BLUR, this._blur, this);
                    break;
                    
                case this.EDIT_TYPE_FOCUS:
                default:
                    Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.FOCUS, this._focus, this);
                    Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.BLUR, this._blur, this);
                    break;
            }
            
            this._hide(input);
        }
        
        return this;
    },
    
    _over: function (e) {
        var target = e.currentTarget;
        var storage = Jeeel.Storage.Object(target, this.STORAGE_NAME);
        
        if ( ! storage.get('focused')) {
            this._show(target);
        }
    },
    
    _out: function (e) {
        var target = e.currentTarget;
        var storage = Jeeel.Storage.Object(target, this.STORAGE_NAME);
        
        if ( ! storage.get('focused')) {
            this._hide(target);
        }
    },
    
    _focus: function (e) {
        var target = e.currentTarget;
        var storage = Jeeel.Storage.Object(target, this.STORAGE_NAME);
        
        storage.set('focused', true);
        
        this._show(target);
    },
    
    _blur: function (e) {
        var target = e.currentTarget;
        var storage = Jeeel.Storage.Object(target, this.STORAGE_NAME);
        
        storage.set('focused', false);
        
        this._hide(target);
    },
    
    _show: function (target) {
        var style = target.style;

        if ('readOnly' in target) {
            target.readOnly = false;
        }
        
        style.backgroundColor = '';
        style.borderStyle = '';
        style.cursor = '';

        if ('resize' in style) {
            style.resize = '';
        }
    },
    
    _hide: function (target) {
        var style = target.style;
        var css = [
            'background-color: transparent',
            'border-style: none',
            'cursor: pointer'
        ];
        
        if ('resize' in style) {
            css[css.length] = 'resize: none';
        }
        
        if ('readOnly' in target) {
            target.readOnly = true;
        }
        
        style.cssText += ';' + css.join(';');
    }
};