
/**
 * コンストラクタ
 *
 * @class Html要素毎に内部のinputをまとめあげる(送信時のパラメータのようにnameで区分け)<br />
 *         その際radioボタンは強制的にリストになる
 * @augments Jeeel.Filter.Abstract
 * @param {Boolean} [useDefaultValue] trueにすると現在値でなくデフォルト値を参照して纏め上げる
 * @param {String} [unknownName] 名前のついていないinputに使用する名前(デフォルトは無視する)
 * @param {String} [overwrittenName] 本来上書きされてしまう要素を取得したい時に使用する名前(内部はElement[]になる)
 */
Jeeel.Filter.Html.Form = function (useDefaultValue, unknownName, overwrittenName) {

    Jeeel.Filter.Abstract.call(this);
    
    this._useDefaultValue = !!useDefaultValue;
    
    if (unknownName) {
        this._unknownName = unknownName + '[]';
    }
    
    this._overwrittenName = overwrittenName || null;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Boolean} [useDefaultValue] trueにすると現在値でなくデフォルト値を参照して纏め上げる
 * @param {String} [unknownName] 名前のついていないinputに使用する名前(デフォルトは無視する)
 * @param {String} [overwrittenName] 本来上書きされてしまう要素を取得したい時に使用する名前(内部はElement[]になる)
 * @return {Jeeel.Filter.Html.Form} 作成したインスタンス
 */
Jeeel.Filter.Html.Form.create = function (useDefaultValue, unknownName, overwrittenName) {
    return new this(useDefaultValue, unknownName, overwrittenName);
};

Jeeel.Filter.Html.Form.prototype = {
  
    _useDefaultValue: false,
    
    _unknownName: '',
    
    _overwrittenName: null,
    
    _avoidValues: [],
    
    /**
     * @private
     */
    _filter: function (val) {
        if ( ! Jeeel.Type.isElement(val)) {
            throw new Error('Elementではない要素を含んでいます。');
        }

        var inputs = this._getInputs(val);

        var res = {}, name;
        
        this._avoidValues = [];
        
        for (var i = 0, l = inputs.length; i < l; i++) {

            name = this._getProp(inputs[i], 'name') || this._unknownName;

            if ( ! name) {
                continue;
            }

            this._setParams(res, name, inputs[i]);
        }
        
        if (this._overwrittenName) {
            res[this._overwrittenName] = this._avoidValues;
        }

        return res;
    },

    /**
     * @private
     */
    _filterArray: function (vals) {

        if (Jeeel.Type.isElement(vals)) {
            return this._filter(vals);
        }

        var res = {};

        var self = this;

        Jeeel.Hash.forEach(vals,
            function (val, key) {
                res[key] = self._filter(val);
            }
        );

        return res;
    },
    
    _getInputs: Jeeel._Object.JeeelFilter.getInputs,

    _getName: Jeeel._Object.JeeelFilter.getInputName,
    
    _repairName: Jeeel._Object.JeeelFilter.repairInputName,
    
    _repairValue: function (hash) {
        if (Jeeel.Type.isElement(hash)) {
            return hash;
        }

        var tmp, res = [];

        for (var key in hash) {
            var val = hash[key];

            tmp = this._repairValue(val);

            if (tmp) {
                res = res.concat(tmp);
            }
        }

        return res;
    },
    
    _getProp: function (elm, propName) {
        if (this._useDefaultValue) {
            return elm.getAttribute(propName);
        }
        
        return elm[propName];
    },
    
    _setParams: function (res, name, element) {

        if (element.tagName.toUpperCase() === 'INPUT' && element.type.toLowerCase() === 'radio') {
            name = name + '[]';
        }

        var key, names = this._getName(name);

        for (var i = 0, l = names.length; i < l; i++) {
          
            if (key) {
                res = res[key];
            }

            key = names[i] || this._getMaxCount(res);

            if (i < l -1) {
                if (Jeeel.Type.isElement(res[key])) {
                    this._avoidValues[this._avoidValues.length] = new Jeeel.Object.Item(this._repairName(names.slice(0, i + 1)), res[key]);
                    
                    res[key] = {};
                } else if ( ! (key in res)) {
                    res[key] = {};
                }
            }
        }
        
        if (key in res) {
            this._avoidValues = this._avoidValues.concat(this._repairValue(res[key]));
        }
        
        res[key] = element;
    },
    
    _getMaxCount: function (res) {
        var cnt = null;

        for (var key in res) {

            var digit = +key;

            if (Jeeel.Type.isInteger(digit) && (cnt === null || digit > cnt)) {
                cnt = digit;
            }
        }

        return (cnt === null ? 0 : cnt + 1);
    }
};

Jeeel.Class.extend(Jeeel.Filter.Html.Form, Jeeel.Filter.Abstract);
