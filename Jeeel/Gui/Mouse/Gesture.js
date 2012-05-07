
/**
 * コンストラクタ
 *
 * @class マウスジェスチャーを管理するクラス
 * @param {Element|Document|Window} [target] ジェスチャーの対象になるオブジェクト
 * @param {Integer} [sensitivityPlay] マウスの感度の遊び
 */
Jeeel.Gui.Mouse.Gesture = function (target, sensitivityPlay) {
    if ( ! target) {
        target = Jeeel.Gui.Mouse._currentTarget;
    }

    if (Jeeel.Type.isInteger(sensitivityPlay)) {
        this._sensitivityPlay = sensitivityPlay;
    }

    this._target = target;
    this._onMouseDown.bind(this);
    this._onMouseUp.bind(this);
    this._onMouseMove.bind(this);
};

/**
 * インスタンスの作成を行う
 *
 * @param {Element|Document|Window} [target] ジェスチャーの対象になるオブジェクト
 * @param {Integer} [sensitivityPlay] マウスの感度の遊び
 * @return {Jeeel.Gui.Mouse.Gesture} 作成したインスタンス
 */
Jeeel.Gui.Mouse.Gesture.create = function (target, sensitivityPlay) {
    return new this(target, sensitivityPlay);
};

Jeeel.Gui.Mouse.Gesture.prototype = {

    /**
     * マウス感度の遊び
     *
     * @type Integer
     * @protected
     */
    _sensitivityPlay: 10,

    /**
     * ジェスチャー対象となるオブジェクト
     *
     * @type Element|Document|Window
     * @protected
     */
    _target: null,

    /**
     * マウスジェスチャーが始動しているかどうか
     *
     * @type Boolean
     * @protected
     */
    _started: false,

    /**
     * 現在実行されているかどうか
     *
     * @type Boolean
     * @protected
     */
    _active: false,

    /**
     * アクティブになった時のコールバック
     *
     * @type Function
     * @protected
     */
    _activeCallback: null,

    /**
     * アクティブが解除された時のコールバック
     * 
     * @type Function
     * @protected
     */
    _inactiveCallback: null,

    /**
     * ジェスチャーした地点のリスト
     *
     * @type Jeeel.Object.Point[]
     * @protected
     */
    _pointList: [],

    /**
     * ジェスチャーした方向のリスト
     *
     * @type Integer[]
     * @protected
     */
    _gestureList: [],

    /**
     * ジェスチャーのマウスボタンを右クリックで行うかどうか(通常はfalse)
     *
     * @type Boolean
     * @protected
     */
    _isRight: false,

    /**
     * マウスが押し込まれた時の動作
     *
     * @type Jeeel.Function
     * @protected
     */
    _onMouseDown: Jeeel.Function.create(function () {

        if (this._active) {
            return;
        }

        var ev = Jeeel.Dom.Event.getEventObject();

        if ((this._isRight && ! ev.isRightDown) ||
            ( ! this._isRight && ! ev.isLeftDown))
        {
            return;
        }

        this._gestureList = [];
        this._pointList   = [];
        
        this._active = true;
        this._pointList.push(ev.mousePoint.clone());

        if (this._activeCallback) {
            this._activeCallback.call(this);
        }

    }),

    /**
     * マウスのボタンを上げた時の動作
     *
     * @type Jeeel.Function
     * @protected
     */
    _onMouseUp: Jeeel.Function.create(function () {

        if ( ! this._active) {
            return;
        }

        var ev = Jeeel.Dom.Event.getEventObject();

        if ((this._isRight && ev.isRightDown) ||
            ( ! this._isRight && ! ev.isLeftDown))
        {
            return;
        }
        
        this._active = false;

        if (this._inactiveCallback) {
            this._inactiveCallback.call(this, this.getGestureList());
        }

    }),

    /**
     * マウスが移動したときのイベント
     *
     * @type Jeeel.Function
     * @protected
     */
    _onMouseMove: Jeeel.Function.create(function () {

        if ( ! this._active) {
            return;
        }
        
        var ev = Jeeel.Dom.Event.getEventObject();

        if ((this._isRight && ! ev.isRightDown) ||
            ( ! this._isRight && ! ev.isLeftDown)){
            this._active = false;

            if (this._inactiveCallback) {
                this._inactiveCallback.call(this, this.getGestureList());
            }
            
            return;
        }

        var oldGesture = this._gestureList[this._pointList.length - 2];
        var newGesture;

        var oldPoint = this._pointList[this._pointList.length - 1];
        var newPoint = ev.mousePoint;
        var hLength  = newPoint.x - oldPoint.x;
        var vLength  = newPoint.y - oldPoint.y;

        if (Math.abs(hLength) > Math.abs(vLength) + this._sensitivityPlay) {
            newGesture = (hLength < 0 ? Jeeel.Dom.Event.KeyCode.Left : Jeeel.Dom.Event.KeyCode.Right);
        } else if (this._sensitivityPlay + Math.abs(hLength) < Math.abs(vLength)) {
            newGesture = (vLength < 0 ? Jeeel.Dom.Event.KeyCode.Up : Jeeel.Dom.Event.KeyCode.Down);
        } else {
            return;
        }

        if (oldGesture && oldGesture === newGesture) {
            this._pointList[this._pointList.length - 1] = newPoint.clone();
            return;
        }

        this._gestureList.push(newGesture);
        this._pointList.push(newPoint.clone());
        
    }),

    /**
     * マウスジェスチャーを開始する
     *
     * @return {Jeeel.Gui.Mouse.Gesture} 自インスタンス
     */
    start: function () {

        if (this._started) {
            return this;
        }

        Jeeel.Dom.Event.addEventListener(this._target, Jeeel.Dom.Event.Type.MOUSE_DOWN, this._onMouseDown);
        Jeeel.Dom.Event.addEventListener(this._target, Jeeel.Dom.Event.Type.MOUSE_UP,   this._onMouseUp);
        Jeeel.Dom.Event.addEventListener(this._target, Jeeel.Dom.Event.Type.MOUSE_MOVE, this._onMouseMove);
        this._started = true;

        return this;
    },

    /**
     * マウスジェスチャーを終了する
     *
     * @return {Jeeel.Gui.Mouse.Gesture} 自インスタンス
     */
    end: function () {

        if ( ! this._started) {
            return this;
        }

        Jeeel.Dom.Event.removeEventListener(this._target, Jeeel.Dom.Event.Type.MOUSE_DOWN, this._onMouseDown);
        Jeeel.Dom.Event.removeEventListener(this._target, Jeeel.Dom.Event.Type.MOUSE_UP,   this._onMouseUp);
        Jeeel.Dom.Event.removeEventListener(this._target, Jeeel.Dom.Event.Type.MOUSE_MOVE, this._onMouseMove);
        this._started = false;
        this._active  = false;

        return this;
    },

    /**
     * 使用するマウスのボタンを右ボタンにするかどうかを設定する<br />
     * なおこの設定を呼ぶと強制的にマウスジェスチャーが終了させられる
     *
     * @param {Boolean} isRight 右かどうか
     */
    setMouseButtonRight: function (isRight) {
        this.end();
        this._isRight = isRight;

        return this;
    },

    /**
     * ジェスチャーがアクティブになった時のコールバックを設定する
     *
     * @param {Function} callback 設定コールバック(引数はなしで、thisはこのインスタンスになる)
     * @return {Jeeel.Gui.Mouse.Gesture} 自インスタンス
     */
    setActiveCallback: function (callback) {
        this._activeCallback = callback;

        return this;
    },

    /**
     * ジェスチャーがアクティブになった時のコールバックを設定する
     *
     * @param {Function} callback 設定コールバック(引数はこのジェスチャーのリストで、thisはこのインスタンスになる)
     * @return {Jeeel.Gui.Mouse.Gesture} 自インスタンス
     */
    setInactiveCallback: function (callback) {
        this._inactiveCallback = callback;

        return this;
    },

    /**
     * 現在までのジェスチャーを取得する<br />
     * なおリスト内に入っている数値は、<br />
     * Jeeel.Code.KeyCode内のLeft, Right, Up, Downのいずれかである
     *
     * @return {Integer[]} 取得したジェスチャーのリスト
     */
    getGestureList: function () {
        return this._gestureList;
    },

    /**
     * 現在までのジェスチャーを文字列として取得する
     *
     * @return {String}
     */
    getGestureListToString: function () {
        var res = '';

        for (var i = 0; i < this._gestureList.length; i++) {

            if (i > 0) {
                res += ' ';
            }

            switch (this._gestureList[i]) {
                case Jeeel.Dom.Event.KeyCode.Left:
                    res += '←';
                    break;

                case Jeeel.Dom.Event.KeyCode.Right:
                    res += '→';
                    break;

                case Jeeel.Dom.Event.KeyCode.Up:
                    res += '↑';
                    break;

                case Jeeel.Dom.Event.KeyCode.Down:
                    res += '↓';
                    break;

                default:
                    res += '？';
                    break;
            }
        }

        return res;
    },

    /**
     * 指定したジェスチャーと現在の結果が一致するかどうかを返す
     * 
     * @param {Integer[]} gesture 比較対象のジェスチャーのリスト
     * @return {Boolean} ジェスチャーが一致するかどうか
     */
    matchGesture:function (gesture) {
        if (gesture.length !== this._gestureList.length) {
            return false;
        }

        for (var i = 0; i < gesture.length; i++) {
            if (gesture[i] !== this._gestureList[i]) {
                return false;
            }
        }

        return true;
    },

    /**
     * 現在までのマウス座標を取得する
     *
     * @type Jeeel.Object.Point[]
     */
    getPointList: function () {
        return this._pointList;
    }
};
