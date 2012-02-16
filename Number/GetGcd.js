/**
 * 最大公約数を求める
 * 
 * @param {Integer} base 最大公約数を求める際の数
 * @param {Integer} var_args 可変引数、2つ以上の数を指定する場合に渡す
 * @return {Integer} 最大公約数(正)
 */
Jeeel.Number.getGcd = function (base, var_args) {
    var i, j, l, r;
    
    for (i = 0, l = arguments.length - 1; i < l; i++) {
        j = i + 1;
        r = arguments[i] % arguments[j];

        arguments[j] = r === 0 ? arguments[j] : arguments.callee(arguments[j], r < 0 ? -r : r);
    }
    
    return arguments[l];
};