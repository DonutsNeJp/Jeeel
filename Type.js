
Jeeel.directory.Jeeel.Type = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Type/';
    }
};

/**
 * 型に関する関数や定数を保持するスタティッククラス
 */
Jeeel.Type = {

    /**
     * 指定した値の型を返す
     *
     * @param {Mixied} val 判定値
     * @return {String} 判定結果
     */
    getType: function (val) {

        var types = Jeeel.Type.ObjectType;
        var type;

        switch (Object.prototype.toString.call(val)) {
            case '[object Function]':
                type = types.FUNCTION;
                break;

            case '[object Array]':
                type = types.ARRAY;
                break;

            case '[object Boolean]':
                type = types.BOOLEAN;
                break;

            case '[object String]':
                type = types.STRING;
                break;

            case '[object RegExp]':
                type = types.REGULAR_EXPRESSION;
                break;

            case '[object Date]':
                type = types.DATE;
                break;

            case '[object Number]':
                type = types.NUMBER;
                break;
                
            case '[object Math]':
                type = types.MATH;
                break;
                
            case '[object JSON]':
                type = types.JSON;
                break;

            default:

                if (this.isNull(val)) {
                    type = types.NULL;
                }
                else if (this.isUndefined(val)) {
                    type = types.UNDEFINED;
                }
                else if (this.isElement(val)) {
                    type = types.ELEMENT;
                }
                else if (this.isAttribute(val)) {
                    type = types.ATTRIBUTE;
                }
                else if (this.isText(val)) {
                    type = types.TEXT;
                }
                else if (this.isComment(val)) {
                    type = types.COMMENT;
                }
                else if (this.isDocumentFragment(val)) {
                    type = types.DOCUMENT_FRAGMENT;
                }
                else if (this.isDocument(val)) {
                    type = types.DOCUMENT;
                }
                else if (this.isWindow(val)) {
                    type = types.WINDOW;
                }
                else if (this.isArguments(val)) {
                    type = types.ARGUMENTS;
                }
                else if (this.isEvent(val)) {
                    type = types.EVENT;
                }
                else if (this.isError(val)) {
                    type = types.ERROR;
                }
                else if (this.isStorage(val)) {
                    type = types.STORAGE;
                }
                else if (this.isPrototype(val)) {
                    type = types.PROTOTYPE;
                }
                else {
                    type = types.OBJECT;
                }
                break;
        }

        return type;
    },

    /**
     * オブジェクトが元々保持しているキーのリストを返す
     *
     * @param {String} type 型を示す文字列値(Jeeel.Type.ObjectType 参照)
     * @return {String[]} キーのリスト
     */
    getKeys: function (type) {

        var types  = Jeeel.Type.ObjectType;
        var obKeys = Jeeel.Type.ObjectKeys;
        var keys = [];

        switch (type) {
            case types.NULL:
            case types.UNDEFINED:
                return [];
                break;

            case types.ARRAY:
                keys = keys.concat(obKeys.ARRAY);
                break;

            case types.BOOLEAN:
                keys = keys.concat(obKeys.BOOLEAN);
                break;

            case types.STRING:
                keys = keys.concat(obKeys.STRING);
                break;

            case types.NUMBER:
                keys = keys.concat(obKeys.NUMBER);
                break;

            case types.FUNCTION:
                keys = keys.concat(obKeys.FUNCTION);
                break;

            case types.REGULAR_EXPRESSION:
                keys = keys.concat(obKeys.REGULAR_EXPRESSION);
                break;

            case types.DATE:
                keys = keys.concat(obKeys.DATE);
                break;

            case types.ELEMENT:
                keys = keys.concat(obKeys.ELEMENT);
                break;
                
            case types.ATTRIBUTE:
                keys = keys.concat(obKeys.ATTRIBUTE);
                break;

            case types.TEXT:
                keys = keys.concat(obKeys.TEXT);
                break;

            case types.COMMENT:
                keys = keys.concat(obKeys.COMMENT);
                break;

            case types.DOCUMENT_FRAGMENT:
                keys = keys.concat(obKeys.DOCUMENT_FRAGMENT);
                break;

            case types.DOCUMENT:
                keys = keys.concat(obKeys.DOCUMENT);
                break;

            case types.WINDOW:
                keys = keys.concat(obKeys.WINDOW);
                break;

            case types.ARGUMENTS:
                keys = keys.concat(obKeys.ARGUMENTS);
                break;

            case types.EVENT:
                keys = keys.concat(obKeys.EVENT);
                break;

            case types.ERROR:
                keys = keys.concat(obKeys.ERROR);
                break;
                
            case types.MATH:
                keys = keys.concat(obKeys.MATH);
                break;
                
            case types.JSON:
                keys = keys.concat(obKeys.JSON);
                break;

            case types.STORAGE:
                keys = keys.concat(obKeys.STORAGE);
                break;

            case types.PROTOTYPE:
                keys = keys.concat(obKeys.PROTOTYPE);
                break;

            case types.OBJECT:
                break;

            default:
                break;
        }

        if (type != types.PROTOTYPE) {
            keys = keys.concat(obKeys.OBJECT);
        }

        return keys;
    },

    /**
     * オブジェクト型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isObject: function (val) {
        return !!(val && Object.prototype.toString.call(val) === "[object Object]");
    },

    /**
     * オブジェクトのprototype型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isPrototype: function (val) {
        return (Object.prototype === val);
    },

    /**
     * 関数型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isFunction: function (val) {
        return (Object.prototype.toString.call(val) === "[object Function]");
    },

    /**
     * 配列型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isArray: function (val) {
        return (Object.prototype.toString.call(val) === "[object Array]");
    },

    /**
     * ハッシュかどうか返す(name[key]の形が扱えるもの)
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isHash: function (val) {
        var type = typeof val;
        
        // NodeList, HTMLCollection, RegExpのインスタンスはブラウザによってはfunctionになるので回避
        return !!(val && (type === 'object' || type === 'function' && ! (val instanceof Function)));
    },

    /**
     * 配列のように扱えると思われるlengthプロパティを保持しているかどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    hasLength: function (val) {
        return !!(val && this.isInteger(val.length));
    },

    /**
     * 真偽値型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isBoolean: function (val) {
        return (Object.prototype.toString.call(val) === "[object Boolean]");
    },

    /**
     * 文字列型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isString: function (val) {
        return (Object.prototype.toString.call(val) === "[object String]");
    },

    /**
     * 正規表現型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isRegularExpression: function (val) {
        return (Object.prototype.toString.call(val) === "[object RegExp]");
    },

    /**
     * 日付型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isDate: function (val) {
        return (Object.prototype.toString.call(val) === "[object Date]");
    },

    /**
     * 数値型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isNumber: function (val) {
        return (Object.prototype.toString.call(val) === "[object Number]");
    },
    
    /**
     * 実数かどうかを返す(数値型で無限大・非数値以外だったらtrue)
     * 
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isRealNumber: function (val) {
        if ( ! this.isNumber(val)) {
            return false;
        } else if (typeof val === 'object') {
            val = +val;
        }
        
        if (isNaN(val) || val === -Infinity || val === Infinity) {
            return false;
        }
        
        return true;
    },

    /**
     * 整数型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isInteger: function (val) {
        if ( ! this.isNumber(val)) {
            return false;
        } else if (typeof val === 'object') {
            val = +val;
        }
        
        if (isNaN(val) || val === -Infinity || val === Infinity) {
            return false;
        }

        val = '' + val;

        if (val.indexOf('.') < 0) {
            return true;
        }

        return false;
    },

    /**
     * 小数型かどうかを返す(小数値の部分が0になった場合整数になるのでfalseとなる)
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isFloat: function (val) {
        if ( ! this.isNumber(val)) {
            return false;
        } else if (typeof val === 'object') {
            val = +val;
        }
        
        if (isNaN(val) || val === -Infinity || val === Infinity) {
            return false;
        }

        val = '' + val;

        if (val.indexOf('.') < 0) {
            return false;
        }

        return true;
    },

    /**
     * 数値型もしくは数値文字列型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isNumeric: function (val) {
        val = +val;
        
        return ! (isNaN(val) || val === -Infinity || val === Infinity);
    },

    /**
     * 整数値型もしくは整数値文字列型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isDigit: function (val) {
        return this.isInteger(+val);
    },
    
    /**
     * 16進数を表している文字列かどうかを返す<br />
     * 先頭に - があっても良く、0xはついて無くても良い(なお0xは代わりに#でも良い)
     * 
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isHexadecimalNumber: function (val) {
        if ( ! this.isString(val)) {
            return false;
        }
        
        if (val.match(/^-?(0x|#)?[0-9a-fA-F]+$/)) {
            return true;
        }

        return false;
    },

    /**
     * 基本型かどうかを返す(真偽値・数値・文字列値・null・undefined)
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isPrimitive: function (val) {
        return (this.isBoolean(val) || this.isNumber(val) || this.isString(val) || this.isEmpty(val));
    },

    /**
     * HTML要素コレクション型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isElementCollection: function (val) {
        if ( ! this.isHash(val)) {
            return false;
        }
        
        var member = ['length', 'item', 'namedItem'];

        for (var i = 0, l = member.length; i < l; i++) {
            if ( ! (member[i] in val)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Nodeリスト型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isNodeList: function (val) {
        if ( ! this.isHash(val)) {
            return false;
        }
        
        var member = ['length', 'item'];

        for (var i = 0, l = member.length; i < l; i++) {
            if ( ! (member[i] in val)) {
                return false;
            }
        }

        return true;
    },
    
    /**
     * Element型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isElement: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.ELEMENT_NODE);
    },
    
    /**
     * Attribute型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isAttribute: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.ATTRIBUTE_NODE);
    },

    /**
     * Text型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isText: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.TEXT_NODE);
    },
    
    /**
     * CDATASection型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isCDATASection: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.CDATA_SECTION_NODE);
    },
    
    /**
     * EntityReference型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isEntityReference: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.ENTITY_REFERENCE_NODE);
    },
    
    /**
     * Entity型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isEntity: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.ENTITY_NODE);
    },
    
    /**
     * ProcessingInstruction型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isProcessingInstruction: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.PROCESSING_INSTRUCTION_NODE);
    },

    /**
     * Comment型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isComment: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.COMMENT_NODE);
    },

    /**
     * Document型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isDocument: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.DOCUMENT_NODE);
    },
    
    /**
     * DocumentType型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isDocumentType: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.DOCUMENT_TYPE_NODE);
    },
    
    /**
     * DocumentFragment型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isDocumentFragment: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.DOCUMENT_FRAGMENT_NODE);
    },
    
    /**
     * Notation型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isNotation: function (val) {
        return !!(val && val.nodeType === Jeeel.Dom.Node.NOTATION_NODE);
    },

    /**
     * Window型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isWindow: function (val) {
        if (typeof val !== 'object' || ! val) {
            return false;
        }
        
        var member = ['Object', 'Array', 'String', 'Number', 'Boolean', 'Function'];

        for (var i = 0, l = member.length; i < l; i++) {
            if ( ! (member[i] in val)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Event型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isEvent: function (val) {
        if (typeof val !== 'object' || ! val) {
            return false;
        }
        
        var member;
        
        if ('reason' in val) {
            member = ['type', 'keyCode', 'shiftKey', 'ctrlKey', 'altKey', 'srcElement', 'reason'];
        } else {
            member = ['type', 'target', 'currentTarget'];
        }

        for (var i = member.length; i--;) {
            if ( ! (member[i] in val)) {
                return false;
            }
        }

        return true;
    },

    /**
     * Error型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isError: function (val) {
        return (val instanceof Error) || (typeof DOMException !== "undefined" && val instanceof DOMException);
    },

    /**
     * Arguments型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isArguments: function (val) {
        if (typeof val !== 'object' || ! val) {
            return false;
        }
        
        var member = ['callee', 'length'];

        for (var i = 0, l = member.length; i < l; i++) {
            if ( ! (member[i] in val)) {
                return false;
            }
        }

        return true;
    },
    
    /**
     * Math型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isMath: function (val) {
        return (Object.prototype.toString.call(val) === "[object Math]");
    },
    
    /**
     * JSON型かどうかを返す(Json文字列とは違う)
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isJSON: function (val) {
        return (Object.prototype.toString.call(val) === "[object JSON]");
    },

    /**
     * Storage型かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isStorage: function (val) {
        if (typeof val !== 'object' || ! val) {
            return false;
        }
        
        var member = ['key', 'getItem', 'setItem', 'removeItem', 'clear'];

        for (var i = 0, l = member.length; i < l; i++) {
            if ( ! (member[i] in val)) {
                return false;
            }
        }

        return true;
    },

    /**
     * nullかどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isNull: function (val) {
        return (val === null);
    },

    /**
     * 未定義かどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isUndefined: function (val) {
        return (typeof val === 'undefined');
    },

    /**
     * 空変数かどうかを返す(nullまたはundefined)
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isEmpty: function (val) {
        return (this.isNull(val) || this.isUndefined(val));
    },

    /**
     * 変数がセットされているかかどうかを返す(undefinedでない)
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isSet: function (val) {
        return (typeof val !== 'undefined');
    },

    /**
     * 指定した値が配列式型の中に存在するかどうかを返す
     *
     * @param {Mixied} val 判定値
     * @param {Hash} array 配列式型
     * @param {Boolean} [strict] 厳密に型のチェックをするかどうか
     * @return {Boolean} 判定結果
     * @throws {Error} arrayが配列式でない場合に起こる
     */
    inArray: function (val, array, strict) {
        var check = false;
        
        Jeeel.Hash.forEach(array,
            function (elm) {
                if (( ! strict && val == elm) || (strict && val === elm)) {
                    check = true;
                    return Jeeel.Hash.FOR_EACH_EXIT;
                }
            }
        );

        return check;
    },

    /**
     * 変数が配列式型で更に空であるかどうかを返す
     *
     * @param {Mixied} val 判定値
     * @return {Boolean} 判定結果
     */
    isEmptyHash: function (val) {
        if ( ! this.isHash(val)) {
            return false;
        }

        var check = true;

        Jeeel.Hash.forEach(val,
            function () {
                check = false;
                return Jeeel.Hash.FOR_EACH_EXIT;
            }
        );

        return check;
    },

    /**
     * 指定したキーが配列式型に存在するかどうかを返す
     *
     * @param {String|Integer} key 判定値
     * @param {Hash} array 配列式型
     * @return {Boolean} 判定結果
     * @throws {TypeError} arrayが配列式でない場合に起こる
     */
    keyExists: function (key, array) {
        return key in array;
    }
};

Jeeel.file.Jeeel.Type = ['ObjectType', 'ObjectKeys'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Type, Jeeel.file.Jeeel.Type);
