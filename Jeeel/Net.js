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
 * @namespace ネット関連のネームスペース
 * @see Jeeel.Net.Ajax
 * @see Jeeel.Net.Form
 * @example
 * Netのネームスペース以下はサーバーとの通信を軸にしたメイン機能の一つ
 * その中でも以下のクラスの使用頻度は高い
 * Jeeel.Net.Ajax
 * Jeeel.Net.Form
 * 
 * Jeeel.Net.Ajax
 * Ajaxを制御するクラス
 * このクラスを使用するとHTTPパラメータの処理等を簡単に書けるようになる
 * 
 * 例：
 * var Test = {
 *     onSuccess: function (response) {
 *         console.log(response.responseText);
 *         console.log(response.getResponseJSON());
 *     }
 * };
 * var ajax = new Jeeel.Net.Ajax('/test/index', 'GET'); // Jeeel.Net.Ajax.create('/test/index', 'GET')や$AJAX('/test/index', 'GET')でも同じ意味である
 * ajax.setSuccessMethod(Test.onSuccess, Test); // 通信成功時のコールバックを設定する、2つめの引数は例によってコールバック中のthisである
 * ajax.set('a', 88); // 単純なHTTPパラメータを設定する
 * ajax.set('b'. [1, 2, 3, 4, 5, 6, [7, 8, 9, 10], {a: 'area'}]); // 多重配列や連想配列などの複雑なHTTPパラメータを設定する
 * ajax.setField('test', 77); // 通信には関係の無いレスポンスに引き渡すパラメータを設定する
 * ajax.execute(); // 実際にAjax通信を行う
 * 
 * 通信成功時などのコールバックの引数には基本的にJeeel.Net.Ajax.Responseインスタンスが渡される
 * 主なプロパティ・機能は以下になる
 * 
 * response.responseText // 通信結果のテキスト
 * response.getResponseJSON(); // responseTextをJSONとして処理し処理が出来なかったら代わりに空連想配列を返す
 * response.getResponseXML(); // responseXMLを処理して簡単アクセスが出来るJeeel.Dom.Xmlクラスのインスタンスに変換する
 * response.getField('test'); // ajax.setFieldで設定したキー test の値を取得する
 * 
 * 
 * Jeeel.Net.Form
 * 使い方によってはAjaxよりも多く使用する可能性のあるクラス
 * このクラスはform要素をラッパーし操作管理するクラスである
 * また、formだけでなくinput等のパラメータを扱う要素を含む要素をformとして扱いパラメータの変更も可能である
 * 
 * 例：
 * <form id="form">
 *   <input type="text" name="t" value="test" />
 *   <input type="radio" name="r" value="1" />
 *   <input type="radio" name="r" value="2" />
 *   <input type="radio" name="r" value="3" checked />
 *   <select name="s">
 *     <option value="1" selected>1</option>
 *     <option value="2">2</option>
 *     <option value="3">3</option>
 *   </select>
 *   <input type="text" name="t" value="test-new" />
 *   <input type="button" value="フォーム値表示" onclick="alert(Jeeel.Debug.objectExport($FORM(this.form).getAll()));" />
 * </form>
 * <div id="p-form">
 *   <input type="hidden" name="h[]" value="1" />
 *   <input type="hidden" name="h[]" value="2" />
 *   <input type="hidden" name="h[]" value="3" />
 *   <input type="hidden" name="h[a]" value="4" />
 *   <input type="hidden" name="g[a][state]" value="10" />
 *   <input type="hidden" name="g[b][state]" value="20" />
 *   <input type="hidden" name="g[b][txt]" value="test" />
 *   <input type="button" value="擬似フォーム値表示" onclick="alert(Jeeel.Debug.objectExport(Jeeel.Net.Form.createByPseudoForm(this.parentNode).getAll()));" />
 * </div>
 * var form1 = new Jeeel.Net.Form('form'); // Jeeel.Net.Form.create($ID('form'))や$FORM('form')でも同じである
 * var form2 = Jeeel.Net.Form.createByPseudoForm('p-form', '/test/index/', 'GET'); // 擬似フォームから作成する場合は可ならずこちら
 * form1.getAll(); // 指定されたフォーム、疑似フォームを解析しPHPと同じような連想配列を返す
 *                 // #formを検索するので以下の連想配列が返ってくる
 *                 // {t: 'test-new', r: '3', s: '1'}
 *                 
 * form2.getAll(); // #p-form検索するので以下の連想配列になる
 *                 // {h: {0: '1', 1: '2', 2: '3', a: '4'}, g: {a: {state: '10'}, b: {state: '20', txt: 'test'}}}
 * 
 * form1.set('r', 2); // radioボタンの2番目にチェックが付く
 * form2.set('r', 5); // 新たに名前がr、値が5のhiddenタグが生成され#p-form無いの一番下に追加される
 * form1.unset('s'); // セレクトボックスの名前が消される
 * form2.unset('g[b]'); // g[b]以下の要素の名前が破棄される
 * form2.unsetElement('h[a]'); // 要素をDOM上から取り去る
 * 
 * 以上のメソッドを順に実行すると上記のHTMLは以下のような形式に変化する
 * <form id="form">
 *   <input type="text" name="t" value="test" />
 *   <input type="radio" name="r" value="1" />
 *   <input type="radio" name="r" value="2" checked />
 *   <input type="radio" name="r" value="3" />
 *   <select name="">
 *     <option value="1" selected>1</option>
 *     <option value="2">2</option>
 *     <option value="3">3</option>
 *   </select>
 *   <input type="text" name="t" value="test-new" />
 *   <input type="button" value="フォーム値表示" onclick="alert(Jeeel.Debug.objectExport($FORM(this.form).getAll()));" />
 * </form>
 * <div id="p-form">
 *   <input type="hidden" name="h[]" value="1" />
 *   <input type="hidden" name="h[]" value="2" />
 *   <input type="hidden" name="h[]" value="3" />
 *   <input type="hidden" name="g[a][state]" value="10" />
 *   <input type="hidden" name="" value="20" />
 *   <input type="hidden" name="" value="test" />
 *   <input type="hidden" name="r" value="5" />
 *   <input type="button" value="擬似フォーム値表示" onclick="alert(Jeeel.Debug.objectExport(Jeeel.Net.Form.createByPseudoForm(this.parentNode).getAll()));" />
 * </div>
 * 
 * form1.submit(); // #formを送信する
 * form2.submit(); // #p-formの値を元にformを生成し送信する
 * form2.toAjax(); // インスタンスの値を元にJeeel.Net.Ajaxインスタンスを生成する
 */
Jeeel.Net = {
    
    /**
     * コンストラクタ
     *
     * @abstractClass ネット関係のクラスを作る際の抽象クラス
     * @implements Jeeel.Parameter.Filter.Interface, Jeeel.Parameter.Validator.Interface
     */
    Abstract: function () {
        this._params = new Jeeel.Parameter();
        this._params.addValidator(this);
        this._params.addFilter(this);
    }
};

Jeeel.Net.Abstract.prototype = {
    
    /**
     * 通信データ
     * 
     * @type Jeeel.Parameter
     * @protected
     */
    _params: null,
    
    /**
     * 通信パラメータの取得
     *
     * @param {String} key キー
     * @param {Mixied} [defaultValue] デフォルト値
     * @return {Mixied} 値
     */
    get: function (key, defaultValue) {
        return this._params.get(key, defaultValue);
    },
    
    /**
     * 通信パラメータの全取得
     *
     * @return {Hash} 値リスト
     */
    getAll: function () {
        return this._params.getAll();
    },

    /**
     * 通信パラメータの設定
     *
     * @param {String} key キー
     * @param {Mixied} val 値
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    set: function (key, val) {
        this._params.set(key, val);

        return this;
    },

    /**
     * 通信パラメータを全て設定する
     *
     * @param {Hash} vals 値リスト
     * @return {Jeeel.Net.Abstract} 自インスタンス
     * @throws {Error} valsが配列式でない場合に起こる
     */
    setAll: function (vals) {

        if ( ! Jeeel.Type.isHash(vals)) {
            throw new Error('vals is not array or associative array.');
        }

        this._params.setAll(vals);

        return this;
    },

    /**
     * 指定したキーの通信パラメータを破棄する
     *
     * @param {String} key キー
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    unset: function (key) {
        this._params.unset(key);

        return this;
    },

    /**
     * 指定キーの通信パラメータを保持しているかどうかを返す
     *
     * @param {String} key キー
     * @return {Boolean} 値を保持していたらtrueそれ以外はfalseを返す
     */
    has: function (key) {
        return this._params.has(key);
    },
    
    /**
     * 通信データのルールを追加する
     * 
     * @param {String} name フィールド名
     * @param {String} label ラベル
     * @param {Array|String} validationRules バリデートルール
     * @param {Array|String} filtrationRules フィルタールール
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    addRule: function (name, label, validationRules, filtrationRules) {
        this._params.addField(name, label, validationRules, filtrationRules);
        
        return this;
    },
    
    /**
     * フィールドを削除する
     * 
     * @param {String} name フィールド名
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    removeRule: function (name) {
        this._params.removeField(name);
        
        return this;
    },
    
    /**
     * 設定した全てのフィルタ・検証を行う
     * 
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    validate: function () {
        this._params.validate();
        
        return this;
    },
    
    /**
     * バリーデータを全て通過したかどうかを返す
     *
     * @return {Boolean} 通過ならばtrueそれ以外はfalseを返す
     */
    isValid: function () {
        return this._params.isValid();
    },
    
    /**
     * フィルタ・検証後の値を全て取得する
     * 
     * @return {Hash} 取得値
     */
    getValidatedValues: function () {
        return this._params.getValidatedValues();
    },
    
    /**
     * エラーを全て返す
     *
     * @return {Hash} エラーのリスト
     */
    getErrors: function () {
        return this._params.getErrors();
    },
    
    /**
     * 指定したフィールドのエラーを取得する
     * 
     * @param {String} name フィールド名
     * @return {Jeeel.Parameter.Validator.Error|Mixed} エラー
     */
    getError: function(name) {
        return this._params.getError(name);
    },
    
    /**
     * 全てのエラーを文字列として取得する
     * 
     * @return {String[]|Array} エラーリスト
     */
    getErrorMessages: function () {
        return this._params.getErrorMessages();
    },
    
    /**
     * 指定したフィールドのエラーを文字列として取得する
     * 
     * @return {String|Mixed} エラー
     */
    getErrorMessage: function (name) {
        return this._params.getErrorMessage(name);
    },
    
    /**
     * バリデートメソッドを追加する
     * 
     * @param {String} name バリデート名
     * @param {Function} validation バリデートメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    addValidation: function (name, validation, thisArg) {
        if ( ! Jeeel.Type.isFunction(validation)) {
            throw new Error('validation must be a function.');
        }
        
        name = Jeeel.String.toPascalCase(name);
        
        this['_validate' + name] = thisArg ? Jeeel.Function.simpleBind(validation, thisArg) : validation;
        
        return this;
    },

    /**
     * バリデートメソッドが呼べるかどうかを返す
     * 
     * @param {String} name バリデート名
     * @return {Boolean} バリデートメソッドが呼べるかどうか
     */
    hasValidation: function (name) {
        name = '_validate' + Jeeel.String.toPascalCase(name);
        
        return !!(this[name] && typeof this[name] === 'function');
    },
    
    /**
     * バリデートメソッドを取得する
     * 
     * @param {String} name バリデート名
     * @return {Jeeel.Function.Callback} コールバック
     */
    getValidation: function (name) {
        name = '_validate' + Jeeel.String.toPascalCase(name);
        
        return this[name] && typeof this[name] === 'function' && new Jeeel.Function.Callback(name, this) || null;
    },
    
    /**
     * フィルタメソッドを追加する
     * 
     * @param {String} name フィルタ名
     * @param {Function} filtration フィルタメソッド
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Net.Abstract} 自インスタンス
     */
    addFiltration: function (name, filtration, thisArg) {
        if ( ! Jeeel.Type.isFunction(filtration)) {
            throw new Error('filtration must be a function.');
        }
        
        name = Jeeel.String.toPascalCase(name);
        
        this['_filter' + name] = thisArg ? Jeeel.Function.simpleBind(filtration, thisArg) : filtration;
        
        return this;
    },
    
    /**
     * フィルタメソッドが呼べるかどうかを返す
     * 
     * @param {String} name フィルタ名
     * @return {Boolean} フィルタメソッドが呼べるかどうか
     */
    hasFiltration: function (name) {
        name = '_filter' + Jeeel.String.toPascalCase(name);
        
        return !!(this[name] && typeof this[name] === 'function');
    },
    
    /**
     * フィルタメソッドが取得する
     * 
     * @param {String} name フィルタ名
     * @return {Jeeel.Function.Callback} コールバック
     */
    getFiltration: function (name) {
        name = '_filter' + Jeeel.String.toPascalCase(name);
        
        return this[name] && typeof this[name] === 'function' && new Jeeel.Function.Callback(name, this) || null;
    }
};

Jeeel.Net.Abstract = Jeeel.Class.implement(Jeeel.Net.Abstract, Jeeel.Parameter.Filter.Interface);
Jeeel.Net.Abstract = Jeeel.Class.implement(Jeeel.Net.Abstract, Jeeel.Parameter.Validator.Interface);

Jeeel.file.Jeeel.Net = ['Form', 'Ajax', 'Jsonp', 'Beacon'];

if (Jeeel._extendMode.Net && Jeeel._global) {
    if (Jeeel._global.EventSource) {
        Jeeel.file.Jeeel.Net[Jeeel.file.Jeeel.Net.length] = 'Comet';
    }
    
    if (Jeeel._global.WebSocket) {
        Jeeel.file.Jeeel.Net[Jeeel.file.Jeeel.Net.length] = 'Socket';
    }
}

Jeeel._autoImports(Jeeel.directory.Jeeel.Net, Jeeel.file.Jeeel.Net);
