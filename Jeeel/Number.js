/**
 * コンストラクタ
 * 
 * @class 数値の複雑な処理をするクラス
 * @param {Number} [number] 基となる数値
 */
Jeeel.Number = function (number) {
    
    if ( ! Jeeel.Type.isSet(number)) {
        number = 0;
    }
    
    this._num = +number;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Number} [number] 基となる数値
 * @return {Jeeel.Number} 作成したインスタンス
 */
Jeeel.Number.create = function (number) {
    return new this(number);
};

/**
 * 数字を千単位でグループ化してフォーマットする
 * 
 * @param {Number} number 対象の数値
 * @param {String} [separator] 千単位を区切る文字列(デフォルトは , )
 * @param {String} [prefix] 接頭辞
 * @param {String} [suffix] 接尾辞
 * @return {String} 変換後の値
 */
Jeeel.Number.format = function (number, separator, prefix, suffix) {
    var str = (+number || 0).toString();
    var dpi = str.indexOf('.');
    var moi = str.indexOf('-') + 1;
    
    if (dpi < 0) {
        dpi = str.length;
    }
    
    var indexArr = [];

    for (var i = dpi - 3; i > moi; i -= 3) {
        indexArr[indexArr.length] = i;
    }

    return (prefix || '') + Jeeel.String.multiInsert(str, indexArr, separator || ',') + (suffix || '');
};

/**
 * 数値を指定範囲内に収める
 * 
 * @param {Number} number 対象の数値
 * @param {Number} min 最小値
 * @param {Number} max 最大値
 * @return {Number} 収めた後の数値
 */
Jeeel.Number.limit = function (number, min, max) {
    if (number < min) {
        number = min;
    }
    
    if (number > max) {
        number = max;
    }
    
    return number;
};

/**
 * 指定した整数の範囲以内の値をランダムで返す
 * 
 * @param {Integer} min 最小値(負数も可)
 * @param {Integer} max 最大値(負数も可)
 * @return {Integer} ランダム整数値(min &lt;= random &lt;= max)
 */
Jeeel.Number.random = function (min, max) {
    var r = max - min + 1;
    
    return Math.floor(min + Math.random() * r);
};

/**
 * 数値を百分率にして返す
 * 
 * @param {Number} number 対象の数値
 * @return {String} 百分率表記の文字列(後ろに%が付く)
 */
Jeeel.Number.percentage = function (number) {
    return number * 100 + '%';
};

/**
 * 指定した角度をラジアンに変換する
 * 
 * @param {Number} deg 角度
 * @return {Number} ラジアン
 */
Jeeel.Number.degreeToRadian = function (deg) {
    return deg / 180 * Math.PI;
};

/**
 * 指定したラジアンを角度に変換する
 * 
 * @param {Number} rad ラジアン
 * @return {Number} 角度
 */
Jeeel.Number.radianToDegree = function (rad) {
    return rad / Math.PI * 180;
};

/**
 * 合計値を求める
 * 
 * @param {Number} var_args 合計値を求める際に数を可変で引き渡す
 */
Jeeel.Number.getSum = function (var_args) {
    var i, sum = 0;
    
    for (i = arguments.length; i--;) {
        sum += arguments[i];
    }
    
    return sum;
};

/**
 * 平均値を求める
 * 
 * @param {Number} var_args 平均値を求める際に数を可変で引き渡す
 */
Jeeel.Number.getAvg = function (var_args) {
    return this.getSum.apply(this, arguments) / arguments.length;
};

/**
 * 最大公約数を求める
 * 
 * @param {Integer} base 最大公約数を求める際の数
 * @param {Integer} var_args 可変引数、2つ以上の数を指定する場合に渡す
 * @return {Integer} 最大公約数(正)
 */
Jeeel.Number.getGcd = function (base, var_args) {
    var i, j, l, r;
    
    for (i = 0, l = arguments.length - 1; i < l; i++) {
        j = i + 1;
        r = arguments[i] % arguments[j];

        arguments[j] = r === 0 ? arguments[j] : arguments.callee(arguments[j], r < 0 ? -r : r);
    }
    
    return arguments[l];
};

/**
 * 最小公倍数を求める
 * 
 * @param {Integer} base 最小公倍数を求める際の数
 * @param {Integer} var_args 可変引数、2つ以上の数を指定する場合に渡す
 * @return {Integer} 最小公倍数(正)
 */
Jeeel.Number.getLcm = function (base, var_args) {
    var i, j, l;
    
    for (i = 0, l = arguments.length - 1; i < l; i++) {
        j = i + 1;
        
        arguments[j] = arguments[i] * arguments[j] / this.getGcd(arguments[i], arguments[j]);
    }

    return arguments[l] < 0 ? -arguments[l] : arguments[l];
};

Jeeel.Number.prototype = {
  
    /**
     * 元の数値
     * 
     * @type Number
     * @private
     */
    _num: 0,
    
    /**
     * 数値を絶対値にする
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    abs: function () {
        this._num =  (this._num > 0 ? this._num : -this._num);
        
        return this;
    },
    
    /**
     * 数値を切り上げる
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    ceil: function () {
        this._num = Math.ceil(this._num);
        
        return this;
    },
    
    /**
     * 数値を切り下げる
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    floor: function () {
        this._num = Math.floor(this._num);
        
        return this;
    },
    
    /**
     * 数値を四捨五入する
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    round: function () {
        this._num = Math.round(this._num);
        
        return this;
    },
    
    /**
     * 数値を指定範囲に収める
     * 
     * @return {Jeeel.Number} 自インスタンス
     */
    limit: function (min, max) {
        this._num = this.constructor.limit(this._num, min, max);
        
        return this;
    },
    
    /**
     * 数値を千単位でグループ化してフォーマットする
     * 
     * @param {String} [separator] 千単位を区切る文字列(デフォルトは , )
     * @param {String} [prefix] 接頭辞
     * @param {String} [suffix] 接尾辞
     * @return {String} フォーマット後の文字列
     */
    toFormatted: function (separator, prefix, suffix) {
        return this.constructor.format(this._num, separator, prefix, suffix);
    },
    
    /**
     * 数値を百分率表記に変換する
     * 
     * @return {String} 百分率表記の文字列
     */
    toPercentage: function () {
        return this.constructor.percentage(this._num);
    },
    
    /**
     * インスタンスを文字列に変換する
     * 
     * @param {Integer} [radix] 進数を指定する場合に指定
     * @return {String} 文字列
     */
    toString: function (radix) {
        return (radix ? this._num.toString(radix) : this._num.toString());
    },
    
    /**
     * インスタンスを数値に変換する
     * 
     * @return {Number} 数値
     */
    valueOf: function () {
        return this._num;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Number} [number] 基となる数値
     * @constructor
     */
    constructor: Jeeel.Number
};
