
/**
 * イベントの種類の列挙体
 */
Jeeel.Dom.Event.Type = {
    
    /**
     * フォーカスが外れた時に発生
     *
     * @type String
     * @constant
     */
    BLUR: 'blur',
    
    /**
     * フォーカスが当たった時に発生
     *
     * @type String
     * @constant
     */
    FOCUS: 'focus',
    
    /**
     * 要素のサイズが変更された時に発生
     *
     * @type String
     * @constant
     */
    RESIZE: 'resize',
    
    /**
     * スクロールが行われた時に発生
     *
     * @type String
     * @constant
     */
    SCROLL: 'scroll',
    
    /**
     * フォーム要素の選択、入力内容が変更された時に発生
     *
     * @type String
     * @constant
     */
    CHANGE: 'change',
    
    /**
     * テキストが選択された時に発生
     *
     * @type String
     * @constant
     */
    SELECT: 'select',
    
    /**
     * フォームを送信しようとした時に発生
     *
     * @type String
     * @constant
     */
    SUBMIT: 'submit',
    
    /**
     * フォームがリセットされた時に発生
     *
     * @type String
     * @constant
     */
    RESET: 'reset',
    
    /**
     * 画像の読み込みを中断した時に発生
     *
     * @type String
     * @constant
     */
    ABORT: 'abort',
    
    /**
     * 画像の読み込み中にエラーが発生した時に発生
     *
     * @type String
     * @constant
     */
    ERROR: 'error',
    
    /**
     * ページや画像の読み込みが完了した時に発生
     *
     * @type String
     * @constant
     */
    LOAD: 'load',
    
    /**
     * ウィンドウを閉じた時、他のページに切り替えた時、ページをリロード（更新）した時に発生
     *
     * @type String
     * @constant
     */
    UNLOAD: 'unload',
    
    /**
     * ウィンドウを閉じた時、他のページに切り替えた時、ページをリロード（更新）する直前に発生
     *
     * @type String
     * @constant
     */
    BEFORE_UNLOAD: 'beforeunload',

    /**
     * postMessageを受け取った時に発生
     *
     * @type String
     * @constant
     */
    MESSAGE: 'message',
    
    /**
     * 要素やリンクをクリックした時に発生
     *
     * @type String
     * @constant
     */
    CLICK: 'click',
    
    /**
     * 要素をダブルクリックした時に発生
     *
     * @type String
     * @constant
     */
    DOUBLE_CLICK: 'dblclick',

    /**
     * 押していたキーをあげた時に発生
     *
     * @type String
     * @constant
     */
    KEY_UP: 'keyup',

    /**
     * キーを押した時に発生
     *
     * @type String
     * @constant
     */
    KEY_DOWN: 'keydown',

    /**
     * キーを押してる時に発生
     *
     * @type String
     * @constant
     */
    KEY_PRESS: 'keypress',

    /**
     * マウスが離れたした時に発生
     *
     * @type String
     * @constant
     */
    MOUSE_OUT: 'mouseout',

    /**
     * マウスが離れたした時に発生
     *
     * @type String
     * @constant
     */
    MOUSE_OVER: 'mouseover',

    /**
     * クリックしたマウスを上げた時に発生
     *
     * @type String
     * @constant
     */
    MOUSE_UP: 'mouseup',

    /**
     * マウスでクリックした時に発生
     *
     * @type String
     * @constant
     */
    MOUSE_DOWN: 'mousedown',

    /**
     * マウスを動かしている時に発生
     *
     * @type String
     * @constant
     */
    MOUSE_MOVE: 'mousemove',
    
    /**
     * マウスのホイールを回した時に発生s
     * 
     * @type String
     * @constant
     */
    MOUSE_WHEEL: 'mousewheel',
    
    /**
     * コンテキストメニューを表示しようとした時に発生
     *
     * @type String
     * @constant
     */
    CONTEXT_MENU: 'contextmenu',
    
    /**
     * 貼り付けをした時に発生
     *
     * @type String
     * @constant
     */
    PASTE: 'paste',
    
    /**
     * ドラッグ開始時に発生
     *
     * @type String
     * @constant
     */
    DRAG_START: 'dragstart',
    
    /**
     * ドラッグ終了時に発生
     *
     * @type String
     * @constant
     */
    DRAG_END: 'dragend',
    
    /**
     * ドラッグ要素がドロップ要素に入った時に発生
     *
     * @type String
     * @constant
     */
    DRAG_ENTER: 'dragenter',
    
    /**
     * ドラッグ要素がドロップ要素と重なっている間発生
     *
     * @type String
     * @constant
     */
    DRAG_OVER: 'dragover',
    
    /**
     * ドラッグ要素がドロップ要素から出た時に発生
     *
     * @type String
     * @constant
     */
    DRAG_LEAVE: 'dragleave',
    
    /**
     * ドラッグしている間継続して発生
     *
     * @type String
     * @constant
     */
    DRAG: 'drag',
    
    /**
     * ドロップした時に発生
     *
     * @type String
     * @constant
     */
    DROP: 'drop',
    
    /**
     * タッチパネル式の媒体で要素にタッチした時に発生
     *
     * @type String
     * @constant
     */
    TOUCH_START: 'touchstart',
    
    /**
     * タッチパネル式の媒体で要素にタッチしたまま動かした時に発生
     *
     * @type String
     * @constant
     */
    TOUCH_MOVE: 'touchmove',
    
    /**
     * タッチパネル式の媒体で要素にタッチした状態から離れた時に発生
     *
     * @type String
     * @constant
     */
    TOUCH_END: 'touchend',
    
    /**
     * タッチパネル式の媒体で要素にタッチ中に電話がかかってきら場合などにに発生
     *
     * @type String
     * @constant
     */
    TOUCH_CANCEL: 'touchcancel',
    
    /**
     * タッチパネル式の媒体で縦と横持ちを変えた時に発生
     *
     * @type String
     * @constant
     */
    ORIENTATION_CHANGE: 'orientationchange',
    
    /**
     * メディアの再生が開始された時に発生
     *
     * @type String
     * @constant
     */
    PLAY: 'play',
    
    /**
     * メディアが一時停止された時に発生
     *
     * @type String
     * @constant
     */
    PAUSE: 'pause',
    
    /**
     * メディアのリソースが終端に達したために再生が停止した時に発生
     *
     * @type String
     * @constant
     */
    ENDED: 'ended',
    
    /**
     * メディアのボリュームが変化及びミュート切り替え時に発生
     *
     * @type String
     * @constant
     */
    VOLUME_CHANGE: 'volumechange',
    
    /**
     * マウスイベントを示す
     *
     * @type String
     * @constant
     */
    MOUSE_EVENT: 'MouseEvent',
    
    /**
     * ドラッグイベントを示す
     *
     * @type String
     * @constant
     */
    DRAG_EVENT: 'DragEvent',
    
    /**
     * タッチイベントを示す
     *
     * @type String
     * @constant
     */
    TOUCH_EVENT: 'TouchEvent',
    
    /**
     * キーボードイベントを示す
     *
     * @type String
     * @constant
     */
    KEYBOARD_EVENT: 'KeyboardEvent',
    
    /**
     * UIイベントを示す
     *
     * @type String
     * @constant
     */
    UI_EVENT: 'UIEvent',

    /**
     * その他のイベントを示す
     *
     * @type String
     * @constant
     */
    EVENT: 'Event'
};

(function () {
    var wheel = 'on' + Jeeel.Dom.Event.Type.MOUSE_WHEEL;
    
    // Firefoxのホイールイベント
    if (Jeeel._doc && ! (wheel in Jeeel._global || wheel in Jeeel._doc)) {
        Jeeel.Dom.Event.Type.MOUSE_WHEEL = 'DOMMouseScroll';
    }
})();
