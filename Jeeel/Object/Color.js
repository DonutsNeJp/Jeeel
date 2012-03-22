
Jeeel.directory.Jeeel.Object.Color = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Object + 'Color/';
    }
};

/**
 * コンストラクタ
 *
 * @class 色を扱うクラス
 * @param {Mixied} color 色を表す値
 */
Jeeel.Object.Color = function (color) {
    var rgb, hsl;
    
    if (color instanceof this.constructor.Rgb) {
        rgb = color;
        hsl = this.constructor.rgbToHsl(rgb);
    } else if (color instanceof this.constructor.Hsl) {
        hsl = color;
        rgb = this.constructor.hslToRgb(hsl);
    }
    
    this._rgb = rgb;
    this._hsl = hsl;
};

/**
 * RGBから色を作成する
 *
 * @param {String} rgbString RGBを示す文字列(先頭に#や0xが付いていても良い)<br />
 *                            1色につき1桁もしくは2桁
 * @return {Jeeel.Object.Color} 作成したインスタンス
 */
Jeeel.Object.Color.createRgbString = function (rgbString) {
    return new this(new this.Rgb(rgbString));
};

/**
 * RGBから色を作成する
 *
 * @param {Integer} red 赤
 * @param {Integer} green 緑
 * @param {Integer} blue 青
 * @param {Number} [alpha] アルファ
 * @return {Jeeel.Object.Color} 作成したインスタンス
 */
Jeeel.Object.Color.createRgb = function (red, green, blue, alpha) {
    if ( ! alpha && alpha !== 0) {
        alpha = 1;
    }
    
    return new this(new this.Rgb(red, green, blue, alpha));
};

/**
 * HSLから色を作成する
 *
 * @param {Integer} hue 色相
 * @param {Number} saturation 彩度
 * @param {Number} luminance 輝度
 * @param {Number} [alpha] アルファ
 * @return {Jeeel.Object.Color} 作成したインスタンス
 */
Jeeel.Object.Color.createHsl = function (hue, saturation, luminance, alpha) {
    if ( ! alpha && alpha !== 0) {
        alpha = 1;
    }
    
    return new this(new this.Hsl(hue, saturation, luminance, alpha));
};

/**
 * RGBからHSLを計算する
 * 
 * @param {Integer} red 赤
 * @param {Integer} green 緑
 * @param {Integer} blue 青
 * @return {Hash} hue: 色相, saturation: 彩度, luminance: 輝度
 */
Jeeel.Object.Color.calculateHsl = function (red, green, blue) {
    var r = Jeeel.Number.limit(Math.round(red, 0, 255)) / 255;
    var g = Jeeel.Number.limit(Math.round(green, 0, 255)) / 255;
    var b = Jeeel.Number.limit(Math.round(blue, 0, 255)) / 255;

    var max, min,
        h, l, s;
    
    max = Math.max(Math.max(r, g), b);
    min = Math.min(Math.min(r, g), b);
    
    l = (max + min) / 2;

    if (max === min) {
        s = 0;
        h = 0;
    } else {
        var sub = max - min;
        
        if (l <= 0.5) {
            s = sub / (max + min);
        } else {
            s = sub / (2 - (max + min));
        }

        var cr = (max - r) / sub;
        var cg = (max - g) / sub;
        var cb = (max - b) / sub;

        switch (max) {
            case r:
                h = cb - cg;
                break;

            case g:
                h = 2 + cr - cb;
                break;

            case b:
                h = 4 + cg - cr;
                break;
                
            default:
                break;
        }

        h = 60 * h;

        if (h < 0) {
            h += 360;
        }
    }
    
    return {hue: h, saturation: s, luminance: l};
};

/**
 * RGBインスタンスをHSLインスタンスに変換する
 * 
 * @param {Jeeel.Object.Color.Rgb} rgb RGBインスタンス
 * @return {Jeeel.Object.Color.Hsl} 変換後のインスタンス
 */
Jeeel.Object.Color.rgbToHsl = function (rgb) {
    var hsl = this.calculateHsl(rgb.red, rgb.green, rgb.blue);

    return new Jeeel.Object.Color.Hsl(hsl.hue, hsl.saturation, hsl.luminance);
};

/**
 * HSLからRGBを計算する
 * 
 * @param {Integer} hue 色相
 * @param {Number} saturation 彩度
 * @param {Number} luminance 輝度
 * @return {Hash} red: 赤, green: 緑, blue: 青
 */
Jeeel.Object.Color.calculateRgb = function (hue, saturation, luminance) {
    var h = Jeeel.Number.limit(hue, 0, 360);
    var s = Jeeel.Number.limit(saturation, 0, 1);
    var l = Jeeel.Number.limit(luminance, 0, 1);
    
    var max, min;
    var list = [];

    if (l <= 0.5) {
        max = l * (1 + s);
    } else {
        max = l * (1 - s) + s;
    }

    min = 2 * l - max;

    if (s === 0) {
        list[0] = list[1] = list[2] = l;
    } else {
        var hVal = h + 120;
        var sub = max - min;
        
        if (hVal >= 360) {
            hVal = hVal - 360;
        }

        for (var i = 0; i < 3; i++) {

            if (hVal < 60) {
                list[i] = min + sub * hVal / 60;
            } else if(hVal < 180) {
                list[i] = max;
            } else if(hVal < 240) {
                list[i] = min + sub * (240 - hVal) / 60;
            } else {
                list[i] = min;
            }

            if (i === 0) {
                hVal = h;
            } else if(i === 1) {
                hVal = h - 120;

                if (hVal < 0) {
                    hVal = hVal + 360;
                }
            }
        }
    }

    return {red: list[0] * 255, green: list[1] * 255, blue: list[2] * 255};
};

/**
 * HSLインスタンスをRGBインスタンスに変換する
 * 
 * @param {Jeeel.Object.Color.Hsl} hsl HSLインスタンス
 * @return {Jeeel.Object.Color.Rgb} 変換後のインスタンス
 */
Jeeel.Object.Color.hslToRgb = function (hsl) {
    var rgb = this.calculateRgb(hsl.hue, hsl.saturation, hsl.luminance);

    return new Jeeel.Object.Color.Rgb(rgb.red, rgb.green, rgb.blue);
};

Jeeel.Object.Color.prototype = {
  
    /**
     * RGB形式の色を扱うオブジェクト
     * 
     * @type Jeeel.Object.Color.Rgb
     * @private
     */
    _rgb: null,
    
    /**
     * HSL形式の色を扱うオブジェクト
     * 
     * @type Jeeel.Object.Color.Hsl
     * @private
     */
    _hsl: null,
    
    /**
     * RGBインスタンスに変換する
     * 
     * @return {Jeeel.Object.Color.Rgb} RGBインスタンス
     */
    toRgb: function () {
        return this._rgb;
    },
    
    /**
     * HSLインスタンスに変換する
     * 
     * @return {Jeeel.Object.Color.Hsl} RGBインスタンス
     */
    toHsl: function () {
        return this._hsl;
    },
    
    /**
     * アルファブレンドを行い新しいインスタンスを返す
     * 
     * @param {Jeeel.Object.Color|Jeeel.Object.Color.Rgb|Jeeel.Object.Color.Hsl} color ブレンドする色
     * @param {Number} [alpha] ブレンドする側アルファ値(省略時はブレンド色のアルファ値を参照する)
     * @return {Jeeel.Object.Color} ブレンド後のインスタンス
     */
    alphaBlend: function (color, alpha) {
        if (color instanceof this.constructor.Rgb) {
            color = new this.constructor(color);
        } else if (color instanceof this.constructor.Hsl) {
            color = new this.constructor(color);
        } else if ( ! (color instanceof this.constructor)) {
            throw new Error('colorが不明な型です。');
        }

        var destColor   = this._rgb;
        var sourceColor = color.toRgb();

        var res;
        var dstA = parseInt(destColor.alpha * 0xFF);
        var dstR = destColor.red;
        var dstG = destColor.green;
        var dstB = destColor.blue;
        
        if ( ! alpha && alpha !== 0) {
            alpha = sourceColor.alpha;
        }
        
        alpha = parseInt(alpha * 0xFF);

        if (alpha === 0) {
            res = new this.constructor(destColor.clone());
        }
        else if (alpha === 0xFF || dstA === 0) {
            res = new this.constructor(sourceColor.clone());
        }
        else if (dstA === 0xFF) {
            res = this.constructor.createRgb(
                ((sourceColor.red - dstR) * alpha >> 8) + dstR, 
                ((sourceColor.green - dstG) * alpha >> 8) + dstG, 
                ((sourceColor.blue - dstB) * alpha >> 8) + dstB, 
                1
            );
        }
        else {
            dstA = ((0xFF - alpha) * dstA >> 8) & 0xFF;

            res = (alpha + dstA) & 0xFF;

            res = this.constructor.createRgb(
                (sourceColor.red   * alpha + dstR * dstA) / res, 
                (sourceColor.green * alpha + dstG * dstA) / res, 
                (sourceColor.blue  * alpha + dstB * dstA) / res, 
                res / 0xFF
            );
        }
        
        alpha = parseInt(res._rgb.alpha * 0xFF);

        if (alpha === 0) {
            res = this.constructor.createRgb(0, 0, 0, 0);
        }
        else if (alpha !== 0xFF) {
            res = this.constructor.createRgb(
                res._rgb.red * alpha >> 8, 
                res._rgb.green * alpha >> 8, 
                res._rgb.blue * alpha >> 8, 
                alpha / 0xFF
            );
        }

        return res;
    },
    
    /**
     * 加算合成を行い新しいインスタンスを返す
     * 
     * @param {Jeeel.Object.Color|Jeeel.Object.Color.Rgb|Jeeel.Object.Color.Hsl} color 加算する色
     * @param {Number} [alpha] ブレンドする側アルファ値(省略時はブレンド色のアルファ値を参照する)
     * @return {Jeeel.Object.Color} ブレンド後のインスタンス
     */
    addBlend: function (color, alpha) {
        if (color instanceof this.constructor.Rgb) {
            color = new this.constructor(color);
        } else if (color instanceof this.constructor.Hsl) {
            color = new this.constructor(color);
        } else if ( ! (color instanceof this.constructor)) {
            throw new Error('colorが不明な型です。');
        }
        
        var destColor   = this._rgb;
        var sourceColor = color.toRgb();
        
        var res;
        var srcR = sourceColor.red;
        var srcG = sourceColor.green;
        var srcB = sourceColor.blue;
        var dstA = parseInt(destColor.alpha * 0xFF);
        var dstR = destColor.red;
        var dstG = destColor.green;
        var dstB = destColor.blue;
        var tmp;
        
        if ( ! alpha && alpha !== 0) {
            alpha = sourceColor.alpha;
        }
        
        alpha = parseInt(alpha * 0xFF);
        
        if (alpha === 0) {
            res = destColor.clone();
        }
        else if (alpha === 0xFF && dstA === 0xFF) {
            res = this.constructor.createRgb(
                ((tmp = srcR + dstR) > 0xFF ? 0xFF : tmp), 
                ((tmp = srcG + dstG) > 0xFF ? 0xFF : tmp), 
                ((tmp = srcB + dstB) > 0xFF ? 0xFF : tmp), 
                1
            );
        }
        else {
            res = this.constructor.createRgb(
                (((tmp = (srcR * alpha + dstR * dstA) >> 8)) > 0xFF ? 0xFF : tmp), 
                (((tmp = (srcG * alpha + dstG * dstA) >> 8)) > 0xFF ? 0xFF : tmp), 
                (((tmp = (srcB * alpha + dstB * dstA) >> 8)) > 0xFF ? 0xFF : tmp), 
                dstA / 0xFF
            );
        }

        return res;
    },
    
    /**
     * 減算合成を行い新しいインスタンスを返す
     * 
     * @param {Jeeel.Object.Color|Jeeel.Object.Color.Rgb|Jeeel.Object.Color.Hsl} color 減算する色
     * @param {Number} [alpha] ブレンドする側アルファ値(省略時はブレンド色のアルファ値を参照する)
     * @return {Jeeel.Object.Color} ブレンド後のインスタンス
     */
    subBlend: function(color, alpha) {
        if (color instanceof this.constructor.Rgb) {
            color = new this.constructor(color);
        } else if (color instanceof this.constructor.Hsl) {
            color = new this.constructor(color);
        } else if ( ! (color instanceof this.constructor)) {
            throw new Error('colorが不明な型です。');
        }
        
        var destColor   = this._rgb;
        var sourceColor = color.toRgb();
        
        var res;
        var srcR = sourceColor.red;
        var srcG = sourceColor.green;
        var srcB = sourceColor.blue;
        var dstA = parseInt(destColor.alpha * 0xFF);
        var dstR = destColor.red;
        var dstG = destColor.green;
        var dstB = destColor.blue;
        var tmp;
        
        if ( ! alpha && alpha !== 0) {
            alpha = sourceColor.alpha;
        }
        
        alpha = parseInt(alpha * 0xFF);

        if (alpha === 0) {
            res = destColor.clone();
        }
        else if (alpha === 0xFF && dstA === 0xFF) {
            res = this.constructor.createRgb(
                ((tmp = dstR - srcR) < 0 ? 0 : tmp),
                ((tmp = dstG - srcG) < 0 ? 0 : tmp),
                ((tmp = dstB - srcB) < 0 ? 0 : tmp),
                1
            );
        }
        else {
            res = this.constructor.createRgb(
                ((tmp = (dstR * dstA - srcR * alpha) >> 8) < 0 ? 0 : tmp),
                ((tmp = (dstG * dstA - srcG * alpha) >> 8) < 0 ? 0 : tmp),
                ((tmp = (dstB * dstA - srcB * alpha) >> 8) < 0 ? 0 : tmp),
                dstA / 0xFF
            );
        }

        return res;
    },
    
    /**
     * 乗算合成を行い新しいインスタンスを返す
     * 
     * @param {Jeeel.Object.Color|Jeeel.Object.Color.Rgb|Jeeel.Object.Color.Hsl} color 乗算する色
     * @param {Number} [alpha] ブレンドする側アルファ値(省略時はブレンド色のアルファ値を参照する)
     * @return {Jeeel.Object.Color} ブレンド後のインスタンス
     */
    mulBlend: function (color, alpha) {
        if (color instanceof this.constructor.Rgb) {
            color = new this.constructor(color);
        } else if (color instanceof this.constructor.Hsl) {
            color = new this.constructor(color);
        } else if ( ! (color instanceof this.constructor)) {
            throw new Error('colorが不明な型です。');
        }
        
        var destColor   = this._rgb;
        var sourceColor = color.toRgb();
        
        var res;
        var srcR = sourceColor.red;
        var srcG = sourceColor.green;
        var srcB = sourceColor.blue;
        var dstA = parseInt(destColor.alpha * 0xFF);
        var dstR = destColor.red;
        var dstG = destColor.green;
        var dstB = destColor.blue;
        
        if ( ! alpha && alpha !== 0) {
            alpha = sourceColor.alpha;
        }
        
        alpha = parseInt(alpha * 0xFF);

        if (alpha === 0) {
            res = destColor.clone();
        }
        else if (alpha === 0xFF && dstA === 0xFF) {
            res = this.constructor.createRgb(
                (srcR * dstR >> 8),
                (srcG * dstG >> 8),
                (srcB * dstB >> 8),
                1
            );
        }
        else {
            res = this.constructor.createRgb(
                ((dstR * dstA >> 8) * (0xFF + ((srcR - 0xFF) * alpha >> 8)) >> 8),
                ((dstG * dstA >> 8) * (0xFF + ((srcG - 0xFF) * alpha >> 8)) >> 8),
                ((dstB * dstA >> 8) * (0xFF + ((srcB - 0xFF) * alpha >> 8)) >> 8),
                dstA / 0xFF
            );
        }

        return res;
    },
    
    /**
     * 除算合成を行い新しいインスタンスを返す
     * 
     * @param {Jeeel.Object.Color|Jeeel.Object.Color.Rgb|Jeeel.Object.Color.Hsl} color 除算する色
     * @param {Number} [alpha] ブレンドする側アルファ値(省略時はブレンド色のアルファ値を参照する)
     * @return {Jeeel.Object.Color} ブレンド後のインスタンス
     */
    divBlend: function (color, alpha) {
        if (color instanceof this.constructor.Rgb) {
            color = new this.constructor(color);
        } else if (color instanceof this.constructor.Hsl) {
            color = new this.constructor(color);
        } else if ( ! (color instanceof this.constructor)) {
            throw new Error('colorが不明な型です。');
        }
        
        var destColor   = this._rgb;
        var sourceColor = color.toRgb();
        
        var res;
        var srcR = sourceColor.red;
        var srcG = sourceColor.green;
        var srcB = sourceColor.blue;
        var dstA = parseInt(destColor.alpha * 0xFF);
        var dstR = destColor.red;
        var dstG = destColor.green;
        var dstB = destColor.blue;
        
        if ( ! alpha && alpha !== 0) {
            alpha = sourceColor.alpha;
        }
        
        alpha = parseInt(alpha * 0xFF);

        if (alpha === 0) {
            res = destColor.clone();
        }
        else if (alpha === 0xFF && dstA === 0xFF) {
            res = this.constructor.createRgb(
                ((dstR << 8) / (srcR + 1)),
                ((dstG << 8) / (srcG + 1)),
                ((dstB << 8) / (srcB + 1)),
                1
            );
        }
        else {
            res = this.constructor.createRgb(
                ((dstR * dstA) / ((0xFF + ((srcR - 0xFF) * alpha >> 8)) + 1)),
                ((dstG * dstA) / ((0xFF + ((srcG - 0xFF) * alpha >> 8)) + 1)),
                ((dstB * dstA) / ((0xFF + ((srcB - 0xFF) * alpha >> 8)) + 1)),
                dstA / 0xFF
            );
        }

        return res;
    },
    
    /**
     * コンストラクタ
     *
     * @param {Mixied} color 色を表す値
     * @constructor
     */
    constructor: Jeeel.Object.Color
};

Jeeel.file.Jeeel.Object.Color = ['Rgb', 'Hsl', 'Code'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Object.Color, Jeeel.file.Jeeel.Object.Color);