Jeeel.directory.Jeeel.Dom.Core = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom + 'Core/';
    }
};

Jeeel.Dom.Core = {
    
};

Jeeel.file.Jeeel.Dom.Core = ['Searcher'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Core, Jeeel.file.Jeeel.Dom.Core);

if (Jeeel.Dom._tmp) {
    Jeeel.Dom._tmp();
}