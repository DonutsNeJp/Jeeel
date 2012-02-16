
Jeeel.directory.Jeeel.Object.Technical = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Object + 'Technical/';
    }
};

/**
 * Jeeel内部で使用している特殊クラスを保持するネームスペース
 */
Jeeel.Object.Technical = {

};

Jeeel.file.Jeeel.Object.Technical = ['LineIndex'];

if (Jeeel._debugMode) {
    Jeeel.file.Jeeel.Object.Technical[Jeeel.file.Jeeel.Object.Technical.length] = 'Trace';
    Jeeel.file.Jeeel.Object.Technical[Jeeel.file.Jeeel.Object.Technical.length] = 'Information';
}

Jeeel._autoImports(Jeeel.directory.Jeeel.Object.Technical, Jeeel.file.Jeeel.Object.Technical);
