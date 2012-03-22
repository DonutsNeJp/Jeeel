Jeeel.directory.Jeeel.Dom.Style.Bundler = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Style + 'Bundler/';
    }
};

/**
 * コンストラクタ
 * 
 * @class カスタムスタイルに対して操作を行うクラス
 * @param {Style} customStyle 要素のスタイル
 */
Jeeel.Dom.Style.Bundler = function (customStyle) {
    this._customStyle = customStyle;
};

/**
 * バンドラーを登録する
 * 
 * @param {Function} filter バンドルのフィルター
 */
Jeeel.Dom.Style.Bundler.register = function (filter) {
    if (typeof filter !== 'function') {
        throw new Error('フィルターではありません。');
    }
    
    this.prototype._bundleFilters.push(filter);
};

Jeeel.Dom.Style.Bundler.prototype = {
    
    _customStyle: null,
    
    _bundleFilters: [],
    
    bundle: function (styles) {
      
        for (var i = this._bundleFilters.length; i--;) {
            styles = this._bundleFilters[i](styles, this._customStyle);
        }
        
        return styles;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Style} style 操作スタイル
     */
    constructor: Jeeel.Dom.Style.Bundler
};

Jeeel.file.Jeeel.Dom.Style.Bundler = ['Default'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Bundler, Jeeel.file.Jeeel.Dom.Style.Bundler);