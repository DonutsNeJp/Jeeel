
/**
 * ネームスペースに関するモジュール
 * @ignore
 */
Jeeel.Namespace = {
  
    /**
     * 指定したネームスペースを作成する<br />
     * その際存在するネームスペースは再利用される
     * 
     * @param {String} namespace ネームスペース(例: Jeeel.AppやJeeel)
     * @param {Object} [object] ネームスペースに追加するオブジェクト値(ネームスペースが未定義時にしか意味が無い)
     * @return {Object} ネームスペース
     */
    create: function (namespace, object) {
        var names = namespace.split('.');
        var parent = Jeeel._global;

        for (var i = 0, l = names.length - 1; i <= l; i++) {
            if ( ! (names[i] in parent)) {

                if (i == l) {
                    parent[names[i]] = object || {};
                } else {
                    parent[names[i]] = {};
                }
            }

            parent = parent[names[i]];
        }

        return parent;
    },
    
    /**
     * ネームスペースをグローバルに引き上げる<br />
     * その際末尾の値がオブジェクトだった場合は全て短かいされ
     * 
     * @param {String} namespace ネームスペース(例: Jeeel.AppやJeeel)
     * @return {Jeeel.Namespace} 自クラス
     */
    use: function (namespace) {
    
        var names = namespace.split('.');
        var parent = Jeeel._global;

        for (var i = 0, l = names.length - 1; i < l; i++) {
            if ( ! (names[i] in parent)) {
                throw new Error('指定したネームスペースは存在しません。');
            }

            parent = parent[names[i]];
        }

        if (i !== 0) {
            Jeeel._global[names[i]] = parent[names[i]];
        }
        
        return this;
    }
};
