Jeeel.directory.Jeeel.Debug = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Debug/';
    }
};

/**
 * デバッグ関連の機能を保持するネームスペース
 */
Jeeel.Debug = {

};

Jeeel.file.Jeeel.Debug = ['ObjectExport', 'ObjectExpander', 'ErrorMessage', 'Timer', 'Console', 'Profiler', 'UnitTest', 'Debugger', 'Compressor'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Debug, Jeeel.file.Jeeel.Debug);
