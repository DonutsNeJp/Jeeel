Jeeel.directory.Jeeel.Dom.Style.Animation.Hook = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Style.Animation + 'Hook/';
    }
};

/**
 * コンストラクタ
 * 
 * @class フックに対して操作を行うクラス
 * @param {Element} element 要素
 * @param {Jeeel.Dom.Style} style スタイル
 */
Jeeel.Dom.Style.Animation.Hook = function (element, style) {
    this._element = element;
    this._style = style;
};

/**
 * フックを登録する
 * 
 * @param {String} name 
 * @param {Function} get 
 */
Jeeel.Dom.Style.Animation.Hook.register = function (name, get) {
    if (typeof get !== 'function') {
        throw new Error('フックではありません。');
    }
    
    this.prototype[name] = get;
};

Jeeel.Dom.Style.Animation.Hook.prototype = {
    
    _element: null,
    _style: null,
    
    /**
     * コンストラクタ
     * 
     * @param {Style} style 操作スタイル
     */
    constructor: Jeeel.Dom.Style.Animation.Hook
};

Jeeel.file.Jeeel.Dom.Style.Animation.Hook = ['Default'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Animation.Hook, Jeeel.file.Jeeel.Dom.Style.Animation.Hook);