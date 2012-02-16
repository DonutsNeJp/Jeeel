
/**
 * コンストラクタ
 *
 * @class HSL形式の色を扱うクラス
 * @param {Integer} hue 色相
 * @param {Number} saturation 彩度
 * @param {Number} luminance 輝度
 */
Jeeel.Object.Color.Hsl = function (hue, saturation, luminance) {};

/**
 * コンストラクタ
 *
 * @class HSL形式の色を扱うクラス
 * @param {Integer} hue 色相
 * @param {Number} saturation 彩度
 * @param {Number} luminance 輝度
 * @param {Number} alpha アルファ
 */
Jeeel.Object.Color.Hsl = function (hue, saturation, luminance, alpha) {
  
    switch (arguments.length) {
        case 3:
            hue        = +hue;
            saturation = +saturation;
            luminance  = +luminance;
            alpha      = 1;
            break;
            
        case 4:
            hue        = +hue;
            saturation = +saturation;
            luminance  = +luminance;
            alpha      = +alpha;
            break;

        default:
            throw new Error('引数の数が違います。');
            break;
    }
    
    /**
     * 色相(0～360)
     *
     * @type Integer
     */
    this.hue = Math.round(hue > 360 && (hue % 360) || hue);

    /**
     * 彩度(0.0～1.0)
     *
     * @type Number
     */
    this.saturation = Jeeel.Number.limit(saturation, 0, 1);
    
    /**
     * 輝度(0.0～1.0)
     *
     * @type Number
     */
    this.luminance = Jeeel.Number.limit(luminance, 0, 1);
    
    /**
     * アルファ(0.0～1.0)
     *
     * @type Number
     */
    this.alpha = Jeeel.Number.limit(alpha, 0, 1);
};

Jeeel.Object.Color.Hsl.prototype = {

    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Color.Hsl} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Color.Hsl(this.hue, this.saturation, this.luminance);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Object.Color.Hsl} item 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (item) {
        return this.hue === item.hue
            && this.saturation === item.saturation
            && this.luminance === item.luminance;
    },

    /**
     * 文字列に変換する
     *
     * @param {Boolean} [toHSLA] アルファ値を加えた値に変換する時に指定
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function (toHSLA) {
        var s = Math.round(this.saturation * 100);
        var l = Math.round(this.luminance * 100);
        
        if (toHSLA) {
            return 'hsla('
                 + this.hue
                 + ', '
                 + s + '%'
                 + ', '
                 + l + '%'
                 + ', '
                 + this.alpha
                 + ')';
        }
        
        return 'hsl('
             + this.hue
             + ', '
             + s + '%'
             + ', '
             + l + '%'
             + ')';
    }
};
