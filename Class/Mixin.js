
/**
 * コンストラクタ
 * 
 * @class インスタンス混合クラス
 * @param {Object|Object[]} [mixinInstances] 混合インスタンス、もしくは混合インスタンスリスト
 * @param {Boolean} [returnInstance] 戻り値に自インスタンス許可するかどうか
 */
Jeeel.Class.Mixin = function (mixinInstances, returnInstance) {
    if ( ! mixinInstances) {
        mixinInstances = [];
    } else if ( ! Jeeel.Type.isArray(mixinInstances)) {
        mixinInstances = [mixinInstances];
    }
    
    returnInstance = !!returnInstance;
    
    for (var i = mixinInstances.length; i--;) {
        mixinInstances[i] = {instance: mixinInstances[i], returnInstance: returnInstance};
    }
    
    this._mixinInstances = mixinInstances;
    
    this._mixinMethod();
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Object|Object[]} [mixinInstances] 混合インスタンス、もしくは混合インスタンスリスト
 * @param {Boolean} [returnInstance] 戻り値に自インスタンス許可するかどうか
 * @return {Jeeel.Class.Mixin} 作成したインスタンス
 */
Jeeel.Class.Mixin.create = function (mixinInstances, returnInstance) {
    return new this(mixinInstances, returnInstance);
};

Jeeel.Class.Mixin.prototype = {
  
    /**
     * 混ぜているインスタンスリスト
     * 
     * @type Hash[]
     * @private
     */
    _mixinInstances: [],
    
    /**
     * 新たにインスタンスを混合する<br />
     * 同じメソッドが存在した場合後から混合したインスタンスが優先される
     * 
     * @param {Object} mixinInstance 混合インスタンス
     * @param {Boolean} [returnInstance] 戻り値に自インスタンス許可するかどうか
     * @return {Jeeel.Class.Mixin} 自インスタンス
     */
    mixin: function (mixinInstance, returnInstance) {
        this._mixinInstances[this._mixinInstances.length] = {instance: mixinInstance, returnInstance: !!returnInstance};
        
        return this._mixinMethod();
    },
    
    /**
     * メソッドを呼び出す
     * 
     * @param {String} methodName メソッド名
     * @param {Mixied} var_args 引数を順に渡す
     * @return {Jeeel.Class.Mixin|Mixied} 自インスタンスもしくは戻り値
     */
    call: function (methodName, var_args) {
        var args = Array.prototype.slice.call(arguments, 1, arguments.length);
        
        return this.apply(methodName, args);
    },
    
    /**
     * メソッドを呼び出す
     * 
     * @param {String} methodName メソッド名
     * @param {Array} [args] 引数のリスト
     * @return {Jeeel.Class.Mixin|Mixied} 自インスタンスもしくは戻り値
     */
    apply: function (methodName, args) {
        var instance = this._getInstance(methodName);
        
        if ( ! instance) {
            throw new Error(methodName + ' メソッドは見つかりません。');
        }
        
        var returnInstance = instance.returnInstance;
        
        instance = instance.instance;
        
        var res = instance[methodName].apply(instance, args || []);
        
        if (returnInstance && res === instance) {
            return this;
        }
        
        return res;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Class.Mixin,
    
    /**
     * メソッド名からインスタンスを特定して返す
     * 
     * @param {String} methodName メソッド名
     * @return {Hash} インスタンス情報
     * @private
     */
    _getInstance: function (methodName) {
      
        // 後ろから検索してインスタンスを取得する
        for (var i = this._mixinInstances.length; i--;) {
            if (typeof this._mixinInstances[i].instance[methodName] === 'function') {
                return this._mixinInstances[i];
            }
        }
        
        return null;
    },
    
    /**
     * メソッドの混合を行う
     * 
     * @return {Jeeel.Class.Mixin} 自インスタンス
     * @private
     */
    _mixinMethod: function () {
      
        // インスタンスは後に混ぜた方を優先
        for (var i = 0, l = this._mixinInstances.length; i < l; i++) {
            
            // インスタンスのプロパティを全て列挙
            for (var methodName in this._mixinInstances[i].instance) {
                
                // メソッド以外と元からあるプロパティは除外
                if (typeof this._mixinInstances[i].instance[methodName] !== 'function') {
                    continue;
                } else if (this[methodName] && ! this.hasOwnProperty(methodName)) {
                    continue;
                }
                
                // クロージャによってインスタンスに直接アクセスするメソッドを作成
                this[methodName] = (function (self, instance, returnInstance, methodName) {
                    return function () {
                        var res = instance[methodName].apply(instance, arguments);

                        if (returnInstance && res === instance) {
                            return self;
                        }

                        return res;
                    };
                })(this, this._mixinInstances[i].instance, this._mixinInstances[i].returnInstance, methodName);
            }
        }
        
        return this;
    }
};