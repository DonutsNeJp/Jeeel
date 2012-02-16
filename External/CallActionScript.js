
/**
 * Flash内のActionScript関数を呼び出す
 *
 * @param {String} flashName embedタグのname
 * @param {String} methodName 呼び出す関数名
 * @param {Mixied} var_args 呼び出す際に渡す引数の可変引数
 * @return {Mixied} ActionScript側からの戻り値
 */
Jeeel.External.callActionScript = function (flashName, methodName, var_args) {
    var flash = Jeeel._doc[flashName];
    
    if ( ! flash || ! flash[methodName]) {
        Jeeel.errorDump('ActionScript Call Error');
        return null;
    }
    
    var method = flash[methodName];
    var args = Array.prototype.slice.call(arguments, 2, arguments.length);
    
    if (method.apply) {
        return method.apply(flash, args);
    }

    return Jeeel.Function.toNative(flash, methodName).apply(null, args);
};
