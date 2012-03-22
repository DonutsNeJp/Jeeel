
/**
 * コンストラクタ
 * 
 * @class 配列・連想配列に対して操作を行うクラス
 * @param {Hash} [params] 入力パラメータ
 * @throws {Error} paramsを指定してかつが配列式でない場合に起こる
 */
Jeeel.Parameter = function (params) {

    if ( ! params) {
        params = {};
    } else if ( ! Jeeel.Type.isHash(params)) {
        throw new Error('paramsには配列式が使えなければなりません。');
    }

    this._params = params;
};

/**
 * インスタンスの作成
 *
 * @param {Hash} [params] 入力パラメータ
 * @return {Jeeel.Parameter} 作成したインスタンス
 * @throws {Error} paramsを指定してかつが配列式でない場合に起こる
 */
Jeeel.Parameter.create = function (params) {
    return new this(params);
};

Jeeel.Parameter.prototype = {

    /**
     * パラメータ
     *
     * @type Hash
     * @private
     */
    _params: null,

    /**
     * エラー
     *
     * @type Hash
     * @private
     */
    _errors: null,

    /**
     * ストレージ
     *
     * @type Jeeel.Storage.Abstract
     * @private
     */
    _storage: null,
    
    /**
     * 指定したキーの値を取得する
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 取得値
     */
    get: function (key, defaultValue) {
        if ( ! (key in this._params)) {
            return defaultValue;
        } else {
            return this._params[key];
        }
    },

    /**
     * Hashの最初の値を取得する
     *
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 取得値
     */
    getOne: function (defaultValue) {
        var result;

        Jeeel.Hash.forEach(this._params,
            function (val) {

                result = val;

                return Jeeel.Hash.FOR_EACH_EXIT;
            }
        );

        if (Jeeel.Type.isEmpty(result)) {
            return defaultValue;
        }

        return result;
    },

    /**
     * 全ての値を返す
     *
     * @return {Hash} 取得値
     */
    getAll: function () {
        return this._params;
    },

    /**
     * 現インスタンスの配列に値を保存する
     *
     * @param {String} key 保存する値を示すキー
     * @param {Mixed} val 保存する値
     * @return {Jeeel.Parameter} 自インスタンス
     */
    set: function (key, val) {
        this._params[key] = val;

        return this;
    },

    /**
     * 全ての値を上書きする
     *
     * @param {Hash} params 上書きする値リスト
     * @return {Jeeel.Parameter} 自インスタンス
     * @throws {Error} paramsが配列式でない場合に起こる
     */
    setAll: function (params) {
        if ( ! Jeeel.Type.isHash(params)) {
           throw new Error('paramsには配列式が使えなければなりません。');
        }

        for (var key in params) {
            this._params[key] = params[key];
        }

        return this;
    },

    /**
     * 現在保持している内部値のキーのリストを作成して取得する
     * 
     * @return {String[]} キーのリスト
     */
    getKeys: function () {
        return Jeeel.Hash.getKeys(this._params);
    },

    /**
     * 現在保持している内部値のリストを作成して取得する
     *
     * @return {Array} キーのリスト
     */
    getValues: function () {
        return Jeeel.Hash.getValues(this._params);
    },
    
    /**
     * 指定したキーの値を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Parameter} 自インスタンス
     */
    unset: function (key) {
        delete this._params[key];

        return this;
    },

    /**
     * 指定したキーの値を保持しているかどうかを返す
     *
     * @param {String} key キー
     * @return {Boolean} 値を保持していたらtrueそれ以外はfalseを返す
     */
    has: function (key) {
        return key in this._params;
    },

    /**
     * パラメータにフィルターを掛けた値を新しくインスタンスとして返す
     *
     * @param {Jeeel.Filter.Abstract} filter Jeeel.Filter.Abstractを継承したクラスのフィルター
     * @param {String|String[]} keys 指定キーの要素のみを対象とする
     * @return {Jeeel.Parameter} フィルターを掛けた新しいインスタンス
     */
    filter: function (filter, keys) {
        var value;

        if (keys) {
            value = this.filterEach(filter, keys).getAll();
        }
        else {
            value = filter.filter(this.getAll());
        }

        if ( ! Jeeel.Type.isHash(value)) {
            value = [value];
        }

        return Jeeel.Parameter.create(value);
    },

    /**
     * フィルターを配列の各要素にそれぞれ掛けていく
     *
     * @param {Jeeel.Filter.Abstract} innerFilter 内部フィルター
     * @param {String[]} [keys] 操作許可キーリスト(初期値は全て)
     * @return {Jeeel.Parameter} フィルターを掛けた新しいインスタンス
     */
    filterEach: function (innerFilter, keys) {
        var filter = Jeeel.Filter.Each.create(innerFilter, keys);

        return this.filter(filter);
    },

    /**
     * 現インスタンスの内部値を文字列として結合し返す
     *
     * @param {String} [separator] 連結時の区切り文字列
     * @param {String[]} [keys] 連結するキーのリスト
     * @return {String} 結合後の値
     */
    join: function (separator, keys) {
        return this.filter(Jeeel.Filter.Join.create(separator, keys)).getOne('');
    },

    /**
     * バリデートを掛ける
     *
     * @param {Jeeel.Validator.Abstract} validator Jeeel.Validator.Abstractを継承したクラスのバリデータ
     * @return {Jeeel.Parameter} 自インスタンス
     */
    validate: function (validator) {
        if (this._errors === null) {
            this._errors = {};
        }

        this.setErrors(validator.validate(this.getAll()));

        return this;
    },

    /**
     * isVaildをバリデートしなければ通過できないようにする
     *
     * @return {Jeeel.Parameter} 自インスタンス
     */
    taint: function () {
        if (Jeeel.Type.isEmptyHash(this._errors)) {
            this._errors = null;
        }

        return this;
    },

    /**
     * isVaildをバリデートしなくても通過できるようにする
     *
     * @return {Jeeel.Parameter} 自インスタンス
     */
    unTaint: function () {
        this._errors = {};

        return this;
    },

    /**
     * エラーを全て返す
     *
     * @return {Hash} エラーのリスト
     */
    getErrors: function () {
        return this._errors;
    },

    /**
     * エラーを全て変更する
     *
     * @param {Hash} errors エラーのリスト
     * @return {Jeeel.Parameter} 自インスタンス
     */
    setErrors: function (errors) {
        this._errors = errors;

        return this;
    },

    /**
     * エラーをセットする
     *
     * @param {String} key エラーのキー
     * @param {Mixed} val エラーの内容
     * @return {Jeeel.Parameter} 自インスタンス
     */
    setError: function (key, val) {
        this._errors[key] = val;

        return this;
    },

    /**
     * エラーの追加を行う
     *
     * @param {String} key エラーのキー
     * @param {Mixed} val エラーの内容
     * @return {Jeeel.Parameter} 自インスタンス
     */
    addError: function (key, val) {
        if ( ! (key in this._errors)) {
            this._errors[key] = [];
        }
        else if ( ! Jeeel.Type.isArray(this._errors[key])) {
            this._errors[key] = [this._errors[key]];
        }

        this._errors[key].push(val);

        return this;
    },

    /**
     * バリーデータを全て通過したかどうかを返す
     *
     * @return {Boolean} 通過ならばtrueそれ以外はfalseを返す
     */
    isValid: function () {
        if (this._errors === null) {
            return false;
        }

        for (var key in this.getErrors()) {
            return false;
        }

        return true;
    },

    /**
     * keyで指定された値をとりだし、Jeeel.Parameterのインスタンスとして返す<br />
     * 取り出した値が配列ではなかった場合、かわりにdefaultが使われる<br />
     * defaultが配列ではなかった場合、[default]が使われる<br />
     * defaultが指定されなかった（またはnullだった)場合、[]が使われる
     *
     * @param {String} key 取りだす要素のキー
     * @param {Mixed} [defaultValue] デフォルト値
     * @return {Jeeel.Parameter} 取りだした要素を含んだインスタンス
     */
    getElement: function (key, defaultValue) {
        var val = this.get(key, null);

        if (val === null) {
            val = [];
        }

        if ( ! Jeeel.Type.isHash(val) && Jeeel.Type.isSet(defaultValue)) {

            if ( ! Jeeel.Type.isHash(defaultValue)) {
                defaultValue = [defaultValue];
            }

            val = defaultValue;
        }

        return Jeeel.Parameter.create(val);
    },

    /**
     * keysで指定された部分集合をJeeel.Parameterのインスタンスとして返す。<br />
     * defaultは、キーが存在しなかった場合のデフォルト値として使われる。<br />
     * defaultが配列array(x => y, ...) だった場合、キーxのデフォルトにyが適用される。<br />
     * defaultが配列で、キー '*' => z を持つ場合、すべてのキーのデフォルトにzが適用される。<br />
     * defaultが配列で、キー a => v を持ち、aが配列だった場合、<br />
     *     aで指定された全てのキーのデフォルトに、vが適用される<br />
     * '*' => z と 'x' => y が指定された場合、yが優先される<br />
     * defaultが配列ではなかった場合、すべてのキーに対して、defaultが適用される。<br />
     * defaultが指定されない場合、部分集合に含まれない。
     *
     * @param {String|String[]} keys 部分集合を表す複数のキー
     * @param {Mixed} [defaultValue] キーが存在しなかった場合のデフォルト値
     * @return {Jeeel.Parameter} 部分集合を持ったインスタンス
     */
    getSubset: function (keys, defaultValue) {
        return this.filter(Jeeel.Filter.Subset.create(keys, defaultValue));
    },

    /**
     * 現インスタンス内部の値をシリアライズして返す<br />
     * その際指定したキーの値のみをシリアライズ出来、<br />
     * かつその内部の部分配列をシリアライズ出来る
     *
     * @param {String} [key] 指定キー
     * @param {String|String[]} [subset] 部分配列を指定するキーリスト
     * @return {String} Json化した内部値
     */
    serialize: function (key, subset) {
        var params = (key ? this.getElement(key) : this);
        params = (subset ? params.getSubset(subset) : params);

        return Jeeel.Json.encode(params.getAll());
    },

    /**
     * Jeeel.Storage.Abstractを継承したストレージをセットする
     *
     * @param {Jeeel.Storage.Abstract} storage ストレージ
     * @return {Jeeel.Parameter} 自インスタンス
     */
    setStorage: function (storage) {
        this._storage = storage;

        return this;
    },

    /**
     * ストレージを取得する
     *
     * @return {Jeeel.Storage.Abstract} 取得したストレージ
     * @throws {Error} ストレージがセットされていない場合に投げられる
     */
    getStorage: function () {
        if ( ! this._storage) {
            throw new Error('ストレージがセットされていません。');
        }

        return this._storage;
    },


    /**
     * ストレージにパラメータを保存する
     *
     * @param {Jeeel.Storage.Abstract} [storage] 任意のストレージを使う場合に指定
     * @return {Jeeel.Parameter} 自インスタンス
     * @throws {Error} ストレージを指定せず、ストレージがセットされていない場合に投げられる
     */
    save: function (storage) {
        if ( ! storage) {
            storage = this.getStorage();
        }

        storage.save(this.getAll());

        return this;
    },

    /**
     * ストレージからパラメータを読み込む
     *
     * @param {Jeeel.Storage.Abstract} [storage] 任意のストレージを使う場合に指定
     * @return {Jeeel.Parameter} 自インスタンス
     * @throws {Error} ストレージを指定せず、ストレージがセットされていない場合に投げられる
     */
    load: function (storage) {
        if ( ! storage) {
            storage = this.getStorage();
        }

        this.setAll(storage.load());

        return this;
    },

    /**
     * 内部の保持値をGetパラメータ用の値に変更して返す<br />
     * Getパラメータの先頭に?はつかない
     *
     * @return {String} Getパラメータを示す文字列
     */
    toQueryString: function () {
        return Jeeel.Filter.Url.QueryString.create().filter(this._params);
    },

    /**
     * 内部要素にforeachをかける<br />
     * 詳しくはJeeel.Hash.forEach参照
     *
     * @param {Function} eachMethod コールバックメソッド
     * @param {Mixied} [thisArg] thisに相当する値
     * @return {Jeeel.Parameter} 自インスタンス
     * @see Jeeel.Hash.forEach
     */
    each: function (eachMethod, thisArg) {
        Jeeel.Hash.forEach(this._params, eachMethod, thisArg);
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Hash} [params] 入力パラメータ
     * @constructor
     */
    constructor: Jeeel.Parameter
};
