
/**
 * 数値を指定範囲内に収める
 * 
 * @param {Number} number 対象の数値
 * @param {Number} min 最小値
 * @param {Number} max 最大値
 * @return {Number} 収めた後の数値
 */
Jeeel.Number.limit = function (number, min, max) {
    if (number < min) {
        number = min;
    }
    
    if (number > max) {
        number = max;
    }
    
    return number;
};