Jeeel.directory.Jeeel.Dom = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Dom/';
    }
};

/**
 * Domに関するネームスペース
 */
Jeeel.Dom = {

};

Jeeel.file.Jeeel.Dom = ['Node', 'Window', 'Document', 'Xml', 'Event', 'Style', 'Element', 'ElementOperator', 'SearchOption'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom, Jeeel.file.Jeeel.Dom);
