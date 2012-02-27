Jeeel.directory.Jeeel.Dom.Xpath = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Xpath/';
    }
};

/**
 * @ignore 未完成
 */
Jeeel.Dom.Xpath = function (xpath, document) {
    this._xpath = xpath;
    this._document = document;
};

Jeeel.Dom.Xpath.prototype = {
    _xpath: null,
    _document: null,
    
    getElements: function (target) {
        return [];
    },
    
    _init: function () {
        var doc = Jeeel._doc;
        
        delete this._init;
        
        if ( ! doc) {
            return;
        }
        
        if (doc.evaluate) {
            this.getElements = function (target) {
                return this._document.evaluate(this._xpath, target || this._document, null, 7, null);
            };
        } else if (doc.selectNodes) {
            this.getElements = function (target) {
                return (target || this._document).selectNodes(this._xpath);
            };
        }
    }
};

Jeeel.Dom.Xpath.prototype._init();

Jeeel.file.Jeeel.Dom.Xpath = ['ResultType'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Xpath, Jeeel.file.Jeeel.Dom.Xpath);