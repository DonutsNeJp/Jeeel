Jeeel.directory.Jeeel.Gui = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Gui/';
    }
};

/**
 * GUI関連のネームスペース
 */
Jeeel.Gui = {
    
};

Jeeel.file.Jeeel.Gui = ['Abstract', 'Tooltip'/*, 'ColorPicker'*/, 'Scrollbar', 'Calendar', 'Mouse'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Gui, Jeeel.file.Jeeel.Gui);
