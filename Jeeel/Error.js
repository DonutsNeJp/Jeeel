
/**
 * コンストラクタ
 * 
 * @class 独自エラークラス(デバッグモードが有効の場合はスタックトレースも取得する)
 * @param {String} [message] エラーメッセージ
 * @param {Integer} [code] エラーコード
 * @param {Integer} [nestCount] このエラーメッセージを本来投げるべき箇所以外で作成した場合に指定
 */
Jeeel.Error = function (message, code, nestCount) {
  
    if (Error && Error.call) {
        var err = Error.call(this, message);
        var pairs = Jeeel.Hash.getPairs(err, false);

        for (var i = pairs.length; i--;) {
            if (pairs[i].key === '__proto__') {
                continue;
            } else if (pairs[i].key === 'name') {
                continue;
            }

            this[pairs[i].key] = pairs[i].value;
        }
    }
    
    this.message = '' + message;
    this.code = +code || 0;
    
    if (Jeeel._debugMode && Jeeel.Debug) {
        
        if ( ! (nestCount > 0)) {
            nestCount = 1;
        } else {
            nestCount++;
        }
        
        this.stackTrace = Jeeel.Debug.Debugger.getTrace(nestCount);
    }
};

Jeeel.Error.prototype = {
    
    /**
     * Error名
     * 
     * @type String
     */
    name: 'JeeelError',

    /**
     * エラーメッセージ
     * 
     * @type String
     */
    message: '',
    
    /**
     * エラーコード
     * 
     * @type Integer
     */
    code: 0,
    
    /**
     * スタックトレース
     * 
     * @type Jeeel.Object.Technical.Trace[]
     */
    stackTrace: [],
    
    /**
     * コンストラクタ
     * 
     * @param {String} [message] エラーメッセージ
     * @param {Integer} [nestCount] このエラーメッセージを本来投げるべき箇所以外で作成した場合に指定
     * @constructor
     */
    constructor: Jeeel.Error
};

Jeeel.Class.extend(Jeeel.Error, Error);