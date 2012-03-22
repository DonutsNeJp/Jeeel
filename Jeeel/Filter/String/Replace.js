
/**
 * コンストラクタ
 *
 * @class 対象の要素に対して文字列として扱い文字列置換を行うフィルター
 * @augments Jeeel.Filter.Abstract
 * @param {String|RegExp} reg 検索パターン及び検索文字列
 * @param {String} replace 置換後の文字列
 * @throws {Error} regが文字列・正規表現どちらでもない場合に投げられる
 * @throws {Error} replaceが文字列ではない場合に投げられる
 */
Jeeel.Filter.String.Replace = function (reg, replace) {
    Jeeel.Filter.Abstract.call(this);

    if ( ! Jeeel.Type.isString(reg) && ! (reg instanceof RegExp)) {
        throw new Error('regが文字列でも正規表現でもありません。');
    }

    if ( ! Jeeel.Type.isString(replace)) {
        throw new Error('replaceが文字列ではありません。');
    }

    this._reg = reg;
    this._replace = replace;
};

/**
 * インスタンスの作成
 *
 * @param {String|RegExp} reg 検索パターン及び検索文字列
 * @param {String} replace 置換後の文字列
 * @return {Jeeel.Filter.String.Replace} 作成したインスタンス
 */
Jeeel.Filter.String.Replace.create = function (reg, replace) {
    return new this(reg, replace);
};

Jeeel.Filter.String.Replace.prototype = {
    
    /**
     * 検索パターン及び検索文字列
     * 
     * @type String|RegExp
     * @private
     */
    _reg: '',
    
    /**
     * 置換文字列
     * 
     * @type String
     * @private
     */
    _replace: '',
    
    /**
     * @private
     */
    _filter: function (val) {
        val = '' + val;

        return val.replace(this._reg, this._replace);
    }
};

Jeeel.Class.extend(Jeeel.Filter.String.Replace, Jeeel.Filter.Abstract);
