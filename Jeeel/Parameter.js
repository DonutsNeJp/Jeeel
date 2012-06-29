Jeeel.directory.Jeeel.Parameter = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Parameter/';
    }
};

/**
 * コンストラクタ
 * 
 * @class 配列・連想配列に対して操作を行うクラス
 * @implements Jeeel.Parameter.Filter.Interface, Jeeel.Parameter.Validator.Interface
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
    this._errors = {};
    this._fieldList = new this.constructor.FieldList();
    this._validators = this.constructor._validators.concat();
    this._filters = this.constructor._filters.concat();
    
    if ( ! Jeeel.Parameter._lock && ! Jeeel.Language.hasLanguage('Parameter.Validator')) {
        Jeeel.Parameter._lock = true;
        
        Jeeel.Language.loadLanguage('Parameter.Validator', function () {
            Jeeel.Parameter._lock = false;
        });
    }
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

Jeeel.Parameter._validators = [];
Jeeel.Parameter._filters = [];
Jeeel.Parameter._activeParameter = null;
Jeeel.Parameter._activeField = null;

/**
 * 初期で使用するバリデータを追加する
 * 
 * @param {Jeeel.Parameter.Validator.Interface} validator
 */
Jeeel.Parameter.addDefaultValidator = function (validator) {
    this._validators.push(validator);
};

/**
 * 初期で使用するフィルタを追加する
 * 
 * @param {Jeeel.Parameter.Filter.Interface} filter
 */
Jeeel.Parameter.addDefaultFilter = function (filter) {
    this._filters.push(filter);
};

/**
 * 現在処理中のパラメータを取得する
 * 
 * @return {Jeeel.Parameter} パラメータ
 */
Jeeel.Parameter.getActiveParameter = function () {
    return this._activeParameter;
};

/**
 * 現在処理中のフィールドを取得する
 * 
 * @return {Jeeel.Parameter.Field} フィールド
 */
Jeeel.Parameter.getActiveField = function () {
    return this._activeField;
};

/**
 * 現在処理中のパラメータを設定する
 * 
 * @param {Jeeel.Parameter} parameter パラメータ
 */
Jeeel.Parameter._setActiveParameter = function (parameter) {
    this._activeParameter = parameter || null;
};

/**
 * 現在処理中のフィールドを設定する
 * 
 * @param {Jeeel.Parameter.Field} field フィールド
 */
Jeeel.Parameter._setActiveField = function (field) {
    this._activeField = field || null;
};

Jeeel.Parameter.prototype = {

    /**
     * パラメータ
     *
     * @type Hash
     * @private
     */
    _params: {},
    
    /**
     * フィールドリスト
     * 
     * @type Jeeel.Parameter.FieldList
     * @private
     */
    _fieldList: null,
    
    /**
     * バリデータリスト
     * 
     * @type Jeeel.Parameter.Validator.Abstract[]
     * @private
     */
    _validators: [],
    
    /**
     * フィルタリスト
     * 
     * @type Jeeel.Parameter.Filter.Abstract[]
     * @private
     */
    _filters: [],

    /**
     * エラー
     *
     * @type Hash
     * @private
     */
    _errors: {},
    
    /**
     * バリデート済みかどうか
     * 
     * @type Boolean
     * @private
     */
    _validated: true,

    /**
     * ストレージ
     *
     * @type Jeeel.Storage.Abstract
     * @private
     */
    _storage: null,
    
    /**
     * バリデータを追加する
     * 
     * @param {Jeeel.Parameter.Validator.Abstract} validator バリデータ
     * @return {Jeeel.Parameter} 自インスタンス
     */
    addValidator: function (validator) {
        this._validators.push(validator);
        
        return this;
    },
    
    /**
     * フィルタを追加する
     * 
     * @param {Jeeel.Parameter.Filter.Abstract} filter フィルタ
     * @return {Jeeel.Parameter} 自インスタンス
     */
    addFilter: function (filter) {
        this._filters.push(filter);
        
        return this;
    },
    
    /**
     * フィルタメソッドが呼べるかどうかを返す
     * 
     * @param {String} name フィルタ名
     * @return {Boolean} フィルタメソッドが呼べるかどうか
     */
    hasFiltration: function (name) {
        var fname = '_filter' + Jeeel.String.toPascalCase(name);
        
        if (this[fname] && typeof this[fname] === 'function') {
            return true;
        }
        
        for (var i = this._filters.length; i--;) {
            if (this._filters[i].hasFiltration(name)) {
                return true;
            }
        }
        
        return false;
    },
    
    /**
     * フィルタメソッドが取得する
     * 
     * @param {String} name フィルタ名
     * @return {Jeeel.Function.Callback} コールバック
     */
    getFiltration: function (name) {
        var fname = '_filter' + Jeeel.String.toPascalCase(name);
        
        if (this[fname] && typeof this[fname] === 'function') {
            return new Jeeel.Function.Callback(fname, this);
        }
        
        for (var i = this._filters.length; i--;) {
            if (this._filters[i].hasFiltration(name)) {
                return this._filters[i].getFiltration(name);
            }
        }
        
        return null;
    },
    
    /**
     * バリデートメソッドが呼べるかどうかを返す
     * 
     * @param {String} name バリデート名
     * @return {Boolean} バリデートメソッドが呼べるかどうか
     */
    hasValidation: function (name) {
        var vname = '_validate' + Jeeel.String.toPascalCase(name);
        
        if (this[vname] && typeof this[vname] === 'function') {
            return true;
        }
        
        for (var i = this._validators.length; i--;) {
            if (this._validators[i].hasValidation(name)) {
                return true;
            }
        }
        
        return false;
    },
    
    /**
     * バリデートメソッドを取得する
     * 
     * @param {String} name バリデート名
     * @return {Jeeel.Function.Callback} コールバック
     */
    getValidation: function (name) {
        var vname = '_validate' + Jeeel.String.toPascalCase(name);
        
        if (this[vname] && typeof this[vname] === 'function') {
            return new Jeeel.Function.Callback(vname, this);
        }
        
        for (var i = this._validators.length; i--;) {
            if (this._validators[i].hasValidation(name)) {
                return this._validators[i].getValidation(name);
            }
        }
        
        return null;
    },
    
    /**
     * 指定したキーの値を取得する
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 取得値
     */
    get: function (key, defaultValue) {
        return (key in this._params) ? this._params[key] : defaultValue;
    },

    /**
     * Hashの最初の値を取得する
     *
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 取得値
     * @deprecated 今後削除される予定
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
        
        var self = this;

        Jeeel.Hash.forEach(params,
            function (val, key) {
                self._params[key] = val;
            }
        );

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
     * 現在の内部の値を全て破棄する
     * 
     * @return {Jeeel.Parameter} 自インスタンス
     */
    clear: function () {
        this._params = {};
        
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
     * フィールドを全て取得する
     * 
     * @return {Jeeel.Parameter.Field[]} フィールドのリスト
     */
    getFields: function () {
        var fields = this._fieldList.getFieldAll();
        
        var res = [];
        
        for (var name in fields) {
            res.push(fields[name]);
        }
        
        return res;
    },
    
    /**
     * フィールドを追加する
     * 
     * @param {String} name フィールド名
     * @param {String} label ラベル
     * @param {Array|String} [validationRules] バリデートルール
     * @param {Array|String} [filtrationRules] フィルタールール
     * @return {Jeeel.Parameter} 自インスタンス
     */
    addField: function (name, label, validationRules, filtrationRules) {
        
        if ( ! (name && label)) {
            throw new Error('name and label is required.');
        }
        
        var vRules = [];
        var fRules = [];
        var i, l, pos, key, rule, args,
            validateRule, filterRule;
        
        // バリデートルールの解析
        if (validationRules && Jeeel.Type.isHash(validationRules)) {
            
            for (key in validationRules) {
                
                validateRule = validationRules[key];
                
                if ( ! Jeeel.Type.isDigit(key)) {
                    rule = key;
                    args = Jeeel.Type.isArray(validateRule) && validateRule || [validateRule];
                } else if (Jeeel.Type.isArray(validateRule)) {
                    rule = validateRule[0];
                    args = Jeeel.Type.isArray(validateRule[1]) && validateRule[1] || [validateRule[1]];
                } else {
                    rule = Jeeel.String.trim(validateRule);
                    args = [];
                }
                
                vRules.push([rule, args]);
            }
        } else if (validationRules) {
            validationRules = validationRules.split('|');
            
            for (i = 0, l = validationRules.length; i < l; i++) {
                
                validateRule = Jeeel.String.trim(validationRules[i]);
                
                pos = validateRule.indexOf('[');
                
                if (pos >= 0) {
                    rule = validateRule.substr(0, pos);
                    args = validateRule.substr(pos + 1, validateRule.lastIndexOf(']') - pos - 1).split(',');
                } else {
                    rule = validateRule;
                    args = [];
                }
                
                vRules.push([rule, args]);
            }
        }
        
        // フィルタルールの解析
        if (filtrationRules && Jeeel.Type.isHash(filtrationRules)) {
            
            for (key in filtrationRules) {
                
                filterRule = filtrationRules[key];

                if ( ! Jeeel.Type.isDigit(key)) {
                    rule = key;
                    args = Jeeel.Type.isArray(filterRule) && filterRule || [filterRule];
                } else if (Jeeel.Type.isArray(filterRule)) {
                    rule = filterRule[0];
                    args = Jeeel.Type.isArray(filterRule[1]) && filterRule[1] || [filterRule[1]];
                } else {
                    rule = Jeeel.String.trim(filterRule);
                    args = [];
                }
                
                fRules.push([rule, args]);
            }
        } else if (filtrationRules) {
            filtrationRules = filtrationRules.split('|');
            
            for (i = 0, l = filtrationRules.length; i < l; i++) {
                filterRule = Jeeel.String.trim(filtrationRules[i]);

                pos = filterRule.indexOf('[');
                
                if (pos >= 0) {
                    rule = filterRule.substr(0, pos);
                    args = filterRule.substr(pos + 1, filterRule.lastIndexOf(']') - pos - 1).split(',');
                } else {
                    rule = filterRule;
                    args = [];
                }
                
                fRules.push([rule, args]);
            }
        }
        
        var field = new this.constructor.Field(this, name, label, vRules, fRules);
        
        this._validated = false;
        this._fieldList.addField(field);
        
        return this;
    },
    
    /**
     * フィールドを削除する
     * 
     * @param {String} name フィールド名
     * @return {Jeeel.Parameter} 自インスタンス
     */
    removeField: function (name) {
        this._fieldList.removeField(name);
        
        return this;
    },
    
    /**
     * 指定した名前のフィールドを保持しているかどうかを返す
     * 
     * @param {String} name フィールド名
     * @return {Boolean} フィールドを保持しているかどうか
     */
    hasField: function (name) {
        return this._fieldList.hasField(name);
    },
    
    /**
     * 設定した全てのフィルタ・検証を行う
     * 
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    validate: function () {
        this.constructor._setActiveParameter(this);
        
        var values = this._params;
        var fields = this._fieldList.toHash();
        
        this._validated = true;
        this._errors = {};
        
        for (var key in fields) {
            
            var field = fields[key];

            this.constructor._setActiveField(field);
            
            var value = Jeeel.Type.isSet(values[key]) ? values[key] : null;
            var fRules = field.getFilterRules();
            var vRules = field.getValidateRules();
            
            value = this._filter(field, value, fRules);
            
            if (value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
                field.setValue(value);
                
                continue;
            }
            
            var isValid = this._validate(field, value, vRules);
            
            if (isValid) {
                field.setValue(value);
            } else {
                field.setValue(null);
            }
        }
        
        this.constructor._setActiveParameter();
        this.constructor._setActiveField();
        
        return this;
    },
    
    /**
     * バリーデータを全て通過したかどうかを返す
     *
     * @return {Boolean} 通過ならばtrueそれ以外はfalseを返す
     */
    isValid: function () {
        return this._validated && Jeeel.Type.isEmptyHash(this._errors);
    },
    
    /**
     * フィルタ・検証後の値を全て取得する
     * 
     * @return {Hash} 取得値
     */
    getValidatedValues: function () {
        var res = {};
        var fields = this._fieldList.toHash();
        
        for (var key in fields) {
            var field = fields[key];
            
            var value = field.getValue();
            
            if (value !== Jeeel.Parameter.Filter.IGNORED_VALUE) {
                res[key] = value;
            }
        }
        
        return res;
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
     * エラーを全て返す
     *
     * @return {Hash} エラーのリスト
     */
    getErrors: function () {
        return this._errors;
    },
    
    /**
     * 指定したフィールドのエラーを取得する
     * 
     * @param {String} name フィールド名
     * @return {Jeeel.Parameter.Validator.Error|Mixed} エラー
     */
    getError: function(name) {
        return Jeeel.Type.isSet(this._errors[name]) ? this._errors[name] : null;
    },
    
    /**
     * 全てのエラーを文字列として取得する
     * 
     * @return {String[]|Array} エラーリスト
     */
    getErrorMessages: function () {
        var err, res = {};
        
        for (var name in this._errors) {
            err = this._errors[name];
            
            if (err instanceof this.constructor.Validator.Error) {
                res[name] = err.getMessage();
            } else {
                res[name] = err;
            }
        }
        
        return res;
    },
    
    /**
     * 指定したフィールドのエラーを文字列として取得する
     * 
     * @return {String|Mixed} エラー
     */
    getErrorMessage: function (name) {
        var err = this._errors[name] || '';

        if (err instanceof this.constructor.Validator.Error) {
            err = err.getMessage();
        }
        
        return err;
    },

    /**
     * エラーをセットする
     *
     * @param {String} key エラーのキー
     * @param {Jeeel.Parameter.Validator.Error|Mixed} val エラーの内容
     * @return {Jeeel.Parameter} 自インスタンス
     */
    setError: function (key, val) {
        this._errors[key] = val;

        return this;
    },
    
    /**
     * エラーを削除する
     * 
     * @param {String} key エラーのキー
     * @return {Jeeel.Parameter} 自インスタンス
     */
    removeError: function (key) {
        delete this._errors[key];
        
        return this;
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
     * インスタンスの複製を行う
     * 
     * @return {Jeeel.Parameter} 複製したインスタンス
     */
    clone: function () {
        var prms;
        
        if (Jeeel.Type.isArray(this._params)) {
            prms = this._params.concat();
        } else {
            prms = {};
            
            for (var key in this._params) {
                prms[key] = this._params[key];
            }
        }
        
        var instance = new this.constructor(prms);
        
        return instance;
    },
    
    _filter: function (field, value, rules) {
        
        for (var key in rules) {
            var rule = rules[key];
            var callback = this.getFiltration(rule[0]);
            
            if (callback) {
                var args = rule[1];
                args.unshift(value);
                value = callback.apply(args);
                
                if (value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
                    return value;
                }
            }
        }
        
        return value;
    },
    
    _validate: function(field, value, rules) {
        
        var isValid = true;
        
        for (var key in rules) {
            var rule = rules[key];
            var callback = this.getValidation(rule[0]);
            
            if (callback) {
                var args = rule[1].concat();
                args.unshift(value);
                
                var isFieldValid = callback.apply(args);
                
                if (isFieldValid !== true) {
                    
                    var fieldName = field.getName();
                    
                    if ( ! this._errors[fieldName]) {
                        this._errors[fieldName] = new this.constructor.Validator.Error(field, value, callback.getMethodName(), rule[1]);
                        
                        if (isFieldValid !== false) {
                            this._errors[fieldName].setMessage(isFieldValid);
                        }
                    }
                    
                    isValid = false;
                }
            }
        }
        
        return isValid;
    },

    /**
     * コンストラクタ
     * 
     * @param {Hash} [params] 入力パラメータ
     * @constructor
     */
    constructor: Jeeel.Parameter
};

Jeeel.file.Jeeel.Parameter = ['Field', 'FieldList', 'Filter', 'Validator'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Parameter, Jeeel.file.Jeeel.Parameter);
