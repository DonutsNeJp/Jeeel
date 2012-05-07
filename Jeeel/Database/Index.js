
Jeeel.directory.Jeeel.Database.Index = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Database + 'Index/';
    }
};

/**
 * @staticClass キーバリューストア型データベースのマスターにあたるstaticクラス
 * 
 * @ignore 未完成
 */
Jeeel.Database.Index = {
    
    /**
     * データベースへの接続を行う
     * 
     * @return {Jeeel.Database.Index.Connection} データベースとの接続インスタンス
     */
    connectDatabase: function (dbName, description) {
        
    }
};

Jeeel.file.Jeeel.Database.Index = ['Connection'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Database.Index, Jeeel.file.Jeeel.Database.Index);
