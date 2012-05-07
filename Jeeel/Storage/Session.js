Jeeel.directory.Jeeel.Storage.Session = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Storage + 'Session/';
    }
};

/**
 * @namespace Session関連を扱うストレージのネームスペース
 */
Jeeel.Storage.Session = {

};

Jeeel.file.Jeeel.Storage.Session = ['Abstract', 'Cookie', 'Name'];

if (Jeeel._extendMode.WebStorage && Jeeel._global && Jeeel._global.sessionStorage && Jeeel._global.localStorage) {
    Jeeel.file.Jeeel.Storage.Session[Jeeel.file.Jeeel.Storage.Session.length] = 'WebStorage';
}

Jeeel._autoImports(Jeeel.directory.Jeeel.Storage.Session, Jeeel.file.Jeeel.Storage.Session);
