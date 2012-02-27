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

Jeeel.file.Jeeel.Dom = ['Core', 'Node', 'Window', 'Document', 'Xml', 'Event', 'Style', 'Element', 'ElementOperator', 'SearchOption'];

if (Jeeel._auto) {
    Jeeel.Dom._tmp = function () {
        for (var i = 1, l = Jeeel.file.Jeeel.Dom.length; i < l; i++) {
            Jeeel._import(Jeeel.directory.Jeeel.Dom, Jeeel.file.Jeeel.Dom[i]);
        }

        delete Jeeel.Dom._tmp;
    };

    Jeeel._import(Jeeel.directory.Jeeel.Dom, Jeeel.file.Jeeel.Dom[0]);
}
