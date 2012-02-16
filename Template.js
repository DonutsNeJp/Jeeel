/**
 * @class テンプレートを解析して文字列の置き換えを行うクラス
 * @param {RegExp} [pattern] 検索パターン
 */
Jeeel.Template = function (pattern) {
    /**
     * 実行する際に必要な変数名と値のペアリスト
     * 
     * @type Hash
     * @private
     */
    this._params = {};

    if (Jeeel.Type.isRegularExpression(pattern)) {
        this.pattern = pattern;
    }
};

/**
 * インスタンスの作成を行う
 *
 * @param {RegExp} [pattern] 検索パターン
 * @return {Jeeel.Template} 作成したインスタンス
 */
Jeeel.Template.create = function (pattern) {
    return new this(pattern);
};

Jeeel.Template.prototype = {

    /**
     * 検索するパターン<br />
     * デフォルトで#[NAME]
     *
     * @type RegExp
     * @readOnly
     */
    pattern: /(^|.|\r|\n)(#\[(.*?)\])/,
    
    /**
     * 実行する際に使用する変数をセットする
     *
     * @param {String} key 変数名
     * @param {Mixed} value 変数の値
     * @return {Jeeel.Template} 自インスタンス
     */
    assign: function (key, value) {
        this._params[key] = Jeeel.Method.clone(value);

        return this;
    },

    /**
     * 指定した連想配列のキーを変数名として全てassignする
     *
     * @param {Hash} values 変数名と変数値のペアリスト
     * @return {Jeeel.Template} 自インスタンス
     */
    assignAll: function (values) {
        if ( ! Jeeel.Type.isHash(values)) {
            throw new Error('valuesは必ず配列式でなければなりません。');
        }

        for (var key in values) {
            this.assign(key, values[key]);
        }

        return this;
    },

    /**
     * セットされた変数の値を破棄する
     *
     * @param {String} key 変数名
     * @return {Jeeel.Template} 自インスタンス
     */
    clearAssign: function (key) {
        delete this._params[key];

        return this;
    },

    /**
     * セットされた変数の値をすべて破棄する
     *
     * @return {Jeeel.Template} 自インスタンス
     */
    clearAssignAll: function () {
        this._params = {};

        return this;
    },

    /**
     * 指定した文字列をテンプレートして扱い文字列置換を行う
     *
     * @param {String} template テンプレート文字列
     * @return {String} 解析後の文字列
     */
    fetchTemplate: function (template) {

        var pattern = this.pattern;
        var match = pattern.exec(template);

        while(match) {
            template = template.replace(match[2], this._params[match[3]]);
            match = pattern.exec(template);
        }

        return template;
    },

    /**
     * 指定したファイル内容を解析し、文字列置換して返す
     *
     * @param {String} url ファイルを示すURL
     * @return {String} 解析後の文字列
     * @throws {Error} ファイルが見当たらないかサーバーエラー時に発生する
     */
    fetchFile: function (url) {
        var res = Jeeel.Net.Ajax.serverResponse(url);

        if ( ! Jeeel.Type.isString(res)) {
            throw new Error('ファイルが見当たらないかサーバーエラーを返しました。');
        }

        return this.fetchTemplate(res);
    }
};
