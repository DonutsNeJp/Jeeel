/**
 * 最小公倍数を求める
 * 
 * @param {Integer} base 最小公倍数を求める際の数
 * @param {Integer} var_args 可変引数、2つ以上の数を指定する場合に渡す
 * @return {Integer} 最小公倍数(正)
 */
Jeeel.Number.getLcm = function (base, var_args) {
    var i, j, l;
    
    for (i = 0, l = arguments.length - 1; i < l; i++) {
        j = i + 1;
        
        arguments[j] = arguments[i] * arguments[j] / this.getGcd(arguments[i], arguments[j]);
    }

    return arguments[l] < 0 ? -arguments[l] : arguments[l];
};