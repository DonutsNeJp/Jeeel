/**
 * 平均値を求める
 * 
 * @param {Number} var_args 平均値を求める際に数を可変で引き渡す
 */
Jeeel.Number.getAvg = function (var_args) {
    return this.getSum.apply(this, arguments) / arguments.length;
};