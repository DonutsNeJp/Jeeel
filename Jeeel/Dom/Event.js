Jeeel.directory.Jeeel.Dom.Event = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Event/';
    }
};

/**
 * コンストラクタ
 *
 * @class Eventを拡張するラッパークラス
 * @param {Event} event 基となるEventインスタンス
 */
Jeeel.Dom.Event = function (event) {
    var self = this;

    self._event = event;

    var docElement = Jeeel._doc.documentElement;
    var body = Jeeel._doc.body || {scrollLeft: 0, scrollTop: 0};

    var x = event.changedTouches && event.changedTouches[0].pageX || event.pageX || (event.clientX +
      (docElement.scrollLeft || body.scrollLeft) -
      (docElement.clientLeft || 0));

    var y = event.changedTouches && event.changedTouches[0].pageY || event.pageY || (event.clientY +
       (docElement.scrollTop || body.scrollTop) -
       (docElement.clientTop || 0));

    var right, left, middle;
    var button = event.button;
    
    if (Jeeel.UserAgent.isInternetExplorer()) {
        right  = !!(button & 2);
        left   = !!(button & 1);
        middle = !!(button & 4);
    } else {
        right  = button === 2;
        left   = button === 0;
        middle = button === 1;
    }

    var code = this._getCode();

    self.type = event.type.toLowerCase();
    self.data = event.data || null;
    self.target = event.target || event.srcElement;
    self.currentTarget = event.currentTarget || arguments[1] || null;
    self.relatedTarget = event.relatedTarget || event.fromElement || event.toElement || null;
    self.mouseX = x;
    self.mouseY = y;
    self.mouseWheel = (event.wheelDelta / 120) || -event.detail / 3;
    
    self.mousePoint = new Jeeel.Object.Point(x, y);

    self.keyCode  = code[0];
    self.charCode = code[1];

    self.ctrlKey  = event.ctrlKey;
    self.shiftKey = event.shiftKey;
    self.altKey   = event.altKey;

    self.isRightDown  = right;
    self.isLeftDown   = left;
    self.isMiddleDown = middle;
};

Jeeel.Dom.Event.prototype = {

    /**
     * イベントオブジェクト
     *
     * @type Event
     */
    _event: null,
    
    /**
     * イベントの種類
     *
     * @type String
     */
    type: '',
    
    /**
     * イベント発生Element
     * 
     * @type Element
     */
    target: null,
    
    /**
     * イベント補足Element
     * 
     * @type Element
     */
    currentTarget: null,
    
    /**
     * マウスの移動元・移動先の要素
     * 
     * @type Element
     */
    relatedTarget: null,
    
    /**
     * イベントのデータ
     * 
     * @type Mixied
     */
    data: null,

    /**
     * マウスのX座標
     *
     * @type Integer
     */
    mouseX: 0,
  
    /**
     * マウスのY座標
     *
     * @type Integer
     */
    mouseY: 0,

    /**
     * マウスの座標
     *
     * @type Jeeel.Object.Point
     */
    mousePoint: null,
    
    /**
     * マウスのホイール量
     * 
     * @type Integer
     */
    mouseWheel: 0,

    /**
     * キーコード
     *
     * @type Integer
     */
    keyCode: 0,

    /**
     * 文字コード
     *
     * @type Integer
     */
    charCode: 0,
  
    /**
     * Ctrlキーが押されているかどうか
     *
     * @type Boolean
     */
    ctrlKey: false,

    /**
     * Shiftキーが押されているかどうか
     *
     * @type Boolean
     */
    shiftKey: false,
  
    /**
     * Altキーが押されているかどうか
     *
     * @type Boolean
     */
    altKey: false,

    /**
     * マウスの右ボタンが押されたかどうか
     *
     * @type Boolean
     */
    isRightDown: false,
  
    /**
     * マウスの左ボタンが押されたかどうか
     *
     * @type Boolean
     */
    isLeftDown: false,

    /**
     * マウスの中ボタンが押されたかどうか
     *
     * @type Boolean
     */
    isMiddleDown: false,
    
    /**
     * イベントが伝播してきたElementリスト(伝播順配列)
     * 
     * @type Element[]
     * @private
     */
    _bubblingTargets: null,

    /**
     * 内部のEventインスタンスを返す
     *
     * @return {Event} Eventインスタンス
     */
    getEvent: function () {
        return this._event;
    },
    
    /**
     * イベント対象のElementからの相対マウス座標を取得する
     * 
     * @param {Element} [element] イベント対象のElementの代わりに使用するElement
     * @return {Jeeel.Object.Point} 相対マウス座標
     */
    getRelativeMousePoint: function (element) {
        var bp = Jeeel.Dom.Element.prototype.getPosition.call({_element: element || this.target, _doc: Jeeel.Document});
        var mp = this.mousePoint;
        
        bp.x = mp.x - bp.x;
        bp.y = mp.y - bp.y;
        
        return bp;
    },
    
    /**
     * イベントが伝播してきたElementリストを取得する(伝播順配列)
     * 
     * @return {Element[]} 伝搬リスト
     */
    getBubblingTargets: function () {
        if (this._bubblingTargets) {
            return this._bubblingTargets;
        }
        
        var c = this.currentTarget,
            p = this.target;

        if (p === c) {
            this._bubblingTargets = [p];
        }
        else if (c) {
            var elms = [];

            while (p && p !== c) {
                elms[elms.length] = p;
                p = p.parentNode;
            }

            elms[elms.length] = p;

            if (p) {
                this._bubblingTargets = elms;
            } else {
                this._bubblingTargets = [];
            }
        }
        
        return this._bubblingTargets;
    },

    /**
     * 全てのキーボードイベントで共通のキーコードを取得する<br />
     * 以下は例外入力(正しく取得できない)<br />
     * 1～8のキーをShiftと一緒に押したとき
     *
     * @return {Integer} キーコード
     */
    getKeyCode: function () {

        var keyCode  = this._event.keyCode;
        var charCode = this._event.charCode;
        var which    = this._event.which;

        if (this.type != 'keypress') {
            keyCode = this.keyCode;

            if (Jeeel.Dom.Event.KeyCode.T0 <= keyCode && keyCode <= Jeeel.Dom.Event.KeyCode.T9) {
                keyCode += Jeeel.Dom.Event.KeyCode[0] - Jeeel.Dom.Event.KeyCode.T0;
            } else if (Jeeel.Dom.Event.KeyCode.TMultiplicationSign <= keyCode && keyCode <= Jeeel.Dom.Event.KeyCode.TDivisionSign) {
                keyCode += Jeeel.Dom.Event.KeyCode.MultiplicationSign - Jeeel.Dom.Event.KeyCode.TMultiplicationSign;
            }

            return keyCode;
        }

        if (Jeeel.Code.CharCode.a <= keyCode && keyCode <= Jeeel.Code.CharCode.z) {
            keyCode += Jeeel.Code.CharCode.A - Jeeel.Code.CharCode.a;
        } else {

            switch (keyCode) {

                case Jeeel.Code.CharCode.RightParenthesis:
                    keyCode = Jeeel.Dom.Event.KeyCode[9];
                    break;

                case Jeeel.Code.CharCode.SubtractionSign:
                case Jeeel.Code.CharCode.EqualsSign:
                    keyCode = Jeeel.Dom.Event.KeyCode.SubtractionSign;
                    break;

                case Jeeel.Code.CharCode.Caret:
                case Jeeel.Code.CharCode.Tilde:
                    keyCode = Jeeel.Dom.Event.KeyCode.Caret;
                    break;

                case Jeeel.Code.CharCode.YenMark:
                case Jeeel.Code.CharCode.VerticalBar:
                    keyCode = Jeeel.Dom.Event.KeyCode.YenMark;
                    break;

                case Jeeel.Code.CharCode.Atmark:
                case Jeeel.Code.CharCode.BackQuote:
                    keyCode = Jeeel.Dom.Event.KeyCode.Atmark;
                    break;

                case Jeeel.Code.CharCode.LeftBracket:
                case Jeeel.Code.CharCode.LeftBrace:
                    keyCode = Jeeel.Dom.Event.KeyCode.LeftBracket;
                    break;

                case Jeeel.Code.CharCode.Semicolon:
                case Jeeel.Code.CharCode.AdditionSign:
                    keyCode = Jeeel.Dom.Event.KeyCode.AdditionSign;
                    break;

                case Jeeel.Code.CharCode.Colon:
                case Jeeel.Code.CharCode.MultiplicationSign:
                    keyCode = Jeeel.Dom.Event.KeyCode.MultiplicationSign;
                    break;

                case Jeeel.Code.CharCode.RightBracket:
                case Jeeel.Code.CharCode.RightBrace:
                    keyCode = Jeeel.Dom.Event.KeyCode.RightBracket;
                    break;

                case Jeeel.Code.CharCode.Comma:
                case Jeeel.Code.CharCode.LessThan:
                    keyCode = Jeeel.Dom.Event.KeyCode.Comma;
                    break;

                case Jeeel.Code.CharCode.Period:
                case Jeeel.Code.CharCode.GreaterThan:
                    keyCode = Jeeel.Dom.Event.KeyCode.Period;
                    break;

                case Jeeel.Code.CharCode.DivisionSign:
                case Jeeel.Code.CharCode.QuestionMark:
                    keyCode = Jeeel.Dom.Event.KeyCode.DivisionSign;
                    break;

                case Jeeel.Code.CharCode.YenMark:
                case Jeeel.Code.CharCode.Underscore:
                    keyCode = Jeeel.Dom.Event.KeyCode.Underscore;
                    break;

                case 0:
                    keyCode = Jeeel.Dom.Event.KeyCode.Application;
                    break;
            }
        }

        return keyCode;
    },
    
    /**
     * イベントをストップする
     * 
     * @param {Boolean} [nonstopSelfEvent] イベントをそのまま実行するかどうか
     * @param {Boolean} [nonstopParentEvent] イベントをそのまま伝達するかどうか
     * @return {Jeeel.Dom.Event} 自インスタンス
     */
    stop: function (nonstopSelfEvent, nonstopParentEvent) {
        if (this._event.preventDefault && ! nonstopSelfEvent) {
            this._event.preventDefault();
        }

        if (this._event.stopPropagation && ! nonstopParentEvent) {
            this._event.stopPropagation();
        }

        if ('returnValue' in this._event && ! nonstopSelfEvent) {
            this._event.returnValue = false;
        }

        if ('cancelBubble' in this._event && ! nonstopParentEvent) {
            this._event.cancelBubble = true;
        }

        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Event} event 基となるEventインスタンス
     * @constructor
     */
    constructor: Jeeel.Dom.Event,
    
    /**
    * 指定したEventオブジェクトからkeyCodeとcharCodeを取得する
    *
    * @return {Integer[]} 0にkeyCode, 1にcharCode
    */
    _getCode: function () {

        var keyCode  = this._event.keyCode;
        var charCode = this._event.charCode;
        var which    = this._event.which;

        if (this._event.type.toLowerCase() == 'keypress') {
            if (Jeeel.UserAgent.isGeckoEngine()) {
                if (keyCode == 0) {
                    keyCode = charCode;
                }

                charCode = keyCode;
            } else if (Jeeel.UserAgent.isTridentEngine() || Jeeel.UserAgent.isOpera()) {
                charCode = keyCode;
            }

            keyCode  = 0;
        } else {
            charCode = 0;
        }

        return [keyCode, charCode];
    }
};

/**
 * Eventインスタンスの取得を行う
 *
 * @param {Integer} [nestCount] ネスト数(イベントのコールバックを0としたネストの数)
 * @return {Jeeel.Dom.Event} Eventインスタンス
 * @throws {Error} イベントのコールバックから呼ばれていない時に投げられる
 * @example
 * <div onclick="test();">
 * </div>
 * <script>
 * function test() {
 *   // var e = Jeeel.Dom.Event.getEventObject(); //これはエラーになる
 *   var e = Jeeel.Dom.Event.getEventObject(1); //これが正しい
 * }
 * </script>
 */
Jeeel.Dom.Event.getEventObject = function (nestCount) {
    nestCount = +nestCount || 0;
    
    var caller = arguments.callee.caller;
    
    while (caller && nestCount--) {
        caller = caller.caller;
    }
    
    if ( ! caller || ! caller.arguments) {
        throw new Error('Eventインスタンスの取得はイベントのコールバックにて行ってください。');
    }

    var args = caller.arguments;
    
    if (args[0] instanceof this) {
        return args[0];
    }

    var e = args[0] || Jeeel._global.event;

    if ( ! Jeeel.Type.isEvent(e)) {
        throw new Error('Eventインスタンスの取得はイベントのコールバックにて行ってください。');
    }

    return new this(e);
};

/**
 * イベントの種類を内部的に取得する
 *
 * @param {String} type イベントのタイプ
 * @return {String} イベントの種類を示す文字列(MouseEvent等)
 * @private
 */
Jeeel.Dom.Event._getEventType = function (type) {
    var eventType;
    
    switch (type) {
        case Jeeel.Dom.Event.Type.KEY_DOWN:
        case Jeeel.Dom.Event.Type.KEY_PRESS:
        case Jeeel.Dom.Event.Type.KEY_UP:
            eventType = Jeeel.Dom.Event.Type.KEYBOARD_EVENT;
            break;
            
        case Jeeel.Dom.Event.Type.DRAG_START:
        case Jeeel.Dom.Event.Type.DRAG_END:
        case Jeeel.Dom.Event.Type.DRAG_ENTER:
        case Jeeel.Dom.Event.Type.DRAG_OVER:
        case Jeeel.Dom.Event.Type.DRAG_LEAVE:
        case Jeeel.Dom.Event.Type.DRAG:
        case Jeeel.Dom.Event.Type.DROP:
            eventType = Jeeel.Dom.Event.Type.DRAG_EVENT;
            break;
        
        case Jeeel.Dom.Event.Type.CLICK:
        case Jeeel.Dom.Event.Type.DOUBLE_CLICK:
        case Jeeel.Dom.Event.Type.MOUSE_DOWN:
        case Jeeel.Dom.Event.Type.MOUSE_UP:
        case Jeeel.Dom.Event.Type.MOUSE_MOVE:
        case Jeeel.Dom.Event.Type.MOUSE_OVER:
        case Jeeel.Dom.Event.Type.MOUSE_OUT:
        case Jeeel.Dom.Event.Type.MOUSE_WHEEL:
        case Jeeel.Dom.Event.Type.CONTEXT_MENU:
            eventType = Jeeel.Dom.Event.Type.MOUSE_EVENT;
            break;
            
        case Jeeel.Dom.Event.Type.TOUCH_START:
        case Jeeel.Dom.Event.Type.TOUCH_MOVE:
        case Jeeel.Dom.Event.Type.TOUCH_END:
        case Jeeel.Dom.Event.Type.TOUCH_CANCEL:
            eventType = Jeeel.Dom.Event.Type.TOUCH_EVENT;
            break;
            
        case Jeeel.Dom.Event.Type.BLUR:
        case Jeeel.Dom.Event.Type.FOCUS:
        case Jeeel.Dom.Event.Type.RESIZE:
        case Jeeel.Dom.Event.Type.SCROLL:
            eventType = Jeeel.Dom.Event.Type.UI_EVENT;
            break;
      
        default:
            eventType = Jeeel.Dom.Event.Type.EVENT;
            break;
    }
    
    return eventType;
};

/**
 * イベントの種類を取得する
 *
 * @param {Event|String} event イベントインスタンスもしくはイベントのタイプ(click等)
 * @return {String} イベントの種類を示す文字列(MouseEvent等)
 */
Jeeel.Dom.Event.getEventType = function (event) {
  
    var type;
    
    if (Jeeel.Type.isEvent(event)) {
        type = event.type.toLowerCase();
    } else if (Jeeel.Type.isString(event)) {
        type = event.toLowerCase();
    }
    
    if ( ! Jeeel.Type.isString(type)) {
        return 'NonEvent';
    }

    return this._getEventType(type);
};

/**
 * イベントの登録を行う<br />
 * タッチパネル系の場合はマウスイベントを対応するイベントに自動変換する
 *
 * @param {Element} element HTML要素
 * @param {String} type イベントタイプ
 * @param {Function} listener 登録イベントメソッド
 * @param {Mixied} [thisArg] コールバック中のthisに相当する値
 * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数はJeeel.Dom.Event、次の引数はイベント発生Element、3つ目以降に任意引数)
 */
Jeeel.Dom.Event.addEventListener = function (element, type, listener, thisArg, var_args) {
    var m = this.Manager.getInstance();
    m.addEventListener.apply(m, arguments);
};

/**
 * イベントの削除を行う<br />
 * タッチパネル系の場合はマウスイベントを対応するイベントに自動変換する
 *
 * @param {Element} element HTML要素
 * @param {String} type イベントタイプ
 * @param {Function} listener 登録イベントメソッド
 */
Jeeel.Dom.Event.removeEventListener = function (element, type, listener) {
    this.Manager.getInstance().removeEventListener(element, type, listener);
};

/**
 * 複数のElementに対してのイベントを上位Elementに委譲して登録を行う<br />
 * タッチパネル系の場合はマウスイベントを対応するイベントに自動変換する
 *
 * @param {Element} elementList 対象Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
 * @param {String} type イベントタイプ
 * @param {Function} listener 登録イベントメソッド
 * @param {Mixied} [thisArg] コールバック中のthisに相当する値
 * @param {Mixied} var_args 可変引数、コールバックに渡す引数(最初の引数はJeeel.Dom.Event、次の引数はイベント発生Element、3つ目以降に任意引数)
 */
Jeeel.Dom.Event.delegate = function (elementList, type, listener, thisArg, var_args) {
    var m = this.Manager.getInstance();
    m.delegate.apply(m, arguments);
};

/**
 *  複数のElementに対してのイベントを上位Elementに委譲してたものの削除を行う<br />
 * タッチパネル系の場合はマウスイベントを対応するイベントに自動変換する
 *
 * @param {Element} elementList 対象Elementまたは複数のElementリスト(Jeeel.Dom.ElementOperatorやJeeel.Dom.Element自体やリストでも可能)
 * @param {String} type イベントタイプ
 * @param {Function} listener 登録イベントメソッド
 */
Jeeel.Dom.Event.undelegate = function (elementList, type, listener) {
    this.Manager.getInstance().undelegate(elementList, type, listener);
};

/**
 * イベントの呼び出しを行う
 *
 * @param {Element} element HTML要素
 * @param {String} type イベントタイプ
 * @param {Jeeel.Dom.Event.Option} [option] マウスイベントやキーボードイベント等のイベント時のパラメータを指定する
 * @ignore 未完成
 */
Jeeel.Dom.Event.dispatchEvent = function (element, type, option) {

    var evType = this.getEventType(type);
    var view = element.ownerDocument;

    view = view.defaultView || view.parentWindow || Jeeel._global;

    if ( ! (option instanceof Jeeel.Dom.Event.Option)) {
        option = Jeeel.Dom.Event.Option.prototype;
    }
        
    var ev;
    
    if (Jeeel._doc.createEvent) {
        ev = Jeeel._doc.createEvent(evType);
    } else if (Jeeel._doc.createEventObject) {
        ev = Jeeel._doc.createEventObject(evType);
    }
    
    switch (evType) {
        case this.Type.MOUSE_EVENT:
            option.initMouseEvent(ev, type, view);
            break;
            
        case this.Type.DRAG_EVENT:
            option.initDragEvent(ev, type, view);
            break;

        case this.Type.KEYBOARD_EVENT:
            option.initKeyboardEvent(ev, type, view);
            break;
            
        case this.Type.TOUCH_EVENT:
            option.initTouchEvent(ev, type, view);
            break;

        case this.Type.UI_EVENT:
            option.initUIEvent(ev, type, view);
            break;

        case this.Type.EVENT:
        default:
            option.initEvent(ev, type);
            break;
    }
        
    if (element.dispatchEvent) {  
        element.dispatchEvent(ev);
    }
    else if (element.fireEvent) {
        element.fireEvent("on" + type, ev);
    }
};

/**
 * マウス操作無効化イベント
 * 
 * @private
 */
Jeeel.Dom.Event._disableMouse = function () {
    Jeeel.Dom.Event.getEventObject().stop(false, true);

    return false;
};

/**
 * 指定したElementのマウスEventを無効化する
 * 
 * @param {Element} element 対象のElement
 */
Jeeel.Dom.Event.disableMouseEvent = function (element) {
    element.onmousedown = element.onmouseup
                        = element.onmouseover
                        = element.ondrag
                        = element.ondragstart
                        = element.ondragend
                        = this._disableMouse;
};

Jeeel.file.Jeeel.Dom.Event = ['Type', 'KeyCode', 'Listener', 'Manager', 'Option'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Event, Jeeel.file.Jeeel.Dom.Event);
