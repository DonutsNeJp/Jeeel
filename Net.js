Jeeel.directory.Jeeel.Net = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Net/';
    }
};

/**
 * ネット関連のネームスペース
 */
Jeeel.Net = {

};

Jeeel.file.Jeeel.Net = ['Submit', 'Ajax', 'Jsonp'];

if (Jeeel._extendMode.Net && Jeeel._global) {
    if (Jeeel._global.EventSource) {
        Jeeel.file.Jeeel.Net[Jeeel.file.Jeeel.Net.length] = 'Comet';
    }
    
    if (Jeeel._global.WebSocket) {
        Jeeel.file.Jeeel.Net[Jeeel.file.Jeeel.Net.length] = 'Socket';
    }
}

Jeeel._autoImports(Jeeel.directory.Jeeel.Net, Jeeel.file.Jeeel.Net);
