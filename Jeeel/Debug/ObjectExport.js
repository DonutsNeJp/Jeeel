/**
 * 指定したオブジェクトを展開する
 *
 * @param {Mixied} obj 展開するオブジェクト
 * @return {String} 展開したオブジェクト
 */
Jeeel.Debug.objectExport = function (obj) {
    var res = typeof obj;
    var cnt = (arguments[1] ? arguments[1] : 0);
    var i, l;
    var sp = '';

    for (i = 0; i < cnt; i++) {
        sp += '    ';
    }

    if (Jeeel.Type.isPrimitive(obj)) {
        if (Jeeel.Type.isString(obj)) {
            return '"' + obj + '"';
        }
        
        return obj;
    }

    if (Jeeel.Type.isFunction(obj)) {
        var str = obj.toString();
        var remove = str.match(/ +}$/gi);
        if (remove) {
            remove = remove[0].substring(0, remove[0].length-1);
            var regExp = new RegExp('(\\n|\\r\\n)'+remove, 'ig');
            str = str.replace(regExp, '\n');
        }

        return str.replace(/(\n|\r\n)/ig, '$1'+sp);
    }

    cnt++;

    if (Jeeel.Type.isArray(obj)) {
        res = [];

        for (i = 0, l = obj.length; i < l; i++) {
            res[i] = sp + '    ' + i + ': ' + arguments.callee(obj[i], cnt);
        }

        return 'array {\n' + res.join(',\n') + '\n' + sp + '}';
    } else {
        var className = res;
        
        res = [];

        for (var key in obj) {
            if (key === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                continue;
            }
            
            res[res.length] = sp + '    ' + key + ': ' + arguments.callee(obj[key], cnt);
        }

        return className + ' {\n' + res.join(',\n') + '\n' + sp + '}';
    }
};
