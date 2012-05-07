Jeeel.directory.Jeeel.Dom.Window.Opener = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Window + 'Opener/';
    }
};

/**
 * @namespace ウィンドウやダイアログを開くためのクラスがあるネームスペース
 */
Jeeel.Dom.Window.Opener = {

};

Jeeel.file.Jeeel.Dom.Window.Opener = ['Abstract', 'Window', 'Dialog'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Window.Opener, Jeeel.file.Jeeel.Dom.Window.Opener);