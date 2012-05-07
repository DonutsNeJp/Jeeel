
/**
 * コンストラクタ
 * 
 * @class 指定した要素内の検索を行うクラス
 * @param {Node} target 検索対象ノード
 */
Jeeel.Dom.Core.Searcher = function (target) {
    if ( ! target || ! target.nodeType) {
        return null;
    }
    
    this._target = target;
    this._init();
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Node} target 検索対象ノード
 * @return {Jeeel.Dom.Core.Searcher} 作成したインスタンス
 */
Jeeel.Dom.Core.Searcher.create = function (target) {
    return new this(target);
};

Jeeel.Dom.Core.Searcher.caches = {};

Jeeel.Dom.Core.Searcher.prototype = {
  
    /**
     * 検索対象要素
     * 
     * @type Node
     * @private
     */
    _target: null,
    
    /**
     * このElement内から指定IDのHTML要素を取得する
     *
     * @param {String} id 検索ID
     * @return {Element} 取得したElement
     */
    getElementById: function (id) {
        return this._target.getElementById(id) || null;
    },
    
    /**
     * このElement内から指定ClassのHTML要素を取得する
     *
     * @param {String|String[]} className 検索Class
     * @return {Element[]} 取得したElement配列
     */
    getElementsByClassName: function (className) {

        if (Jeeel.Type.isArray(className)) {
            return this.searchElementsByClassName(className);
        }
      
        var res = this._target.getElementsByClassName(className);
        
        return Jeeel.Hash.toArray(res);
    },
    
    /**
     * このElement内から指定NameのHTML要素を取得する
     * なおsubmitSearchを指定すると<br />
     * この動作は一部本来のgetElementsByNameと違い、<br />
     * c[]等で配列指定した値に対してもヒットする
     *
     * @param {String|String[]} name 検索Name
     * @param {Boolean} [submitSearch=false] 送信時と同じようにc[]等の配列指定をヒットさせるかどうか
     * @return {Element[]} 取得したElement配列
     */
    getElementsByName: function (name, submitSearch) {
        
        if (Jeeel.Type.isArray(name) || submitSearch) {
            return this.searchElementsByName(name, submitSearch);
        }
        
        var res = this._target.getElementsByName(name);
        
        return Jeeel.Hash.toArray(res);
    },
    
    /**
     * このElement内から指定TagのHTML要素を取得する
     *
     * @param {String|String[]} tagName 検索Tag
     * @return {Element[]} 取得したElement配列
     */
    getElementsByTagName: function (tagName) {
      
        if (Jeeel.Type.isArray(tagName)) {
            return this.searchElementsByTagName(tagName);
        }
      
        var res = this._target.getElementsByTagName(tagName);
        
        return Jeeel.Hash.toArray(res);
    },
    
    /**
     * このElement内から指定属性が指定値のHTML要素を取得する
     *
     * @param {String} attribute 属性名
     * @param {String} value 属性値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    getElementsByAttribute: function (attribute, value) {
        var res = this._target.getElementsByAttribute(attribute, value);
        
        return Jeeel.Hash.toArray(res);
    },
    
    /**
     * このElement内から指定プロパティが指定値のHTML要素を取得する<br />
     * Elementのプロパティである事に注意
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value プロパティ値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    getElementsByProperty: function (property, value) {
        var res = this._target.getElementsByProperty(property, value);
        
        return Jeeel.Hash.toArray(res);
    },
    
    /**
     * このElement内部に絞り込みを掛ける<br />
     * 現在のHTML内に存在しない要素は取れない
     *
     * @param {String} selector CSSと同じ絞り込みセレクタ
     * @return {Element[]} 絞り込んだElement配列
     */
    getElementsBySelector: function (selector) {
        var res = this._target.querySelectorAll(selector);
        
        return Jeeel.Hash.toArray(res);
    },
    
    /**
     * このElement内から指定IDのHTML要素を取得する<br />
     * この際既存のAPIに頼らずに検索を実行する
     *
     * @param {String} id 検索ID
     * @return {Element} 取得したElement
     */
    searchElementById: function (id) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        
        /**
         * @ignore
         */
        var search = function (elm, id, f) {
            if ( ! f && elm.id === id) {
                return elm;
            }
            
            var tmp, child = elm.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    tmp = search(child, id);

                    if (tmp) {
                        return tmp;
                    }
                }

                child = child.nextSibling;
            }

            return null;
        };
        
        /**
         * @ignore
         */
        this.searchElementById = function (id) {
            return id && search(this._target, id, true) || null;
        };
        
        if (arguments.callee === this.getElementById) {
            this.constructor.caches[this._target.nodeType].getElementById = this.getElementById = this.searchElementById;
        }
        
        return this.searchElementById(id);
    },
    
    /**
     * このElement内から指定ClassのHTML要素を取得する<br />
     * この際既存のAPIに頼らずに検索を実行する
     *
     * @param {String|String[]} className 検索Class
     * @return {Element[]} 取得したElement配列
     */
    searchElementsByClassName: function (className) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        
        /**
         * @ignore
         */
        var search = function (res, target, reg, f) {

            var className = target.className;
            
            if ( ! f && className.match && className.match(reg)) {
                res[res.length] = target;
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    search(res, child, reg);
                }

                child = child.nextSibling;
            }
        };
        
        /**
         * @ignore
         */
        this.searchElementsByClassName = function (className) {
            var res = [];
            
            if ( ! className) {
                return res;
            }
            
            var isArr = Jeeel.Type.isArray(className),
                reg;
            
            if (isArr) {
                
                if (className.length === 0) {
                    return res;
                }
                
                reg = new RegExp('(?:^| )' + className.join('|') + '(?: |$)', 'i');
            } else {
                
                reg = new RegExp('(?:^| )' + className + '(?: |$)', 'i');
            }

            search(res, this._target, reg, true);
            
            return res;
        };
        
        if (arguments.callee === this.getElementsByClassName) {
            this.constructor.caches[this._target.nodeType].getElementsByClassName = this.getElementsByClassName = this.searchElementsByClassName;
        }
        
        return this.searchElementsByClassName(className);
    },

    /**
     * このElement内から指定NameのHTML要素を取得する<br />
     * この際既存のAPIに頼らずに検索を実行する
     * なおsubmitSearchを指定すると<br />
     * この動作は一部本来のgetElementsByNameと違い、<br />
     * c[]等で配列指定した値に対してもヒットする
     *
     * @param {String|String[]} name 検索Name
     * @param {Boolean} [submitSearch=false] 送信時と同じようにc[]等の配列指定をヒットさせるかどうか
     * @return {Element[]} 取得したElement配列
     */
    searchElementsByName: function (name, submitSearch) {
        var rf = new Jeeel.Filter.String.RegularExpressionEscape();
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        
        /**
         * @ignore
         */
        var search = function (res, target, reg, s, f) {

            var name = target.name;
              
            if ( ! f && name) {
                if (s) {
                    if (name.match(reg)) {
                        res[res.length] = target;
                    }
                } else {
                    if (name === reg) {
                        res[res.length] = target;
                    }
                }
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    search(res, child, reg, s);
                }

                child = child.nextSibling;
            }
        };
        
        /**
         * @ignore
         */
        var multiSearch = function (res, target, regs, s, f) {

            var name = target.name;
              
            if ( ! f && name) {
                if (s) {
                    for (var i = regs.length; i--;) {
                        if (name.match(regs[i])) {
                            res[res.length] = target;
                            break;
                        }
                    }
                } else {
                    if (Jeeel.Type.inArray(name, regs, true)) {
                        res[res.length] = target;
                    }
                }
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    multiSearch(res, child, regs, s);
                }

                child = child.nextSibling;
            }
        };
        
        /**
         * @ignore
         */
        this.searchElementsByName = function (name, submitSearch) {
            var res = [];
            
            if ( ! name) {
                return res;
            }

            var isArr = Jeeel.Type.isArray(name),
                l = isArr && name.length;
            
            // 配列かどうかで検索手法を切り替える
            if (isArr && l === 0) {
                return res;
            } else if (isArr && name.length > 1) {
  
                if (submitSearch) {
                    while (l--) {
                        name[l] = new RegExp('^' + rf.filter(name[l]) + '(?:$|\\[)');
                    }
                }

                multiSearch(res, this._target, name, submitSearch, true);
            } else {
                if (isArr) {
                    name = name[0];
                }
                
                if (submitSearch) {
                    name = new RegExp('^' + rf.filter(name) + '(?:$|\\[)');
                }
                
                search(res, this._target, name, submitSearch, true);
            }
            
            return res;
        };
        
        if (arguments.callee === this.getElementsByName) {
            this.constructor.caches[this._target.nodeType].getElementsByName = this.getElementsByName = this.searchElementsByName;
        }
        
        return this.searchElementsByName(name, submitSearch);
    },

    /**
     * このElement内から指定TagのHTML要素を取得する<br />
     * この際既存のAPIに頼らずに検索を実行する
     *
     * @param {String|String[]} tagName 検索Tag
     * @return {Element[]} 取得したElement配列
     */
    searchElementsByTagName: function (tagName) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        
        /**
         * @ignore
         */
        var search = function (res, target, tag, f) {

            if ( ! f && (tag === '*' || target.nodeName.toUpperCase() === tag)) {
                res[res.length] = target;
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    search(res, child, tag);
                }

                child = child.nextSibling;
            }
        };
        
        /**
         * @ignore
         */
        var multiSearch = function (res, target, tags, f) {

            if ( ! f && Jeeel.Type.inArray(target.nodeName.toUpperCase(), tags, true)) {
                res[res.length] = target;
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    multiSearch(res, child, tags);
                }

                child = child.nextSibling;
            }
        };
        
        /**
         * @ignore
         */
        this.searchElementsByTagName = function (tagName) {
            var res = [];
            
            if ( ! tagName) {
                return res;
            }
            
            var isArr = Jeeel.Type.isArray(tagName),
                l = isArr && tagName.length;
            
            if (isArr && l === 0) {
                return res;
            } else if (isArr && l > 1) {
                if (Jeeel.Type.inArray('*', tagName, true)) {
                    search(res, this._target, '*', true);
                } else {
                    while (l--) {
                        tagName[l] = tagName[l].toUpperCase();
                    }
                    
                    multiSearch(res, this._target, tagName, true);
                }
            } else {
                if (isArr) {
                    tagName = tagName[0];
                }
                
                search(res, this._target, tagName.toUpperCase(), true);
            }

            return res;
        };
        
        if (arguments.callee === this.getElementsByTagName) {
            this.constructor.caches[this._target.nodeType].getElementsByTagName = this.getElementsByTagName = this.searchElementsByTagName;
        }
        
        return this.searchElementsByTagName(tagName);
    },

    /**
     * このElement内から指定属性が指定値のHTML要素を取得する<br />
     * この際既存のAPIに頼らずに検索を実行する
     *
     * @param {String} attribute 属性名
     * @param {String} value 属性値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    searchElementsByAttribute: function (attribute, value) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        
        /**
         * @ignore
         */
        var search = function (res, target, attr, value, f) {

            if ( ! f && target.getAttribute) {
                var val = target.getAttribute(attr);

                if ((val && value === '*') || val === value) {
                    res[res.length] = target;
                }
            }
 
            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    search(res, child, attr, value);
                }

                child = child.nextSibling;
            }
        };
        
        /**
         * @ignore
         */
        this.searchElementsByAttribute = function (attribute, value) {
            var res = [];
            
            if ( ! attribute) {
                return res;
            }
            
            search(res, this._target, attribute, value, true);
            
            return res;
        };
        
        if (arguments.callee === this.getElementsByAttribute) {
            this.constructor.caches[this._target.nodeType].getElementsByAttribute = this.getElementsByAttribute = this.searchElementsByAttribute;
        }
        
        return this.searchElementsByAttribute(attribute, value);
    },
    
    /**
     * このElement内から指定プロパティが指定値のHTML要素を取得する<br />
     * この際既存のAPIに頼らずに検索を実行する<br />
     * Elementのプロパティである事に注意
     *
     * @param {String} property プロパティ名
     * @param {Mixied} value プロパティ値('*'を指定すると任意の値の意味になる)
     * @return {Element[]} 取得したElement配列
     */
    searchElementsByProperty: function (property, value) {
        var nodeType = Jeeel.Dom.Node.ELEMENT_NODE;
        
        /**
         * @ignore
         */
        var search = function (res, target, prop, value, f) {

            if ( ! f && prop in target) {
                var val = target[prop];

                if (value === '*' || val == value) {
                    res[res.length] = target;
                }
            }

            var child = target.firstChild;

            while(child) {

                if (child.nodeType === nodeType) {
                    search(res, child, prop, value);
                }

                child = child.nextSibling;
            }
        };
        
        /**
         * @ignore
         */
        this.searchElementsByProperty = function (property, value) {
            var res = [];
            
            if ( ! property) {
                return res;
            }
            
            search(res, this._target, property, value, true);
            
            return res;
        };
        
        if (arguments.callee === this.getElementsByProperty) {
            this.constructor.caches[this._target.nodeType].getElementsByProperty = this.getElementsByProperty = this.searchElementsByProperty;
        }
        
        return this.searchElementsByProperty(property, value);
    },
    
    /**
     * このElement内部に絞り込みを掛ける<br />
     * この際既存のAPIに頼らずに検索を実行する<br />
     * 現在のHTML内に存在しない要素は取れない
     *
     * @param {String} selector CSSと同じ絞り込みセレクタ
     * @return {Element[]} 絞り込んだElement配列
     */
    searchElementsBySelector: function (selector) {
        /**
         * @ignore
         */
        this.searchElementsBySelector = function (selector) {
            if ( ! selector) {
                return [];
            }
            
            return Jeeel.Dom.Selector.create(selector).search(this._target);
        };
        
        if (arguments.callee === this.getElementsBySelector) {
            this.constructor.caches[this._target.nodeType].getElementsBySelector = this.getElementsBySelector = this.searchElementsBySelector;
        }
        
        return this.searchElementsBySelector(selector);
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Core.Searcher,
    
    /**
     * @ignore
     */
    _init: function () {
        
        var key, cache = this.constructor.caches[this._target.nodeType];
        
        if (cache) {
            
            for (key in cache) {
                this[key] = cache[key];
            }
            
            return;
        }
        
        if ( ! this._target.getElementById) {
            this.getElementById = this.searchElementById;
        }
        
        if ( ! this._target.getElementsByClassName) {
            this.getElementsByClassName = this.searchElementsByClassName;
        }
        
        if ( ! this._target.getElementsByName) {
            this.getElementsByName = this.searchElementsByName;
        }
        
        if ( ! this._target.getElementsByTagName) {
            this.getElementsByTagName = this.searchElementsByTagName;
        }

        if ( ! this._target.getElementsByAttribute) {
            this.getElementsByAttribute = this.searchElementsByAttribute;
        }
        
        if ( ! this._target.getElementsByProperty) {
            this.getElementsByProperty = this.searchElementsByProperty;
        }
        
        if ( ! this._target.querySelectorAll) {
            this.getElementsBySelector = this.searchElementsBySelector;
        }
        
        cache = {};
        
        for (key in this) {
            if (key !== 'constructor' && key.indexOf('_') < 0) {
                cache[key] = this[key];
            }
        }
        
        this.constructor.caches[this._target.nodeType] = cache;
    }
};