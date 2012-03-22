Jeeel.directory.Jeeel.Filter = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Filter/';
    }
};

Jeeel.Filter = {

    /**
     * コンストラクタ
     * 
     * @abstractClass フィルタークラスを作る際の抽象クラス
     */
    Abstract: function () {}
};

Jeeel.Filter.Abstract.prototype = {

    /**
     * 指定した値に対してフィルターを掛ける
     *
     * @param {Mixied} val フィルターを掛ける値
     * @return {Mixied} フィルターを掛けた後の値
     */
    filter: function (val) {
        if (Jeeel.Type.isHash(val)) {
            val = this._filterArray(val);
        } else {
            val = this._filter(val);
        }

        return val;
    },

    /**
     * 通常値の場合のメソッド<br />
     * 必ずオーバーライドしなければならない
     *
     * @param {Mixied} val フィルターを掛ける値
     * @return {Mixied} フィルターを掛けた後の値
     * @protected
     * @abstract
     */
    _filter: function (val) {
        throw new Error('_filterメソッドが実装されていません。');
    },

    /**
     * 配列式の場合のメソッド
     *
     * @param {Hash} arr フィルターを掛ける値のリスト
     * @return {Mixied} フィルターを掛けた後の値
     * @protected
     */
    _filterArray: function (arr) {
        var result = {};

        Jeeel.Hash.forEach(arr,
            function (val, key) {
                result[key] = this.filter(val);
            }, this
        );

        return result;
    }
};

Jeeel._Object.JeeelFilter = {
    
    getInputs: function (elm) {
        var selector = "input, select, textarea, button";
        var res = [], i, l;
        
        if (elm.querySelectorAll) {
            var sres = elm.querySelectorAll(selector);
            
            for (i = 0, l = sres.length; i < l; i++) {
                res[i] = sres[i];
            }
        } else {
            
            var tags = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];

            res = Jeeel.Dom.Core.Searcher.create(elm).getElementsByTagName(tags);
        }
        
        return res;
    },
    
    getInputName: Jeeel._Object.Jeeel.getInputName,
    
    repairInputName: function (names) {
        var name = [names[0]];
        
        for (var i = 1, l = names.length; i < l; i++) {
            name[name.length] = '[';

            name[name.length] = names[i];
            
            name[name.length] = ']';
        }
        
        return name.join('');
    }
};

Jeeel.file.Jeeel.Filter = ['Each', 'Chain', 'Join', 'Subset', 'Map', 'Cast', 'Hash', 'String', 'Url', 'Html'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Filter, Jeeel.file.Jeeel.Filter);
