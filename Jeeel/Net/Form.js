
/**
 * コンストラクタ
 *
 * @class フォームの操作及び送信を管理するクラス
 * @augments Jeeel.Net.Abstract
 * @param {String|Element} form フォームを示すIDもしくはフォーム自身
 * @throws {Error} 指定したformがフォームのIDもしくはフォーム自身でなかった場合に発生
 */
Jeeel.Net.Form = function (form) {
    
    Jeeel.Net.Abstract.call(this);
    
    if (Jeeel.Type.isString(form)) {
        form = Jeeel.Document.getElementById(form);
    }

    if ( ! form || ! form.tagName || form.tagName.toUpperCase() !== 'FORM') {
        throw new Error('指定されたIDまたはElementはform固有のものではありません。');
    }
    
    this._form = form;
    
    if (Jeeel.Type.isElement(arguments[1])) {
        this._pseudoForm = arguments[1];
    }
};

/**
 * インスタンスを作成する
 *
 * @param {String|Element} form フォームを示すIDもしくはフォーム自身
 * @return {Jeeel.Net.Form} 作成したインスタンス
 */
Jeeel.Net.Form.create = function (form) {
    return new this(form);
};

/**
 * 疑似フォームを設定し、新規フォームを介して値の設定や削除、送信を行う<br />
 * この機能を使うと指定した要素の中に含まれるinput等の値を設定・削除・送信を行う事が出来る
 * 
 * @param {String|Element} pseudoForm 疑似フォームを示すIDもしくは疑似フォーム自身(例えばdivタグやtrタグ等)
 * @param {String} [action] formのaction
 * @param {String} [method] formのmethod
 * @return {Jeeel.Net.Form} 作成したインスタンス
 * @throws {Error} 指定したpseudoFormがIDもしくはElementではなかった場合に発生
 */
Jeeel.Net.Form.createByPseudoForm = function (pseudoForm, action, method) {
    var newForm = Jeeel.Document.createElement('form');

    newForm.style.display = 'none';

    if (Jeeel.Type.isString(pseudoForm)) {
        pseudoForm = Jeeel.Document.getElementById(pseudoForm);
    }
    
    if ( ! Jeeel.Type.isElement(pseudoForm)) {
        throw new Error('指定されたpseudoFormがIDもしくはElementではありません。');
    }
    
    var res = new this(newForm, pseudoForm);
    
    if (action) {
        res.setAction(action);
    }
    
    if (method) {
        res.setMethod(method);
    }
    
    return res.setRemoveFormAtSubmit(true);
};

/**
 * formを新規作成して、インスタンスの作成を行う<br />
 * このメソッドを呼んだ場合formがbodyに追加され、<br />
 * submitメソッドが呼ばれた時にこのFormは削除される
 *
 * @param {String} [action] formのaction
 * @param {String} [method] formのmethod
 * @return {Jeeel.Net.Form} 作成したインスタンス
 */
Jeeel.Net.Form.newForm = function (action, method) {
    var newForm = Jeeel.Document.createElement('form');

    newForm.style.display = 'none';

    var res = new this(newForm);
    
    if (action) {
        res.setAction(action);
    }
    
    if (method) {
        res.setMethod(method);
    }
    
    return res.setRemoveFormAtSubmit(true);
};

/**
 * 指定したformを基に新規formを作成し、インスタンスの作成を行う<br />
 * 新規にformを作成した場合bodyに追加され、<br />
 * このインスタンスのsubmitメソッドが呼ばれた時に新規formは削除される
 *
 * @param {String|Element} form 基となるフォームを示すIDもしくはフォーム自身
 * @param {String|Element} [newForm] コピー先となるForm(指定しない場合は新規作成を行う)
 * @return {Jeeel.Net.Form} 作成したインスタンス
 * @throws {Error} newFormを指定したにも関わらずフォームのIDもしくはフォーム自身でなかった場合に発生
 */
Jeeel.Net.Form.copyBy = function (form, newForm) {

    var submitRemove = false;
    
    if (Jeeel.Type.isString(newForm)) {
        newForm = Jeeel.Document.getElementById(newForm);
    } else if ( ! Jeeel.Type.isElement(newForm)) {
        newForm = Jeeel.Document.createElement('form');
        newForm.style.display = 'none';
        submitRemove = true;
    }

    if ( ! newForm || ! newForm.nodeName || newForm.nodeName.toLowerCase() !== 'form') {
        throw new Error('引数newFormはform固有を示すものではありません。');
    }

    var base = new this(form);
    var res  = new this(newForm);

    res.setMethod(base.getMethod());
    res.setAction(base.getAction());
    res.setTarget(base.getTarget());
    res.setAll(base.getAll());

    return res.setRemoveFormAtSubmit(submitRemove);
};

/**
 * 名前がない要素の名前
 * 
 * @type String
 * @constant
 * @memberOf Jeeel.Net.Form
 */
Jeeel.Net.Form.UNKNOWN_NAME = '_UNKNOWN_';

/**
 * 上書き要素の名前
 * 
 * @type String
 * @constant
 * @memberOf Jeeel.Net.Form
 */
Jeeel.Net.Form.OVERWRITTEN_NAME = '_OVERWRITE_';

Jeeel.Net.Form.prototype = {

    /**
     * フォーム
     * 
     * @type Element
     * @private
     */
    _form: null,
    
    /**
     * 疑似フォーム
     * 
     * @type Element
     * @private
     */
    _pseudoForm: null,
    
    /**
     * フォームをsubmitメソッドを呼び出した後削除するかどうか
     * 
     * @type Boolean
     * @private
     */
    _submitRemove: false,
    
    _getName: Jeeel._Object.JeeelFilter.getInputName,
    
    /**
     * formに値をセットするためメソッド
     * 
     * @param {String} key キー
     * @param {Mixied} val 値
     * @param {Mixied} input 値を保持させるInputElement
     * @param {Boolean} [toForm] フォームに対して優先的に埋め込むかどうか
     * @private
     */
    _set: function (key, val, input, toForm) {},
    
    /**
     * formに強制的に値をセットするためメソッド
     * 
     * @param {Hash} vals 値
     * @private
     */
    _setAllForm: function (vals) {},

    /**
     * formのactionをセットする
     *
     * @param {String} action formのaction
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    setAction: function (action) {
        this._form.action = action;

        return this;
    },

    /**
     * formのactionを取得する
     *
     * @return {String} formのaction
     */
    getAction: function () {
        return this._form.action;
    },

    /**
     * formのmethodをセットする
     *
     * @param {String} method formのmethod
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    setMethod: function (method) {
        this._form.method = method;

        return this;
    },

    /**
     * formのmethodを取得する
     *
     * @return {String} formのmethod
     */
    getMethod: function () {
        return this._form.method;
    },

    /**
     * formのtargetをセットする
     *
     * @param {String} target formのtarget
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    setTarget: function (target) {
        this._form.target = target;

        return this;
    },

    /**
     * formのtargetを取得する
     *
     * @return {String} formのtarget
     */
    getTarget: function () {
        return this._form.target;
    },

    /**
     * 保持しているフォームを取得する
     *
     * @return {Element} フォーム
     */
    getForm: function () {
        return this._form;
    },
    
    /**
     * 疑似フォームを取得する
     *
     * @return {Element} 疑似フォーム
     */
    getPseudoForm: function () {
        return this._pseudoForm;
    },

    /**
     * 保持しているフォームをDom上から取り除く
     *
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    removeForm: function () {
        Jeeel.Dom.Element.create(this._form).remove();

        return this;
    },
    
    /**
     * 保持しているフォームをsubmit時にDom上から取り除くかどうかを取得する
     *
     * @return {Boolean} submit時に削除するかどうか
     */
    getRemoveFormAtSubmit: function () {
        return this._submitRemove;
    },
    
    /**
     * 保持しているフォームをsubmit時にDom上から取り除くかどうかを設定する
     *
     * @param {Boolean} enableRemove submit時に削除するかどうか
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    setRemoveFormAtSubmit: function (enableRemove) {
        this._submitRemove = !!enableRemove;
        
        return this;
    },

    /**
     * 指定したキーの値のリストを取得する
     *
     * @param {String} key キー(name)
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    get: function (key, defaultValue) {
        var param = this.getAll();
        var names = this._getName('' + key);
        
        // 配列るキーの場合(a[b]やa[]の場合)
        if (names.length !== 1) {
            for (var i = 0, l = names.length - 1; i < l; i++) {
                param = param[names[i]];
            }
            
            key = names[l];
        }
        
        param = param[key];

        return (Jeeel.Type.isSet(param) ? param : defaultValue);
    },

    /**
     * form内の値を全て取得する<br />
     * その際checkedが付いていないradioボタンやcheckboxは無視される
     *
     * @return {Hash} 値のリスト
     */
    getAll: function () {},
    
    /**
     * 指定したキーのデフォルト値のリストを取得する
     *
     * @param {String} key キー(name)
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    getDefault: function (key, defaultValue) {
        var param = this.getDefaultAll();
        var names = this._getName('' + key);
        
        // 配列るキーの場合(a[b]やa[]の場合)
        if (names.length !== 1) {
            for (var i = 0, l = names.length - 1; i < l; i++) {
                param = param[names[i]];
            }
            
            key = names[l];
        }
        
        param = param[key];

        return (Jeeel.Type.isSet(param) ? param : defaultValue);
    },
    
    /**
     * form内のデフォルト値を全て取得する<br />
     * その際checkedが付いていないradioボタンやcheckboxは無視される
     *
     * @return {Hash} 値のリスト
     */
    getDefaultAll: function () {},
    
    /**
     * 値をhiddenでセットする<br />
     * 対象の要素が無い場合はhiddenで埋め込み、対象の要素がある場合は以下のような動作になる<br />
     * radio: 指定した値のradioにチェックが付く<br />
     * checkbox: 指定した値と同じだった場合にはチェックが付きそれ以外はチェックが外れる<br />
     * select: 指定した値のオプションをセレクトする<br />
     * それ以外: 値自体が上書きされる<br />
     * また、対象の要素と埋め込もうとした値が一致しなかった場合は要素を削除してhiddenが埋め込まれる<br />
     * 例: <br />
     * name="test"の要素があった場合にJeeel.Net.Form#set('test', [1, 2, 3]);<br />
     * こういう記述の場合要素に対して配列つまり test に対して test[0] などの名前で上書きしようとするので削除の対象となる<br />
     * 同じく name="test[a]" に対して Jeeel.Net.Form#set('test', 44); などの指定も同じく削除の対象となる
     *
     * @param {String} key キー(inputタグのnameと同じ書式)
     * @param {Mixied} val 値
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    set: function (key, val) {
        var names = this._getName('' + key);
        
        // 配列るキーの場合(a[b]やa[]の場合)
        if (names.length !== 1) {
            var base = {}, obj = base;
            
            for (var i = 0, l = names.length - 1; i < l; i++) {
                obj[names[i]] = {};
                obj = obj[names[i]];
            }
            
            obj[names[l]] = val;
            
            key = names[0];
            val = base[key];
        }
        
        var input = this.getElementAll(true)[key];
        
        Jeeel.Dom.ElementOperator.create(this.getOverwrittenElements())
                               .filterName(key, true)
                               .remove();

        this._set(key, val, input);

        return this;
    },

    /**
     * 指定したHashをの内容を全てhidden形式で埋め込む<br />
     * keyが被った場合は全て上書きする
     * 
     * @param {Hash} vals 値
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    setAll: function (vals) {

        Jeeel.Hash.forEach(vals,
            function (val, key) {
                this.set(key, val);
            }, this
        );

        return this;
    },

    /**
     * 指定キーの値を破棄する(この際指定キーのElementのnameが破棄される)<br />
     * その際checkedが付いていないradioボタンやcheckboxは無視される
     *
     * @param {String} key キー
     * @return {Jeeel.Net.Form} 自インスタンス
     */
    unset: function (key) {
        Jeeel.Dom.ElementOperator.create([this.getElement(key, true), this.getOverwrittenElements()])
                                 .filterName(key, true)
                                 .removeAttr('name');
        
        return this;
    },

    /**
     * 指定キーの値を保持しているかどうかを返す<br />
     * その際checkedが付いていないradioボタンやcheckboxは無視される
     *
     * @param {String} key キー
     * @return {Boolean} 値を保持していたらtrueそれ以外はfalseを返す
     */
    has: function (key) {
        return Jeeel.Type.isSet(this.get(key));
    },

    /**
     * 指定したキーのinput要素を取得する(指定した名前が複数ある場合はリストになる)
     *
     * @param {String} key キー(name)
     * @return {Element|Hash} inputの要素
     */
    getElement: function (key) {
        var param = this.getElementAll(arguments[1]);
        var names = this._getName('' + key);
        
        // 配列るキーの場合(a[b]やa[]の場合)
        if (names.length !== 1) {
            for (var i = 0, l = names.length - 1; i < l; i++) {
                param = param[names[i]];
            }
            
            key = names[l];
        }
        
        param = param[key];
        
        return param || null;
    },

    /**
     * form内の全てのinput要素を取得する
     * 
     * @return {Hash} input要素のリスト
     */
    getElementAll: function () {},

    /**
     * 検索対象にならなかった無名のinput要素を全て取得する
     *
     * @return {Element[]} input要素の配列
     */
    getUnknownElements: function () {},
    
    /**
     * 検索過程で上書きされてしまうinput要素を全て取得する
     * 
     * @return {Element[]} input要素の配列
     * @example
     * <form>
     *   <input type="" name="hoge" value="1" />
     *   <input type="" name="hoge" value="2" />
     *   <input type="" name="hoge[]" value="3" />
     *   <input type="" name="hoge[]" value="4" />
     * </form>
     * 上記のformの場合最初から2つのhogeの要素が取得される
     */
    getOverwrittenElements: function () {},
    
    /**
     * selectタグのoptionを全て取得する
     * 
     * @param {String} key selectタグのname
     * @return {Element[]} オプションリスト
     */
    getOptions: function (key) {
        var select = this.getElement(key),
            nodeName = select && select.nodeName;
        
        if ( ! nodeName || nodeName.toUpperCase() !== 'SELECT') {
            return [];
        }
        
        return Jeeel.Hash.toArray(select.options);
    },
    
    /**
     * selectタグのoptionの値を全て取得する
     * 
     * @param {String} key selectタグのname
     * @return {String[]} オプションの値のリスト
     */
    getOptionValues: function (key) {
        var options = this.getOptions(key);
        
        for (var i = options.length; i--;) {
            options[i] = options[i].value;
        }
        
        return options;
    },
    
    /**
     * 指定キーのinput要素を破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Net.Form} 自インスタンス
     */
    unsetElement: function (key) {
        Jeeel.Dom.ElementOperator.create([this.getElement(key, true), this.getOverwrittenElements()])
                               .filterName(key, true)
                               .remove();
        
        return this;
    },
    
    /**
     * selectタグのoptionを指定した値に全て置き換える
     * 
     * @param {String} key selectタグのname
     * @param {Hash} options オプションの値に使う値と表示値のリスト({value1: text1, value2: text2, ...})
     * @return {Jeeel.Net.Form} 自インスタンス
     */
    replaceOptions: function (key, options) {
        var select = this.getElement(key),
            nodeName = select && select.nodeName;
        
        if ( ! nodeName || nodeName.toUpperCase() !== 'SELECT') {
            return this;
        } else if ( ! Jeeel.Type.isHash(options)) {
            return this;
        }
        
        select = new Jeeel.Dom.Element(select);
        
        var addOptions = [],
            val, option;
        
        for (val in options) {
            option = Jeeel.Document.createElement('option');
            option.value = val;
            option.innerHTML = Jeeel.String.escapeHtml(options[val]);
            
            addOptions[addOptions.length] = option;
        }
        
        select.clearChildNodes()
              .appendChild(addOptions);
        
        return this;
    },
    
    /**
     * 自動的にフィルタ、バリデータを起動させるようにする
     * 
     * @ignore 未完成
     */
    enableAutoChecker: function () {
        var elms = Jeeel.Dom.ElementOperator.create(this._pseudoForm || this._form).$QUERY('input[name]');
        
        for (var i = elms.length; i--;) {
            var vRules = elms.getData('validationRules', i);
            var fRules = elms.getData('filtrationRules', i);
            
            
        }
    },
    
    /**
     * 設定した全てのフィルタ・検証を行う
     * 
     * @return {Jeeel.Net.Form} 自インスタンス
     */
    validate: function () {
        this._params.clear();
        this._params.setAll(this.getAll());
        
        this._super.validate.call(this);
        
        return this;
    },
    
    /**
     * フォームの送信を行う
     *
     * @return {Jeeel.Net.Form} 自身のインスタンス
     */
    submit: function () {
        if (Jeeel.Acl && Jeeel.Acl.isDenied(this.getAction(), '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
        if ( ! this.isValid()) {
            throw new Error('There is an error in the contents of the form.');
        }
        
        if (this._pseudoForm) {
            this._setAllForm(this.getAll());
        }
        
        // formがDOM上に居ない場合IE等のブラウザにて送信が出来ないので埋め込んでから送信を行う
        if ( ! this._form.parentNode || this._form.parentNode.nodeType === Jeeel.Dom.Node.DOCUMENT_FRAGMENT_NODE) {
            Jeeel.Document.appendToBody(this._form);
        }
        
        this._form.submit();
        
        if (this._submitRemove) {
            this.removeForm();
        }

        return this;
    },
    
    /**
     * フォームの内容をJeeel.Net.Ajaxインスタンスに変換する
     *
     * @return {Jeeel.Net.Ajax} 変換後のインスタンス
     */
    toAjax: function () {
        var params = this.getAll();
        var fields = this._params.getFields();
        
        var ajax = new Jeeel.Net.Ajax(this.getAction(), this.getMethod());
        
        ajax.setAll(params);
        
        for (var i = fields.length; i--;) {
            var field = fields[i];
            
            ajax.addRule(field.getName(), field.getLabel(), field.getValidateRules(), field.getFilterRules());
        }
        
        return ajax;
    },
    
    /**
     * 必須項目のバリデートを行う(空文字も弾く様に上書き)
     * 
     * @param {Mixed} value バリデート値
     * @return {Boolean} 空じゃなかったかどうか(null, undefined, ''以外が通過)
     * @private
     */
    _validateRequired: function (value) {
        return ! Jeeel.Type.isEmpty(value) && value !== '';
    },
    
    /**
     * 値が無かったら無視する(空文字も値なしとするように上書き)
     * 
     * @param {Mixed} value フィルタ値
     * @return int フィルタ後の値
     * @private
     */
    _filterOption: function (value) {
        return this._validateRequired(value) ? value : Jeeel.Parameter.Filter.IGNORED_VALUE;
    },
    
    /**
     * 値が指定されていなかった場合に代わりに代替値を返す(空文字も値なしとするように上書き)
     * 
     * @param {Mixed} value 対象値
     * @param {Mixed} defaultValue デフォルト値
     * @return {Mixed} 処理後の値
     * @private
     */
    _filterDefault: function (value, defaultValue) {
        return this._validateRequired(value) ? value : defaultValue;
    },
    
    _init: function () {
        var uName = Jeeel.Net.Form.UNKNOWN_NAME;
        var oName = Jeeel.Net.Form.OVERWRITTEN_NAME;
        var fnvf = new Jeeel.Filter.Html.FormValue();
        var fdvf = new Jeeel.Filter.Html.FormValue(true);
        var fnef = new Jeeel.Filter.Html.Form();
        var fuef = new Jeeel.Filter.Html.Form(false, uName);
        var foef = new Jeeel.Filter.Html.Form(false, null, oName);
        var uef  = new Jeeel.Filter.Url.Escape();
        
        /**
         * @ignore
         */
        this.getAll = function () {
            return fnvf.filter(this._pseudoForm || this._form);
        };
        
        /**
         * @ignore
         */
        this.getDefaultAll = function () {
            return fdvf.filter(this._pseudoForm || this._form);
        };
        
        /**
         * @ignore
         */
        this.getElementAll = function (secretPrm) {
            var res = fnef.enableAccurateList(secretPrm).filter(this._pseudoForm || this._form);
            
            return res;
        };
        
        /**
         * @ignore
         */
        this.getUnknownElements = function () {
            var parm = fuef.filter(this._pseudoForm || this._form)[uName];

            return Jeeel.Hash.getValues(parm || []);
        };
        
        /**
         * @ignore
         */
        this.getOverwrittenElements = function () {
            return foef.filter(this._pseudoForm || this._form)[oName];
        };
        
        /**
         * @ignore
         */
        this._setAllForm = function (vals) {
            var inputs = fnef.enableAccurateList(true).filter(this._form);

            Jeeel.Hash.forEach(vals,
                function (val, key) {
                    this._set(key, val, inputs[key], true);
                }, this
            );

            return this;
        };
        
        /**
         * @ignore
         */
        this._set = function (key, val, input, toForm) {
            
            var i;
            
            // inputが配列の場合(ラジオボタン)
            if (Jeeel.Type.isArray(input)) {
                
                // valが単体の場合指定した値と合致するラジオボタンにチェックを付ける
                if ( ! Jeeel.Type.isHash(val)) {
                    val = '' + val;
                    
                    for (i = input.length; i--;) {
                        if (input[i].value === val) {
                            input[i].checked = true;
                            break;
                        }
                    }
                }

                // valが複数の場合inputと形式が一致しないためinputを削除してから値の設定を行う
                else {
                    Jeeel.Dom.ElementOperator.create(input).remove();

                    this._set(key, val, null, toForm);
                }
            }
            // inputがElementの場合
            else if (Jeeel.Type.isElement(input)) {

                // valが単体の場合そのまま代入
                if ( ! Jeeel.Type.isHash(val)) {
                    if (input.tagName.toUpperCase() === 'INPUT' && input.type.toLowerCase() === 'checkbox') {
                        input.checked = input.value === ('' + val);
                    } else {
                        input.value = uef.filter(val);
                    }
                }

                // valが複数の場合inputと形式が一致しないためinputを削除してから値の設定を行う
                else {
                    Jeeel.Dom.ElementOperator.create(input).remove();

                    this._set(key, val, null, toForm);
                }
            }
            // inputがHashの場合
            else if (input) {

                // valが単数の場合inputと形式が一致しないためinputを削除してから値の設定を行う
                if ( ! Jeeel.Type.isHash(val)) {
                    Jeeel.Dom.ElementOperator.create(input).remove();

                    this._set(key, val, null, toForm);

                    return;
                }

                // valが複数の場合それぞれのinputにコピーを再帰的に行っていく
                Jeeel.Hash.forEach(val, 
                    function (val, inputKey) {
                        this._set(key + '[' + inputKey + ']', val, input[inputKey], toForm);
                    }, this
                );

            }
            // inputが存在しない場合
            else {

                // valを基にHiddenインスタンスを作成する
                input = Jeeel.Filter.Html.Hidden.create(key).filter(val);
                
                // Hiddenインスタンスの埋め込み先を決定する
                var owner = ! toForm && this._pseudoForm || this._form;

                // 作成したHiddenインスタンスを対象に埋め込む
                if (Jeeel.Type.isArray(input)) {
                    for (i = 0; i < input.length; i++) {
                        owner.appendChild(input[i]);
                    }
                } else {
                    owner.appendChild(input);
                }
            }
        };
        
        delete this._init;
    }
};

Jeeel.Class.extend(Jeeel.Net.Form, Jeeel.Net.Abstract);

Jeeel.Net.Form.prototype._init();
