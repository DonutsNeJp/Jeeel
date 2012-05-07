
/**
 * コンストラクタ
 *
 * @class Html要素毎に内部のinputの値をまとめあげる(送信時のパラメータのようにnameで区分け)<br />
 *         その際無効なinputは無視する(checkedが付いていないradioボタンやcheckbox、選択されていないselectbox)
 * @augments Jeeel.Filter.Abstract
 * @param {Boolean} [useDefaultValue] trueにすると現在値でなくデフォルト値を参照して纏め上げる(値もデフォルト値になる)
 * @param {String} [unknownName] 名前のついていないinputに使用する名前(デフォルトは無視する)
 * @param {String} [overwrittenName] 本来上書きされてしまう要素を取得したい時に使用する名前(内部はJeeel.Object.Item[]になる)
 */
Jeeel.Filter.Html.FormValue = function (useDefaultValue, unknownName, overwrittenName) {

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
 * @param {String} [overwrittenName] 本来上書きされてしまう要素を取得したい時に使用する名前(内部はJeeel.Object.Item[]になる)
 * @return {Jeeel.Filter.Html.FormValue} 作成したインスタンス
 */
Jeeel.Filter.Html.FormValue.create = function (useDefaultValue, unknownName, overwrittenName) {
    return new this(useDefaultValue, unknownName, overwrittenName);
};

Jeeel.Filter.Html.FormValue.prototype = {
    
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
    _filterEach: function (vals) {

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
    
    _repairValue: function (name, hash) {
        if ( ! Jeeel.Type.isHash(hash)) {
            return new Jeeel.Object.Item(name, hash);
        }

        var tmp, res = [];

        for (var key in hash) {
            var nextParent, 
                val = hash[key];

            if (name) {
                nextParent = name + '[' + key + ']';
            } else {
                nextParent = key;
            }

            tmp = this._repairValue(nextParent, val);

            if (tmp) {
                res = res.concat(tmp);
            }
        }

        return res;
    },
    
    _getProp: function (elm, propName) {
        var tag, res, ops, i, l;
        
        if (this._useDefaultValue) {
            if (propName === 'value') {
                tag = elm.tagName.toUpperCase();
                
                if (tag === 'SELECT') {
                    ops = elm.options;

                    if (elm.getAttribute('multiple')) {
                        res = [];

                        for (i = 0, l = ops.length; i < l; i++) {
                            if (ops[i].getAttribute('selected')) {
                                res[res.length] = ops[i].getAttribute(propName);
                            }
                        }
                        
                        return res;
                    }
                    
                    for (i = 0, l = ops.length; i < l; i++) {
                        if (ops[i].getAttribute('selected')) {
                            return ops[i].getAttribute(propName);
                        }
                    }

                    return l && ops[0].getAttribute(propName) || null;
                } else if (tag === 'INPUT') {
                    return elm.defaultValue;
                }
            }
            
            return elm.getAttribute(propName);
        }
        
        if (propName === 'value') {
            if (Jeeel.Dom.Behavior.Placeholder.isHolded(elm)) {
                return '';
            }
            
            tag = elm.tagName.toUpperCase();
            
            if (tag === 'SELECT' && elm.multiple) {
                ops = elm.options;
                
                res = [];
                
                for (i = 0, l = ops.length; i < l; i++) {
                    if (ops[i].selected) {
                        res[res.length] = ops[i].value;
                    }
                }
                
                return res;
            }
        }
        
        return elm[propName];
    },
    
    _setParams: function (res, name, element) {

        if (element.tagName.toUpperCase() === 'INPUT') {
            if (element.type.toLowerCase() === 'checkbox' && ! this._getProp(element, 'checked')) {
                return;
            } else if (element.type.toLowerCase() === 'radio' && ! this._getProp(element, 'checked')) {
                return;
            }
        } else if (element.tagName.toLowerCase() === 'select') {
            
            var multiple = (this._useDefaultValue && element.getAttribute('multiple'))
                        || ( ! this._useDefaultValue && element.multiple);
            
            if (element.selectedIndex < 0 && ! multiple) {
                return;
            }
        }

        var key, names = this._getName(name);

        for (var i = 0, l = names.length; i < l; i++) {
          
            if (key) {
                res = res[key];
            }

            key = names[i] || this._getMaxCount(res);

            if (i < l -1) {
                if (typeof res[key] === 'string') {
                    this._avoidValues[this._avoidValues.length] = new Jeeel.Object.Item(this._repairName(names.slice(0, i + 1)), res[key]);
                    
                    res[key] = {};
                } else if ( ! (key in res)) {
                    res[key] = {};
                }
            }
        }
        
        if (key in res) {
            this._avoidValues = this._avoidValues.concat(this._repairValue(name, res[key]));
        }
        
        res[key] = this._getProp(element, 'value');
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

Jeeel.Class.extend(Jeeel.Filter.Html.FormValue, Jeeel.Filter.Abstract);
