
/**
 * Jsonをエンコードする<br/>
 * なお参照も全て展開するので、<br />
 * 参照先がまた自身を参照しているような無限ループの場合サイズオーバーが起こる<br />
 * またプライベートプロパティ・メソッドまでは修正変換されないので、<br />
 * デコード後にまったく同じように使えるとは限らない
 *
 * @param {Mixied} obj Jsonに変換するオブジェクト
 * @param {Boolean} [serializeScript] エンコード時にJavaScriptの型について厳密に変換するかどうか
 * @return {String} Jsonに変換後の文字列
 * @throws {RangeError} 無限ループに入った場合またはオブジェクトのサイズが限界を超えた場合に発生する
 */
Jeeel.Json.encode = function (obj, serializeScript) {

    var res;

    if (Jeeel.Type.isPrimitive(obj)) {
        if (Jeeel.Type.isString(obj)) {
            res = '"' + obj.replace('\\', '\\\\')
                           .replace(/(\r\n|\n)/ig, '\\n')
                           .replace(/\t/ig, '\\t')
                           .replace('"', '\\"')
                           .replace("'", "\\'") + '"';

            return res;
        }

        return '' + obj;
    }

    if (Jeeel.Type.isFunction(obj)) {
        
        if (serializeScript) {
            if (obj === Object) {
                return 'Object';
            } else if (obj === Array) {
                return 'Array';
            } else if (obj === String) {
                return 'String';
            } else if (obj === Boolean) {
                return 'Boolean';
            } else if (obj === Date) {
                return 'Date';
            } else if (obj === RegExp) {
                return 'RegExp';
            } else if (Jeeel._debugMode && Jeeel.Debug && obj[Jeeel.Debug.Debugger.INFORMATION_NAME]) {
                return obj[Jeeel.Debug.Debugger.INFORMATION_NAME].name;
            }
        }
        
        res = obj.toString().replace(/\/\/[^\r\n]*(\r\n|\n)/ig, '')
                            .replace(/((\r\n|\n) +|\t|\r\n|\n){1,}/ig, ' ');

        return res;
    }
    
    if (serializeScript) {
        if (Jeeel.Type.isDate(obj)) {
            return 'new Date(' + obj.getTime() + ')';
        } else if (Jeeel.Type.isMath(obj)) {
            return 'Math';
        } else if (Jeeel.Type.isJSON(obj)) {
            return 'JSON';
        } else if (Jeeel.Type.isRegularExpression(obj)) {
            return obj.toString();
        }
    }

    if (Jeeel.Type.isArray(obj)) {
        res  = [];

        for (var i = 0, l = obj.length; i < l; i++) {
            res[i] = arguments.callee(obj[i], serializeScript);
        }

        return '[' + res.join(',') + ']';
    } else {
        res = [];

        for (var key in obj) {
            if (Jeeel._debugMode && Jeeel.Debug && key === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                continue;
            }

            res[res.length] = '"' + key + '":' + arguments.callee(obj[key], serializeScript);
        }

        return '{' + res.join(',') + '}';
    }
};
