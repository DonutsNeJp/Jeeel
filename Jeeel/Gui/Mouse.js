Jeeel.directory.Jeeel.Gui.Mouse = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Gui + 'Mouse/';
    }
};

/**
 * @namespace マウス関連のGUIネームスペース
 */
Jeeel.Gui.Mouse = {

    /**
     * リスナ対象となるオブジェクト
     *
     * @type Element|Document|Window
     * @private
     */
    _currentTarget: Jeeel._doc,

    /**
     * 初期化を終えたかどうか
     *
     * @type Boolean
     * @private
     */
    _inited: false,

    /**
     * マウスの現在位置
     *
     * @type Jeeel.Object.Point
     * @private
     */
    _point: new Jeeel.Object.Point(0, 0),

    /**
     * マウスボタンの押されている判別子
     *
     * @type Object
     * @private
     */
    _button: {
        left: false,
        right: false,
        middle: false
    },

    /**
     * マウス情報の取得のためのリスナー
     * 
     * @private
     */
    _listener: function () {
        var ev = Jeeel.Dom.Event.getEventObject();
        Jeeel.Gui.Mouse._point = ev.mousePoint.clone();

        this._button.left   = ev.isLeftDown;
        this._button.right  = ev.isRightDown;
        this._button.middle = ev.isMiddleDown;
    },

    /**
     * マウス情報を取得するための初期化を行う<br />
     * 常にマウスを追いかけるためやや重い<br />
     * このメソッドを呼んでいないと、他のメソッドが意味をなさない
     */
    init: function () {
        if (this._inited) {
            return;
        }

        Jeeel.Dom.Event.addEventListener(this._currentTarget, Jeeel.Dom.Event.Type.MOUSE_MOVE, this._listener);
        this._inited = true;
    },

    /**
     * マウス情報を取得するための初期化処理を無効化する
     */
    clear: function () {
        if ( ! this._inited) {
            return;
        }

        Jeeel.Dom.Event.removeEventListener(this._currentTarget, Jeeel.Dom.Event.Type.MOUSE_MOVE, this._listener);
        this._inited = false;
    },

    /**
     * マウスの左ボタンが押されているかどうか
     *
     * @return {Boolean}
     */
    isLeftDown: function () {
        return this._button.left;
    },

    /**
     * マウスの右ボタンが押されているかどうか
     *
     * @return {Boolean}
     */
    isRightDown: function () {
        return this._button.right;
    },

    /**
     * マウスの中央ボタンが押されているかどうか
     * 
     * @return {Boolean}
     */
    isMiddleDown: function () {
        return this._button.middle;
    },

    /**
     * マウスの現在位置を取得する
     * 
     * @return {Jeeel.Object.Point} マウス位置
     */
    getPoint: function () {
        return Jeeel.Gui.Mouse.point;
    },

    /**
     * マウスの現在位置のX座標を取得する
     *
     * @return {Integer}
     */
    getX: function () {
        return Jeeel.Gui.Mouse.point.x;
    },

    /**
     * マウスの現在位置のY座標を取得する
     *
     * @return {Integer}
     */
    getY: function () {
        return Jeeel.Gui.Mouse.point.y;
    }
};

Jeeel.file.Jeeel.Gui.Mouse = ['Gesture'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Gui.Mouse, Jeeel.file.Jeeel.Gui.Mouse);
