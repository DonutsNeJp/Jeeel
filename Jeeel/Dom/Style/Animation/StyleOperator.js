Jeeel.directory.Jeeel.Dom.Style.Animation.StyleOperator = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Style.Animation + 'StyleOperator/';
    }
};

/**
 * アニメーションの値に特殊な加工を施して変換するクラス
 */
Jeeel.Dom.Style.Animation.StyleOperator = {
    
    _operators: {},
    
    register: function (operator) {
        this._operators[operator.name] = operator;
    },
    
    /**
     * スタイルフィルターのパーツを作成する
     * 
     * @param {String} name キャメルケースの名前
     * @param {Function} filter アニメーション用の値に変換するフィルタ
     * @param {Function} unfilter アニメーション用の値から通常の値に変換するフィルタ
     * @return {Hash} フィルタパーツ
     */
    createOperator: function (name, filter, unfilter) {
        return {
            name: name,
            filter: filter,
            unfilter: unfilter
        };
    },
    
    filter: function (key, val) {
        var op = this._operators[key];
        
        if (op) {
            return op.filter(val);
        }
        
        return parseFloat(val);
    },
    
    unfilter: function (key, val, unit) {
        var op = this._operators[key];
        
        if (op) {
            return op.unfilter(val);
        }
        
        return val + (unit || 0);
    }
};

Jeeel.file.Jeeel.Dom.Style.Animation.StyleOperator = ['Default'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Animation.StyleOperator, Jeeel.file.Jeeel.Dom.Style.Animation.StyleOperator);