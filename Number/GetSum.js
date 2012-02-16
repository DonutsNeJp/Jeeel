/**
 * 合計値を求める
 * 
 * @param {Number} var_args 合計値を求める際に数を可変で引き渡す
 */
Jeeel.Number.getSum = function (var_args) {
    var i, sum = 0;
    
    for (i = arguments.length; i--;) {
        sum += arguments[i];
    }
    
    return sum;
};