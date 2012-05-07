Jeeel.directory.Jeeel.Dom.Style.Custom = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Style + 'Custom/';
    }
};

/**
 * コンストラクタ
 * 
 * @class カスタムスタイルに対して操作を行うクラス
 * @param {Style} style 要素のスタイル
 * @param {Style} [computedStyle] 計算済みスタイル
 */
Jeeel.Dom.Style.Custom = function (style, computedStyle) {
    this._style = style;
    this._computedStyle = computedStyle || {};
};

/**
 * カスタムスタイルを登録する
 * 
 * @param {Function} part Jeeel.Dom.Style.Custom.createPartで作成したパーツ
 */
Jeeel.Dom.Style.Custom.register = function (part) {
    if ( ! part.partName || typeof part !== 'function') {
        throw new Error('カスタムパーツではありません。');
    }
    
    this.prototype[part.partName] = part;
};

/**
  * カスタムスタイルのパーツを作成する
  * 
  * @param {String} name キャメルケースの名前
  * @param {Function} get ゲッター
  * @param {Function} set セッター
  * @param {String} [originName] 本来の名前がある場合に指定(ハイフネーション)
  * @param {Function} [filter] フィルタ
  * @return {Function} カスタムパーツ
  */
Jeeel.Dom.Style.Custom.createPart = function (name, get, set, originName, filter) {
    var f = function(val, isFilter) {
        if (isFilter) {
            return filter.call(this, val);
        } else if (typeof val === 'undefined') {
            return get.call(this);
        }

        return set.call(this, val);
    };

    f.get = get;
    f.set = set;
    f.partName = name;
    f.originName = originName || null;
    f.usableFilter = !!filter;

    return f;
};

Jeeel.Dom.Style.Custom.prototype = {
    
    _style: null,
    
    _computedStyle: null,
    
    /**
     * コンストラクタ
     * 
     * @param {Style} style 操作スタイル
     */
    constructor: Jeeel.Dom.Style.Custom
};

Jeeel.file.Jeeel.Dom.Style.Custom = ['Default'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Custom, Jeeel.file.Jeeel.Dom.Style.Custom);