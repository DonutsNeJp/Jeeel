
/**
 * コンストラクタ
 * 
 * @class 分数を管理するクラス
 * @param {Number|String} numeric 分数化する数値もしくは数値文字列
 */
Jeeel.Number.Fraction = function (numeric) {};

/**
 * コンストラクタ
 * 
 * @class 分数を管理するクラス
 * @param {Integer} numerator 分子
 * @param {Integer} denominator 分母
 */
Jeeel.Number.Fraction = function (numerator, denominator) {
  
    switch (arguments.length) {
        case 1:
            var numeric = Jeeel.String.trim('' + arguments[0]);

            var pidx = numeric.lastIndexOf('.');
            denominator = 1;

            if (pidx + 1) {
                denominator = Math.pow(10, numeric.length - pidx - 1);
            }

            numerator = +(numeric.replace('.', ''));
            break;

        case 2:
            break;

        default:
            throw new Error('引数の数が違います。');
            break;
    }
    
    /**
     * 分子
     * 
     * @type Integer
     */
    this.numerator = +numerator;
    
    /**
     * 分母
     * 
     * @type Integer
     */
    this.denominator = +denominator;
};

Jeeel.Number.Fraction.prototype = {

    /**
     * 複製を行う
     *
     * @return {Jeeel.Number.Fraction} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Fraction(this.numerator, this.denominator);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Number.Fraction} fraction 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (fraction) {
        return this.numerator === fraction.numerator
            && this.denominator === fraction.denominator;
    },
    
    /**
     * 約分を行う
     * 
     * @return {Jeeel.Number.Fraction} 自インスタンス
     */
    reduce: function () {
        var gcd = Jeeel.Number.getGcd(this.numerator, this.denominator);
        
        this.numerator /= gcd;
        this.denominator /= gcd;
        
        return this;
    },
    
    /**
     * 通分を行う
     * 
     * @param {Jeeel.Number.Fraction} fraction 通分対象の分数インスタンス
     * @return {Jeeel.Number.Fraction} 自インスタンス
     */
    reduceCommonDenominator: function (fraction) {
        var commonNum = Jeeel.Number.getLcm(this.denominator, fraction.denominator) / this.denominator;
        
        this.numerator *= commonNum;
        this.denominator *= commonNum;
        
        return this;
    },
    
    /**
     * 分数を足し合わせる
     * 
     * @param {Jeeel.Number.Fraction} fraction 足し合わせる分数インスタンス
     * @return {Jeeel.Number.Fraction} 自インスタンス
     */
    add: function (fraction) {
        fraction = fraction.clone().reduceCommonDenominator(this);
        
        this.reduceCommonDenominator(fraction);
        
        this.numerator += fraction.numerator;
        
        return this;
    },
    
    /**
     * 分数を差し引く
     * 
     * @param {Jeeel.Number.Fraction} fraction 差し引く分数インスタンス
     * @return {Jeeel.Number.Fraction} 自インスタンス
     */
    sub: function (fraction) {
        fraction = fraction.clone().reduceCommonDenominator(this);
        
        this.reduceCommonDenominator(fraction);
        
        this.numerator -= fraction.numerator;
        
        return this;
    },
    
    /**
     * 分数を掛け合わせる
     * 
     * @param {Jeeel.Number.Fraction} fraction 掛け合わせる分数インスタンス
     * @return {Jeeel.Number.Fraction} 自インスタンス
     */
    mul: function (fraction) {
        this.numerator *= fraction.numerator;
        this.denominator *= fraction.denominator;
        
        return this;
    },
    
    /**
     * 分数を割る
     * 
     * @param {Jeeel.Number.Fraction} fraction 割る分数インスタンス
     * @return {Jeeel.Number.Fraction} 自インスタンス
     */
    div: function (fraction) {
        this.numerator *= fraction.denominator;
        this.denominator *= fraction.numerator;
        
        return this;
    },

    /**
     * 文字列に変換する
     *
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function () {
        return this.numerator + ' / ' + this.denominator;
    },
    
    /**
     * 数値に変換する
     * 
     * @return {Number} 数値に変換した自インスタンス
     */
    valueOf: function () {
        return this.numerator / this.denominator;
    }
};
