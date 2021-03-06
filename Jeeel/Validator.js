Jeeel.directory.Jeeel.Validator = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Validator/';
    }
};

/**
 * @namespace バリデータに関するネームスペース
 */
Jeeel.Validator = {

    /**
     * コンストラクタ
     *
     * @abstractClass バリデータクラスを作る際の抽象クラス
     */
    Abstract: function () {}
};

Jeeel.Validator.Abstract.prototype = {

    /**
     * ヘルパーを作成して返す
     * 
     * @param {Mixied} val バリデートを掛ける対象値
     * @return {Jeeel.Validator.Helper} 作成したヘルパー
     * @protected
     */
    _createHelper: function (val) {
        return Jeeel.Validator.Helper.create(val);
    },

    /**
     * 指定した値に対してバリデートを掛ける
     *
     * @param {Mixied} val バリデートを掛ける値
     * @return {Hash} エラーを保持した連想配列リスト
     */
    validate: function (val) {
        var errors;
        
        if (Jeeel.Type.isHash(val)) {
            errors = this._validateEach(val);
        } else {
            errors = this._validate(val);
        }

        return errors;
    },

    /**
     * バリデートの内部メソッド<br />
     * 必ずオーバーライドしなければならない
     *
     * @param {Mixied} val バリデートを掛ける値
     * @return {Hash} エラーを保持した連想配列リスト
     * @protected
     * @abstract
     */
    _validate: function (val) {
        throw new Error('_validateメソッドが実装されていません。');
    },
    
    /**
     * 配列式の場合のメソッド
     *
     * @param {Hash} arr バリデートを掛ける値のリスト
     * @return {Hash} エラーを保持した連想配列リスト
     * @protected
     */
    _validateEach: function (arr) {
        var result = {};

        Jeeel.Hash.forEach(arr,
            function (val, key) {
                result[key] = this.validate(val);
            }, this
        );

        return result;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Validator.Abstract
};

Jeeel.file.Jeeel.Validator = ['Helper'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Validator, Jeeel.file.Jeeel.Validator);
