/**
 * @staticClass Json関連のモジュール
 * @example
 * JSONのエンコードとデコードを提供するクラス
 * クロスブラウザのためにもJSONよりこのクラスを使うのが望ましい
 * 
 * 例：
 * Jeeel.Json.encode({a: [1, 2, 3], b: 'テスト'}); // '{"a": [1, 2, 3], "b": "テスト"}' が返ってくる
 * Jeeel.Json.decode('[1,2,3,4,5]'); // [1, 2, 3, 4, 5] が返ってくる
 * 
 * このクラスは通常のJSONよりも複雑な記述を使用する事が出来るが常にノンセキュアでデコードを行うことになるので信頼出来るか分からない外部とのやり取りなどでは使用しない方が良い
 * 
 * var json = Jeeel.Json.encode({date: new Date('2012/11/22'), reg: /^test-.*$/}, true); // 2つ目の引数をtrueにすることで既存のオブジェクトのコンストラクタ等を使用するようになり、
 *                                                                                       // '{"date":new Date(1353510000000),"reg":/^test-.*$/}' が返ってくる
 * Jeeel.Json.decode(json, true); // 2つ目の引数をtrueにすることで関数やnew, 正規表現等を含んだJSONを復元できる。
 *                                // ただしセキュアであること前提で動くのでjsonに悪意のあるコードが含まれていても実行する
 *                                // 左の戻り値は{date: new Date('2012/11/22'), reg: /^test-.*$/}となり復元されていることが確認できるはず
 */
Jeeel.Json = {
    
    /**
     * 指定した値をJsonにエンコードする<br/>
     * なお参照も全て展開するので、<br />
     * 参照先がDomの様な階層が深い場合やサイズオーバーが起こる<br />
     * またプライベートプロパティ・メソッドまでは修正変換されないので、<br />
     * デコード後にまったく同じように使えるとは限らない
     *
     * @param {Mixied} obj Jsonに変換するオブジェクト
     * @param {Boolean} [serializeScript] エンコード時にJavaScriptの型について厳密に変換するかどうか
     * @return {String} Jsonに変換後の文字列
     * @throws {RangeError} 無限ループに入った場合またはオブジェクトのサイズが限界を超えた場合に発生する
     * @throws {TypeError} 循環参照がある場合に発生する
     */
    encode: function (obj, serializeScript) {
        
        // 厳密変換でない場合高速化のため既存のJSONを使用する
        if ( ! serializeScript && Jeeel._global.JSON) {
            return JSON.stringify(obj);
        }
        
        var res;

        if (Jeeel.Type.isPrimitive(obj)) {
            if (Jeeel.Type.isString(obj)) {
                res = '"' + obj.replace('\\', '\\\\')
                              .replace(/(\r\n|\n)/ig, '\\n')
                              .replace(/\t/ig, '\\t')
                              .replace('"', '\\"')
                              .replace("'", "\\'") + '"';
            } else {
                res = '' + obj;
            }
        } else if (Jeeel.Type.isFunction(obj)) {

            if (serializeScript) {
                switch (obj) {
                    case Object:
                        res = 'Object';
                        break;
                        
                    case Array:
                        res = 'Array';
                        break;
                        
                    case String:
                        res = 'String';
                        break;
                        
                    case Boolean:
                        res = 'Boolean';
                        break;
                        
                    case Date:
                        res = 'Date';
                        break;
                        
                    case RegExp:
                        res = 'RegExp';
                        break;
                        
                    default:
                        if (Jeeel._debugMode && Jeeel.Debug && obj[Jeeel.Debug.Debugger.INFORMATION_NAME]) {
                            res = obj[Jeeel.Debug.Debugger.INFORMATION_NAME].name;
                        }
                        break;
                }
            }

            if ( ! res) {
                res = obj.toString().replace(/\/\/[^\r\n]*(\r\n|\n)/ig, '')
                                    .replace(/((\r\n|\n) +|\t|\r\n|\n){1,}/ig, ' ');
            }
        } else if (serializeScript) {
            if (Jeeel.Type.isDate(obj)) {
                res = 'new Date(' + obj.getTime() + ')';
            } else if (Jeeel.Type.isMath(obj)) {
                res = 'Math';
            } else if (Jeeel.Type.isJSON(obj)) {
                res = 'JSON';
            } else if (Jeeel.Type.isRegularExpression(obj)) {
                res = obj.toString();
            }
        }
        
        if ( ! res) {
            if (Jeeel.Type.isArray(obj)) {
                res  = [];

                for (var i = 0, l = obj.length; i < l; i++) {
                    res[i] = this.encode(obj[i], serializeScript);
                }

                res = '[' + res.join(',') + ']';
            } else {
                res = [];

                for (var key in obj) {
                    if (Jeeel._debugMode && Jeeel.Debug && key === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                        continue;
                    }

                    res[res.length] = '"' + key + '":' + this.encode(obj[key], serializeScript);
                }

                res = '{' + res.join(',') + '}';
            }
        }
        
        return res;
    },
    
    /**
     * 作成したJsonをデコードする<br />
     * 検証を行い、evalして返す
     *
     * @param {String} json Json形式の文字列
     * @param {Boolean} [isSecure] JSONの中身の安全性が確実な場合にtrueにすると検証なしで動作するため速くなる(また、完全なJSON形式でなくても動作するようになる)
     * @return {Mixied} 変換後の値(空文字の場合はundefinedが返る)
     * @throws {TypeError} jsonが文字列ではないときに発生
     * @throws {SyntaxError} jsonがJson形式でないときに発生
     */
    decode: function (json, isSecure) {

        // jsonの中身が空の場合nullではなくundefinedを返す("null"をデコードした時と区別するため)
        if ( ! json) {
            return void 0;
        }

        if ( ! Jeeel.Type.isString(json)) {
            throw new TypeError('jsonが文字列ではありません。');
        } else if ( ! isSecure) {
            if (Jeeel._global.JSON) {
                return JSON.parse(json);
            } else if ( ! this.isJson(json)) {
                throw new SyntaxError('jsonがJson形式になっていません。');
            }
        }

        return eval('(' + json + ')');
    },
    
    /**
     * 完全なJson形式であるかどうかを返す(メソッド等が入っていた場合は不可)
     *
     * @param {String} json 検査対象の文字列
     * @return {Boolean} Json形式であるかどうか
     */
    isJson: function (json) {

        if ( ! Jeeel.Type.isString(json)) {
            throw new TypeError('jsonが文字列ではありません。');
        }

        if (json.match(/^\s*$/)) {
            return false;
        }

        return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(json.replace(/"(\\.|[^"\\])*"/g, ' ')));
    }
};
