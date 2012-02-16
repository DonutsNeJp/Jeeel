
/**
 * コンストラクタ
 *
 * @class 指定したインデックスから指定要素数を指定値で埋めるフィルター(戻り値は配列なら配列、連想配列なら連想配列になる)
 * @augments Jeeel.Filter.Abstract
 * @param {Integer} index 開始インデックス
 * @param {Integer} length 挿入要素数
 * @param {Mixied} [value] 挿入値(デフォルトはnull)
 * @throws {Error} indexが整数でない場合に起こる
 * @throws {Error} lengthが整数でない場合に起こる
 */
Jeeel.Filter.Array.Fill = function (index, length, value) {
    Jeeel.Filter.Abstract.call(this);
    
    if ( ! Jeeel.Type.isInteger(index)) {
        throw new Error('indexが整数ではありません。');
    } else if ( ! Jeeel.Type.isInteger(length)) {
        throw new Error('lengthが整数ではありません。');
    }

    this._index = index;
    this._length = length + index;
    this._value = value || null;
};

/**
 * インスタンスの作成
 *
 * @param {Integer} index 開始インデックス
 * @param {Integer} length 挿入要素数
 * @param {Mixied} [value] 挿入値(デフォルトはnull)
 * @return {Jeeel.Filter.Array.Fill} 作成したインスタンス
 */
Jeeel.Filter.Array.Fill.create = function (index, length, value) {
    return new this(index, length, value);
};

Jeeel.Filter.Array.Fill.prototype = {
    
    /**
     * 開始インデックス
     * 
     * @type Integer
     * @private
     */
    _index: 0,
    
    /**
     * 挿入要素数
     * 
     * @type Integer
     * @private
     */
    _length: 0,
    
    /**
     * 挿入値
     * 
     * @type Mixied
     * @private
     */
    _value: null,
    
    /**
     * @private
     */
    _filter: function () {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterArray: function (array) {
        var result = Jeeel.Method.clone(array);

        for (var i = this._index; i < this._length; i++) {
            result[i] = this._value;
        }

        return result;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Array.Fill, Jeeel.Filter.Abstract);
