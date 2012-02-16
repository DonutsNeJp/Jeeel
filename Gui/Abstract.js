
Jeeel.Gui.Abstract = function () {
    
};

Jeeel.Gui.Abstract.prototype = {
    /**
     * デフォルトのスタイルを記述した文字列
     * 
     * @type String
     */
    _defaultStyle: '',
    
    /**
     * 現在の読み込みスタイルのタグ
     * 
     * @type Element
     */
    _styleTag: null,
    
    /**
     * ユーザースタイルの読み込みを行う
     * 
     * @param {String} url CSSのURL
     * @return {Jeeel.Gui.Abstract} 自インスタンス
     */
    loadStyle: function (url) {
        Jeeel.Dom.Element.create(this._styleTag).remove();
        
        this._styleTag = Jeeel.Import.importStyle(url);
        
        return this;
    },
    
    /**
     * デフォルトのスタイルに戻す
     * 
     * @return {Jeeel.Gui.Abstract} 自インスタンス
     */
    resetStyle: function () {
        Jeeel.Dom.Element.create(this._styleTag).remove();
        
        this._styleTag = Jeeel.Import.addStyle(this._defaultStyle);
        
        return this;
    }
};
