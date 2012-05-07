/**
 * @namespace 汎用的なメソッドを保持するネームスペース
 */
Jeeel.Method = {
    
    /**
     * 指定した変数を複製して返す<br />
     * ただし比較の際型は違うものとしてとらえられる可能性がある<br />
     * なおコピー方法はシャローコピーであり内部変数までは複製しない
     *
     * @param {Mixied} value 複製する変数
     * @return {Mixied} 複製後の値
     */
    clone: function (value) {

        if (Jeeel.Type.isPrimitive(value)) {
            return value;
        } else if (Jeeel.Type.isArray(value)) {
            return (value.length === 1 ? [value[0]] : Array.apply(null, value));
        } else if (Jeeel.Type.isFunction(value)) {
            value = value.toString();

            if (value.match(/\{(\n|\s)+\[native code\](\n|\s)+\}/)) {
                return value;
            }

            eval('value = '+value);

            return value;
        }

        var newClass = function (){};

        newClass.prototype = value;

        return new newClass();
    }
};
