
/**
 * コンストラクタ
 *
 * @class 四角形扱うクラス
 * @param {Integer} x 左辺のX座標
 * @param {Integer} y 上辺のY座標
 * @param {Integer} width 幅
 * @param {Integer} height 高さ
 */
Jeeel.Object.Rect = function (x, y, width, height) {};

/**
 * コンストラクタ
 *
 * @class 四角形扱うクラス
 * @param {Jeeel.Object.Point} startPoint 四角形の左上端の座標
 * @param {Jeeel.Object.Point} endPoint 四角形の右下端の座標
 */
Jeeel.Object.Rect = function (startPoint, endPoint) {};

/**
 * コンストラクタ
 *
 * @class 四角形扱うクラス
 * @param {Jeeel.Object.Point} point 四角形の左上端の座標
 * @param {Jeeel.Object.Size} size 四角形の幅と高さ
 */
Jeeel.Object.Rect = function (point, size) {
    
    var rect = [];

    switch (arguments.length) {
        case 2:
            if (arguments[1] instanceof Jeeel.Object.Point) {
                rect[0] = Math.min(arguments[0].x, arguments[1].x);
                rect[1] = Math.min(arguments[0].y, arguments[1].y);
                rect[2] = Math.abs(arguments[1].x - arguments[0].x);
                rect[3] = Math.abs(arguments[1].y - arguments[0].y);
                point = new Jeeel.Object.Point(rect[0], rect[1]);
                size  = new Jeeel.Object.Size(rect[2], rect[3]);
            } else {
                rect[0] = point.x;
                rect[1] = point.y;
                rect[2] = size.width;
                rect[3] = size.height;
                point = new Jeeel.Object.Point(rect[0], rect[1]);
                size  = new Jeeel.Object.Size(rect[2], rect[3]);
            }
            break;

        case 4:
            rect[0] = arguments[0];
            rect[1] = arguments[1];
            rect[2] = arguments[2];
            rect[3] = arguments[3];
            point = new Jeeel.Object.Point(rect[0], rect[1]);
            size  = new Jeeel.Object.Size(rect[2], rect[3]);
            break;

        default:
            throw new Error('引数の数が違います。');
            break;
    }

    /**
     * X座標
     *
     * @type Integer
     */
    this.x = rect[0];

    /**
     * Y座標
     *
     * @type Integer
     */
    this.y = rect[1];

    /**
     * 幅
     *
     * @type Integer
     */
    this.width = rect[2];

    /**
     * 高さ
     *
     * @type Integer
     */
    this.height = rect[3];

    /**
     * 左上端の座標
     *
     * @type Jeeel.Object.Point
     */
    this.point = point;

    /**
     * 四角形の幅と高さ
     *
     * @type Jeeel.Object.Size
     */
    this.size = size;
    
    /**
     * 始点(左上端の座標)
     * 
     * @type Jeeel.Object.Point
     */
    this.startPoint = point;
    
    /**
     * 終点(右下端の座標)
     * 
     * @type Jeeel.Object.Point
     */
    this.endPoint = new Jeeel.Object.Point(this.x + this.width, this.y + this.height);
};

Jeeel.Object.Rect.prototype = {

    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Rect} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Rect(this.x, this.y, this.width, this.height);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Object.Rect} rect 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (rect) {
        return this.x === rect.x
            && this.y === rect.y
            && this.width === rect.width
            && this.height === rect.height;
    },

    /**
     * 文字列に変換する
     *
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function () {
        return '(' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height + ')';
    }
};

