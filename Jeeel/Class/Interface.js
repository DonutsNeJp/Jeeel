
/**
 * コンストラクタ
 * 
 * @class インターフェースを擬似管理するクラス
 * @param {String} name インターフェース名
 * @param {Hash} interfaceClass インターフェース
 */
Jeeel.Class.Interface = function (name, interfaceClass) {
    this._name = name;
    
    var methods = [];
    var constants = [];
    var list = ['constructor', 'toString', 'valueOf'];
    
    if (Jeeel.Type.isArray(interfaceClass)) {
        for (var i = interfaceClass.length; i--;) {
            methods.push({
                name: interfaceClass[i],
                length: '*'
            });
        }
    } else {
        for (var key in interfaceClass) {
            if (typeof interfaceClass[key] === 'function') {
              
                if (Jeeel.Hash.inHash(key, list, true)) {
                    continue;
                }
                
                methods.push({
                    name: key,
                    length: interfaceClass[key].length
                });
            } else {
                constants.push({
                    name: key,
                    value: interfaceClass[key]
                });
            }
        }
    }
    
    this._interface = interfaceClass;
    this._methods = methods;
    this._constants = constants;
};

/**
 * インスタンスの作成を行う
 * 
 * @param {String} name インターフェース名
 * @param {Hash} interfaceClass インターフェース
 * @return {Jeeel.Class.Interface} 作成したインスタンス
 */
Jeeel.Class.Interface.create = function (name, interfaceClass) {
    return new this(name, interfaceClass);
};

/**
 * インターフェースを登録する
 * 
 * @param {String} name インターフェース名
 * @param {Hash} interfaceClass 登録インターフェース
 * @return {Jeeel.Class.Interface} 登録したインターフェースインスタンス
 */
Jeeel.Class.Interface.register = function (name, interfaceClass) {
    if ( ! (interfaceClass instanceof this)) {
        interfaceClass = this.create(name, interfaceClass);
    }
    
    return this._caches[interfaceClass._name] = interfaceClass;
};

/**
 * インターフェース名からインスタンスの取得を行う
 * 
 * @param {String} name インターフェース名
 * @return {Jeeel.Class.Interface} 取得したインスタンス
 */
Jeeel.Class.Interface.getInstance = function (name) {
    return this._caches[name] || null;
};

Jeeel.Class.Interface.implement = function (implementClass, implementInterface) {
    
    if ( ! (implementInterface instanceof Jeeel.Class.Interface)) {
        if (Jeeel.Type.isString(implementInterface)) {
            implementInterface = Jeeel.Class.Interface.getInstance(implementInterface);
        } else if (Jeeel.Type.isArray(implementInterface) && Jeeel.Type.isString(implementInterface[0]) && Jeeel.Type.isHash(implementInterface[1])) {
            implementInterface = Jeeel.Class.Interface.register(implementInterface[0], implementInterface[1]);
        } else if (Jeeel.Type.isHash(implementInterface)) {
            implementInterface = Jeeel.Class.Interface.create((this._implementId++) + '-interface', implementInterface);
        }
    }

    if ( ! (implementInterface instanceof Jeeel.Class.Interface)) {
        throw new Error('implementInterface is not Jeeel.Class.Interface instance.');
    }
    
    if (implementClass.prototype._autoValidateImplements) {
        implementClass = implementClass.prototype._inherited;
    }

    if ( ! implementClass.prototype.implementOf) {
        implementClass.prototype.implementOf = this.implementOf;
    }

    if ( ! implementClass.prototype.isImplemented) {
        implementClass.prototype.isImplemented = this.isImplemented;
    }

    if ( ! implementClass.prototype._implements) {
        implementClass.prototype._implements = {};
    } else if ( ! implementClass.prototype.hasOwnProperty('_implements')) {
        implementClass.prototype._implements = Jeeel.Hash.merge({}, implementClass.prototype._implements);
    }

    if (implementClass.prototype.constructor !== implementClass) {
        implementClass.prototype.constructor = implementClass;
    }

    var constants = implementInterface.getConstants();

    for (var i = constants.length; i--;) {
        implementClass[constants[i].name] = constants[i].value;
    }

    implementClass.prototype._implements[implementInterface.getName()] = implementInterface;
    
    var newClass = new Function("this._autoValidateImplements.apply(this, arguments);");

    newClass.prototype = implementClass.prototype;
    newClass.prototype._inherited = implementClass;
    newClass.prototype._autoValidateImplements = this._autoValidateImplements;
    
    for (var key in implementClass) {
        if (implementClass.hasOwnProperty(key)) {
            newClass[key] = implementClass[key];
        }
    }

    return newClass;
};

/**
 * インターフェースを正確に実装しているかどうかを調べる
 * 
 * @param {String|Jeeel.Class.Interface} implementInterface 
 * @return {Boolean} 正確に実装しているかどうか
 */
Jeeel.Class.Interface.implementOf = function (implementInterface) {
    if (Jeeel.Type.isString(implementInterface)) {
        implementInterface = Jeeel.Class.Interface.getInstance(implementInterface);
    }

    if ( ! (implementInterface instanceof Jeeel.Class.Interface)) {
        throw new Error('implementInterface is not Jeeel.Class.Interface instance.');
    }

    var interfaceName = implementInterface.getName();

    var res = this._implements
           && this._implements[interfaceName]
           && this._implements[interfaceName].isImplemented(this);
    
    return !!res;
};

/**
 * 実装したインターフェースのメソッドが全て実装されているかどうかを調べる
 * 
 * @return {Boolean} 正確に実装しているかどうか
 */
Jeeel.Class.Interface.isImplemented = function () {
    if ( ! this._implements) {
        return false;
    }

    for (var key in this._implements) {
        if ( ! (this._implements[key] instanceof Jeeel.Class.Interface)) {
            continue;
        }
        
        if ( ! this._implements[key].isImplemented(this)) {
            return false;
        }
    }

    return true;
};

/**
 * コンストラクタ
 * 
 * @class インターフェースの状況を自動検証する擬似クラス
 * @private
 */
Jeeel.Class.Interface._autoValidateImplements = function () {
  
    this._inherited.apply(this, arguments);
    
    var err = true;
    
    if ( ! this._implements) {
        err = 'There is no evidence that implements the interface.';
    } else {
        for (var key in this._implements) {
            
            if ( ! (this._implements[key] instanceof Jeeel.Class.Interface)) {
                continue;
            }
            
            if ((err = this._implements[key]._validateImplement(this)) !== true) {
                break;
            }
        }
    }
    
    if (err !== true) {
        err = new Error(err);
        err.name = 'ImplementError';
        
        throw err;
    }
};

/**
 * キャッシュ
 * 
 * @type Hash
 * @private
 */
Jeeel.Class.Interface._caches = {};

Jeeel.Class.Interface._implementId = 0;

Jeeel.Class.Interface.prototype = {
    
    /**
     * インターフェース
     * 
     * @type Hash
     * @private
     */
    _interface: null,
    
    /**
     * インターフェース名
     * 
     * @type String
     * @private
     */
    _name: '',
    
    /**
     * 実装メソッド名のリスト
     * 
     * @type Array
     * @private
     */
    _methods: [],
    
    /**
     * 定数のリスト
     * 
     * @type Array
     * @private
     */
    _constants: [],
    
    /**
     * インターフェース名を取得する
     * 
     * @return {String} インターフェース名
     */
    getName: function () {
        return this._name;
    },
    
    /**
     * 定数リストを取得する
     * 
     * @return {Array} 定数リスト
     */
    getConstants: function () {
        return this._constants;
    },
    
    /**
     * このインターフェースを指定したインスタンスが実装しているかどうかを調べる
     * 
     * @param {Object} instance 比較インスタンス
     * @return {Boolean} 実装をしているかどうか
     */
    isImplemented: function (instance) {
        return this._validateImplement(instance) === true;
    },
    
    /**
     * このインターフェースを指定したインスタンスが実装しているかどうかを調べ状態を返す
     * 
     * @param {Object} instance 比較インスタンス
     * @return {Boolean|String} 実装状態
     */
    _validateImplement: function (instance) {
        var i;
        
        for (i = this._methods.length; i--;) {
            var method = instance[this._methods[i].name];
            
            if (typeof method !== 'function') {
                return 'You need to implement the "' + this._methods[i].name + '" method.';
            } else if (this._methods[i].length !== '*' && method.length !== this._methods[i].length) {
                return 'Number of arguments of the "' + this._methods[i].name + '" method is different.';
            }
        }
        
        for (i = this._constants.length; i--;) {
            var constant = this._constants[i];
            
            if (instance.constructor[constant.name] !== constant.value) {
                return 'Constant "' + constant.name + '" is not implemented properly.';
            }
        }
        
        return true;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {String} interfaceName インターフェース名
     * @param {String[]} methods 実装メソッドリスト
     * @constructor
     */
    constructor: Jeeel.Class.Interface
};
