
/**
 * プレースホルダを有効にする
 * 
 * @return {Jeeel.Dom.Behavior} 自クラス
 */
Jeeel.Dom.Behavior.enablePlaceholder = function () {
  
    Jeeel.Dom.Behavior.Placeholder.addLoadEvent();
    
    return this;
};

/**
 * HTML5のプレースホルダを実現するためのクラス
 */
Jeeel.Dom.Behavior.Placeholder = {
  
    /**
     * ストレージ取得の際に指定する名前
     * 
     * @type String
     * @constant
     */
    STORAGE_NAME: 'jeeel-dom-behavior-placeholder',
    
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
     * @return {Jeeel.Dom.Behavior.Placeholder} 自クラス
     */
    addLoadEvent: function () {
        Jeeel.addLoadEvent(function () {
            var elms = Jeeel.Document.getElementsByTagName('input');

            this.hold(elms.concat(Jeeel.Document.getElementsByTagName('textarea')));

            elms = null;
        }, this);
        
        return this;
    },
    
    /**
     * プレースホルダを適用する
     * 
     * @param {Element|Element[]} inputs プレースホルダを適用する要素
     * @return {Jeeel.Dom.Behavior.Placeholder} 自クラス
     */
    hold: function (inputs) {
        
        if (inputs instanceof Jeeel.Dom.ElementOperator) {
            inputs = inputs.getAll();
        } else if ( ! Jeeel.Type.isArray(inputs)) {
            inputs = [inputs];
        }
        
        var forms = [];
        
        for (var i = inputs.length; i--;) {
            
            var input = inputs[i];
            var nodeName = input.nodeName.toUpperCase();
            var plc = input.getAttribute('placeholder');
            
            if ( ! plc) {
                continue;
            } else if ( ! Jeeel.Hash.inHash(nodeName, this.USABLE_LIST.NODES, true)) {
                continue;
            } else if (nodeName === 'INPUT' && ! Jeeel.Hash.inHash(input.type, this.USABLE_LIST.TYPES, true)) {
                continue;
            }
            
            // オーナーのフォームに対して送信時にplaceholder用の値を削除するトリガーをセットする
            if (input.form && ! Jeeel.Hash.inHash(input.form, forms, true)) {
                Jeeel.Dom.Event.addEventListener(input.form, Jeeel.Dom.Event.Type.SUBMIT, this._submit, this);
                
                forms[forms.length] = input.form;
            }

            var storage = Jeeel.Storage.Object(input, this.STORAGE_NAME);
            
            storage.set('str', plc)
                   .set('color', input.style.color)
                   .set('holded', false);
            
            Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.FOCUS, this._focus, this);
            Jeeel.Dom.Event.addEventListener(input, Jeeel.Dom.Event.Type.BLUR, this._blur, this);
            
            this._blur({currentTarget: input});
        }
        
        return this;
    },
    
    /**
     * プレースホルダーが表示中かどうかを返す
     * 
     * @param {Element} input プレースホルダーの有無を確認する要素
     * @return {Boolean} プレースホルダーが表示中かどうか
     */
    isHolded: function (input) {
        
        if ( ! input || ! input.nodeName) {
            return false;
        }
        
        var nodeName = input.nodeName.toUpperCase();
        var plc = input.getAttribute('placeholder');

        if ( ! plc) {
            return false;
        } else if ( ! Jeeel.Hash.inHash(nodeName, this.USABLE_LIST.NODES, true)) {
            return false;
        } else if (nodeName === 'INPUT' && ! Jeeel.Hash.inHash(input.type, this.USABLE_LIST.TYPES, true)) {
            return false;
        } else if ( ! Jeeel.Storage.Object.exists(input, this.STORAGE_NAME)) {
            return false;
        }

        var storage = Jeeel.Storage.Object(input, this.STORAGE_NAME);

        return !!storage.get('holded');
    },
    
    _focus: function (e) {
        var elm = e.currentTarget;
        var storage = Jeeel.Storage.Object(elm, this.STORAGE_NAME);
        
        if (storage.get('holded')) {
            elm.value = '';
            
            elm.style.color = storage.get('color');
            
            storage.set('holded', false);
        }
    },
    
    _blur: function (e) {
        var elm = e.currentTarget;
        var storage = Jeeel.Storage.Object(elm, this.STORAGE_NAME);
        
        if ( ! elm.value) {
            var style = elm.style;
            
            storage.set('color', style.color)
                   .set('holded', true);
            
            style.color = '#B9AAC7';
            
            elm.value = storage.get('str');
        }
    },
    
    _submit: function (e) {
        var form = e.currentTarget;
        var inputs = form.elements;

        for (var i = inputs.length; i--;) {
            var input = inputs[i];
            
            if (this.isHolded(input)) {
                input.value = '';
            }
        }
    },
    
    _init: function () {
        delete this._init;
        
        if ( ! Jeeel._doc) {
            return;
        }
        
        var input = Jeeel._doc.createElement('input');
        
        input.type = 'text';
        
        if ('placeholder' in input) {
            this.hold = Jeeel.Function.Template.RETURN_THIS;
        }
        
        input = null;
    }
};

Jeeel.Dom.Behavior.Placeholder._init();
