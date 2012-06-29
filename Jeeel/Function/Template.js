
/**
 * @namespace 様々な箇所で汎用的に使用する関数を保有するネームスペース
 */
Jeeel.Function.Template = {
    
    /**
     * 何もしない関数
     * 
     * @type Function
     * @field
     * @constant
     */
    EMPTY: function () {
        
    },
    
    /**
     * nullを返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_NULL: function () {
        return null;
    },
    
    /**
     * trueを返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_TRUE: function () {
        return true;
    },
    
    /**
     * falseを返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_FALSE: function () {
        return false;
    },
    
    /**
     * 0を返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_ZERO: function () {
        return 0;
    },
    
    /**
     * 空文字列を返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_EMPTY_STRING: function () {
        return '';
    },
    
    /**
     * 空配列を返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_EMPTY_ARRAY: function () {
        return [];
    },
    
    /**
     * 空連想配列を返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_EMPTY_HASH: function () {
        return {};
    },
    
    /**
     * 引数返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_ARGUMENT: function (value) {
        return value;
    },
    
    /**
     * thisを返すだけの関数
     * 
     * @type Function
     * @field
     * @constant
     */
    RETURN_THIS: function () {
        return this;
    },
    
    /**
     * 引数を例外として投げる関数
     * 
     * @type Function
     * @field
     * @constant
     */
    THROW_ARGUMENT: function (value) {
        throw value;
    }
};
