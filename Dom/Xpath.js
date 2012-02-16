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
Jeeel.Dom.Xpath = function (document) {
    this._document = document;
};

Jeeel.Dom.Xpath.prototype = {
    _document: null,
    
    evaluate: function (xpath, contextNode, namespaceResolver, resultType, result) {
        return this._document.evaluate(xpath, contextNode, namespaceResolver, resultType, result);
    }
};

Jeeel.file.Jeeel.Dom.Xpath = ['ResultType'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Xpath, Jeeel.file.Jeeel.Dom.Xpath);