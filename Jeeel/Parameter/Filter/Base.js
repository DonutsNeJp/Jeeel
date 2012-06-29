
/**
 * コンストラクタ
 * 
 * @class 基本となるフィルタクラス
 * @augments Jeeel.Parameter.Filter.Abstract
 */
Jeeel.Parameter.Filter.Base = function () {
    Jeeel.Parameter.Filter.Abstract.call(this);
};

Jeeel.Parameter.Filter.Base.prototype = {
    
    /**
     * 値が無かったら無視する
     * 
     * @param {Mixed} value フィルタ値
     * @return int フィルタ後の値
     */
    filterOption: function (value) {
        return ! Jeeel.Type.isEmpty(value) ? value : Jeeel.Parameter.Filter.IGNORED_VALUE;
    },
    
    /**
     * 値が指定されていなかった場合に代わりに代替値を返す
     * 
     * @param {Mixed} value 対象値
     * @param {Mixed} defaultValue デフォルト値
     * @return {Mixed} 処理後の値
     */
    filterDefault: function (value, defaultValue) {
        return ! Jeeel.Type.isEmpty(value) ? value : defaultValue;
    },
    
    /**
     * floatにキャストする
     * 
     * @param {Mixed} value キャスト値
     * @return {Number} キャスト後の値
     */
    filterFloat: function (value) {
        if (value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        }
        
        return +value;
    },
    
    /**
     * intにキャストする
     * 
     * @param {Mixed} value キャスト値
     * @return {Integer} キャスト後の値
     */
    filterInt: function (value) {
        if (value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        }
        
        return Math.floor(+value);
    },
    
    /**
     * Stringにキャストする
     * 
     * @param {Mixed} value キャスト値
     * @return {String} キャスト後の値
     */
    filterString: function (value) {
        if (value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        } else if ( ! value && value !== 0) {
            return '';
        }
        
        return (value.toString ? value.toString() : '' + value);
    },
    
    /**
     * Arrayにキャストする
     * 
     * @param {Mixed} value キャスト値
     * @return {Array} キャスト後の値
     */
    filterArray: function (value) {
        if (value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        }
        
        return Jeeel.Type.isArray(value) ? value : [value];
    },
    
    /**
     * Booleanにキャストする
     * 
     * @param {Mixed} value キャスト値
     * @return {Boolean} キャスト後の値
     */
    filterBool: function (value) {
        if (value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        }
        
        return !!value;
    },
    
    /**
     * 前後の空白等を取り除く
     * 
     * @param {String} value 対象値
     * @return {String} 処理後の値
     */
    filterTrim: function (value) {
        if (Jeeel.Type.isEmpty(value) || value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        }
        
        return Jeeel.String.trim(value);
    },
    
    /**
     * 全角英数字とスペース・記号を半角にする
     * 
     * @param {String} value 対象値
     * @return {String} 処理後の値
     */
    filterHalfWidth: function (value) {
        if (Jeeel.Type.isEmpty(value) || value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        }
        
        return Jeeel.String.toHalfWidth(value);
    },
    
    /**
     * 半角英数字とスペース・記号を全角にする
     * 
     * @param {String} value 対象値
     * @return {String} 処理後の値
     */
    filterFullWidth: function (value) {
        if (Jeeel.Type.isEmpty(value) || value === Jeeel.Parameter.Filter.IGNORED_VALUE) {
            return value;
        }
        
        return Jeeel.String.toFullWidth(value);
    }
};

Jeeel.Class.extend(Jeeel.Parameter.Filter.Base, Jeeel.Parameter.Filter.Abstract);

Jeeel.Parameter.addDefaultFilter(new Jeeel.Parameter.Filter.Base());
