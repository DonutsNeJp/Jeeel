
/**
 * コンストラクタ
 *
 * @class RGB形式の色を扱うクラス
 * @param {String} rgbString RGBを示す文字列(先頭に#や0xが付いていても良い)<br />
 *                            1色につき1桁もしくは2桁
 */
Jeeel.Object.Color.Rgb = function (rgbString) {};

/**
 * コンストラクタ
 *
 * @class RGB形式の色を扱うクラス
 * @param {Integer} red 赤
 * @param {Integer} green 緑
 * @param {Integer} blue 青
 */
Jeeel.Object.Color.Rgb = function (red, green, blue) {};

/**
 * コンストラクタ
 *
 * @class RGB形式の色を扱うクラス
 * @param {Integer} red 赤
 * @param {Integer} green 緑
 * @param {Integer} blue 青
 * @param {Number} alpha アルファ
 */
Jeeel.Object.Color.Rgb = function (red, green, blue, alpha) {
  
    switch (arguments.length) {
        case 1:
            var rgbString = ('' + arguments[0]).toUpperCase();

            if (Jeeel.Object.Color.Code[rgbString]) {
                rgbString = Jeeel.Object.Color.Code[rgbString];
            }
            
            rgbString = rgbString.replace(/^(#|0x)/, '');
            
            if (rgbString.match(/^RGBA?\(/i)) {
                rgbString = rgbString.replace(/^RGBA?\(/i, '').replace(')', '').replace(/ /g, '');
                
                var rgb = rgbString.split(',');
                
                red   = +rgb[0];
                green = +rgb[1];
                blue  = +rgb[2];
                alpha = rgb[3] ? +rgb[3] : 1;
            } else {
                if (rgbString.length != 3 && rgbString.length != 6) {
                    throw new Error('rgb文字列の長さが不自然です。');
                } else if ( ! Jeeel.Type.isHexadecimalNumber(rgbString)) {
                    throw new Error('rgb文字列の形式が正しくありません。');
                }

                if (rgbString.length == 3) {
                    red   = ('0x' + rgbString.charAt(0)) * 17;
                    green = ('0x' + rgbString.charAt(1)) * 17;
                    blue  = ('0x' + rgbString.charAt(2)) * 17;
                } else {
                    red   = +('0x' + rgbString.substr(0, 2));
                    green = +('0x' + rgbString.substr(2, 2));
                    blue  = +('0x' + rgbString.substr(4, 2));
                }
                
                alpha = 1;
            }
            break;

        case 3:
            red   = +red;
            green = +green;
            blue  = +blue;
            alpha = 1;
            break;
            
        case 4:
            red   = +red;
            green = +green;
            blue  = +blue;
            alpha = +alpha;
            break;

        default:
            throw new Error('引数の数が違います。');
            break;
    }

    /**
     * 赤
     *
     * @type Integer
     */
    this.red = Jeeel.Number.limit(Math.round(red), 0, 255);

    /**
     * 緑
     *
     * @type Integer
     */
    this.green = Jeeel.Number.limit(Math.round(green), 0, 255);
    
    /**
     * 青
     *
     * @type Integer
     */
    this.blue = Jeeel.Number.limit(Math.round(blue), 0, 255);
    
    /**
     * アルファ
     *
     * @type Number
     */
    this.alpha = Jeeel.Number.limit(alpha, 0, 1);
};

Jeeel.Object.Color.Rgb.prototype = {

    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Color.Rgb} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Color.Rgb(this.red, this.green, this.blue);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Object.Color.Rgb} item 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (item) {
        return this.red === item.red
            && this.green === item.green
            && this.blue === item.blue;
    },
    
    /**
     * RGBの並びでビット演算したRGB数値を返す
     * 
     * @return {Integer} RGB数値
     */
    valueOf: function () {
        return this.red << 16
             | this.green << 8
             | this.blue;
    },
    
    /**
     * RGB文字列に変換する
     * 
     * @param {String} [prefix] 接頭辞
     * @return {String} 小文字の16進数を接続した6桁+接頭辞の文字列
     */
    toRgbString: function (prefix) {
        var i, rgb =[this.red.toString(16), this.green.toString(16), this.blue.toString(16)];
        
        for (i = 3; i--;) {
            if (rgb[i].length < 2) {
                rgb[i] = '0' + rgb[i];
            }
        }
        
        return (prefix || '') + rgb.join('');
    },
    
    /**
     * RGBA文字列に変換する
     * 
     * @return {String} RGBA形式に変換した文字列
     */
    toRgbaString: function () {
        return 'rgba('
             + this.red
             + ', '
             + this.green
             + ', '
             + this.blue
             + ', '
             + this.alpha
             + ')';
    },

    /**
     * 文字列に変換する
     *
     * @param {Boolean} [toFunction] 関数表記に変換する時に指定
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function (toFunction) {
        if (toFunction) {
            return 'rgb('
                 + this.red
                 + ', '
                 + this.green
                 + ', '
                 + this.blue
                 + ')';
        }

        return this.toRgbString('#');
    }
};
