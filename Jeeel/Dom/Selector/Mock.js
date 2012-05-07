
/**
 * コンストラクタ
 * 
 * @class 疑似クラスを扱うクラス
 * @param {Jeeel.Dom.Selector.Node} 親ノード
 * @param {String} selector セレクタ
 */
Jeeel.Dom.Selector.Mock = function (node, selector) {
    this.node = node;
    this.selector = selector;
};

/**
 * @namespace 疑似クラスのロジックを保有するネームスペース
 */
Jeeel.Dom.Selector.Mock.LOGIC = {
  
    /**
     * 否定疑似クラスを解析するロジック(:not)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    not: function (args) {
        var node = Jeeel.Dom.Selector.Compiler.compileNode(args);
        
        return {
            isMatch: function (element) {
                return ! node.isMatch(element);
            },
            
            filter: function (elements) {
                var matches = node.filter(elements);
                var res = [];
                
                for (var i = 0, l = elements.length; i < l; i++) {
                    
                    var element = elements[i];
                    var $continue = false;
                    
                    for (var j = matches.length; j--;) {
                        if (element === matches[j]) {
                            $continue = true;
                            break;
                        }
                    }
                    
                    if ($continue) {
                        continue;
                    }
                    
                    res.puh(element);
                }
                
                return res;
            }
        };
    },
    
    /**
     * :link疑似クラスを解析するロジック(:link)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    link: function (args) {
        return {
            isMatch: function (element) {
                return element.nodeName.toUpperCase() === 'A';
            }
        };
    },
    
    /**
     * :visited疑似クラスを解析するロジック(:visited)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    visited: function (args) {
        return {
            isMatch: Jeeel.Function.Template.RETURN_FALSE
        };
    },
    
    /**
     * :hover疑似クラスを解析するロジック(:hover)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    hover: function (args) {
        return {
            isMatch: Jeeel.Function.Template.RETURN_FALSE
        };
    },
    
    /**
     * :active疑似クラスを解析するロジック(:active)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    active: function (args) {
        return {
            isMatch: Jeeel.Function.Template.RETURN_FALSE
        };
    },
    
    /**
     * :first-line疑似クラスを解析するロジック(:first-line)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    firstLine: function (args) {
        return {};
    },
    
    /**
     * :first-letter疑似クラスを解析するロジック(:first-letter)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    firstLetter: function (args) {
        return {};
    },
    
    /**
     * ターゲット疑似クラスを解析するロジック(:target)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    target: function (args) {
        return {
            isMatch: function (element) {
                var fragment = Jeeel.UserAgent.getFragment();
                
                if (element.id === fragment) {
                    return element;
                }
                
                return element.nodeName.toUpperCase() === 'A' && element.name === fragment;
            }
        };
    },
    
    /**
     * :focus疑似クラスを解析するロジック(:focus)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    focus: function (args) {
        return {
            isMatch: Jeeel.Function.Template.RETURN_FALSE
        };
    },
    
    /**
     * 言語疑似クラスを解析するロジック(:lang)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    lang: function (args) {
        return {
            isMatch: function (element) {
                return element.lang === args;
            }
        };
    },
    
    /**
     * :first-child疑似クラスを解析するロジック(:first-child)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    firstChild: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type) {
                        return false;
                    }
                    
                    p = p.previousSibling;
                }
                
                return true;
            }
        };
    },
    
    /**
     * :last-child疑似クラスを解析するロジック(:last-child)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    lastChild: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type) {
                        return false;
                    }
                    
                    n = n.nextSibling;
                }
                
                return true;
            }
        };
    },
    
    /**
     * :before疑似クラスを解析するロジック(:before)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    before: function (args) {
        return {};
    },
    
    /**
     * :after疑似クラスを解析するロジック(:after)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    after: function (args) {
        return {};
    },
    
    /**
     * :root疑似クラスを解析するロジック(:root)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    root: function (args) {
        return {
            isMatch: function (element) {
                return element.ownerDocument.documentElement === element;
            }
        };
    },
    
    /**
     * :nth-child疑似クラスを解析するロジック(:nth-child)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthChild: function (args) {
        var val = +args;
        
        var filter, isNth;
        
        if (val) {
            filter = function (elements) {
                return elements[val] && [elements[val]] || [];
            };
        } else if (args === 'odd') {
            filter = function (elements) {
                
                var res = [];
                
                for (var i = 0, l = elements.length; i < l; i++) {
                    if (i & 1) {
                        res[res.length] = elements[i];
                    }
                }
                
                return res;
            };
        } else if (args === 'even') {
            filter = function (elements) {
                
                var res = [];
                
                for (var i = 0, l = elements.length; i < l; i++) {
                    if ( ! (i & 1)) {
                        res[res.length] = elements[i];
                    }
                }
                
                return res;
            };
        } else {
            isNth = new Function('n', 'return n % (' + args.replace(/([0-9]+)n/g, '$1*n') + ') === 0;');
            
            filter = function (elements) {
                
                var res = [];
                
                for (var i = 0, l = elements.length; i <l; i++) {
                    if (isNth(i)) {
                        res[res.length] = elements[i];
                    }
                }
                
                return res;
            };
        }
        
        return {
            filter: filter
        };
    },
    
    /**
     * :nth-last-child疑似クラスを解析するロジック(:nth-last-child)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthLastChild: function (args) {
        var val = +args;
        
        var filter, isNth;
        
        if (val) {
            filter = function (elements) {
                return elements[elements.length - val - 1] && [elements[elements.length - val - 1]] || [];
            };
        } else if (args === 'odd') {
            filter = function (elements) {
                
                var res = [], lidx = elements.length - 1;
                
                for (var i = 0, l = elements.length; i < l; i++) {
                    if ((lidx - i) & 1) {
                        res[res.length] = elements[i];
                    }
                }
                
                return res;
            };
        } else if (args === 'even') {
            filter = function (elements) {
                
                var res = [], lidx = elements.length - 1;
                
                for (var i = 0, l = elements.length; i < l; i++) {
                    if ( ! ((lidx - i) & 1)) {
                        res[res.length] = elements[i];
                    }
                }
                
                return res;
            };
        } else {
            isNth = new Function('n', 'return n % (' + args.replace(/([0-9]+)n/g, '$1*n') + ') === 0;');
            
            filter = function (elements) {
                
                var res = [], lidx = elements.length - 1;
                
                for (var i = 0, l = elements.length; i <l; i++) {
                    if (isNth(lidx - i)) {
                        res[res.length] = elements[i];
                    }
                }
                
                return res;
            };
        }
        
        return {
            filter: filter
        };
    },
    
    /**
     * :first-of-type疑似クラスを解析するロジック(:first-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    firstOfType: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type && this.node.isMatch(p)) {
                        this.isMatch = isMatch;
                        return false;
                    }
                    
                    p = p.previousSibling;
                }
                
                this.isMatch = isMatch;
                
                return true;
            }
        };
    },
    
    /**
     * :last-of-type疑似クラスを解析するロジック(:last-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    lastOfType: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type && this.node.isMatch(n)) {
                        this.isMatch = isMatch;
                        return false;
                    }
                    
                    n = n.nextSibling;
                }
                
                this.isMatch = isMatch;
                
                return true;
            }
        };
    },
    
    /**
     * :nth-of-type疑似クラスを解析するロジック(:nth-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthOfType: function (args) {
        var val = +args;
        
        var isMatch, isNth;
        
        if (val) {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                  
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type && this.node.isMatch(p)) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }
                
                this.isMatch = isMatch;
                
                return val === cnt;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type && this.node.isMatch(p)) {
                        cnt++;
                    }

                    p = p.previousSibling;
                }
                
                this.isMatch = isMatch;
                
                return !!(cnt & 1);
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                  
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type && this.node.isMatch(p)) {
                        cnt++;
                    }

                    p = p.previousSibling;
                }
                
                this.isMatch = isMatch;
                
                return !(cnt & 1);
            };
        } else {
            isNth = new Function('i,n', 'return (i === ' + args.replace(/([0-9]+)n/g, '$1*n') + ') || (i > ' + args.replace(/([0-9]+)n/g, '$1*n') + ' ? arguments.callee(i, n + 1) : false);');
            
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                  
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type && this.node.isMatch(p)) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }
                
                this.isMatch = isMatch;
                
                return isNth(cnt, 0);
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
    /**
     * :nth-last-of-type疑似クラスを解析するロジック(:nth-last-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthLastOfType: function (args) {
        var val = +args;
        
        var isMatch, isNth;
        
        if (val) {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type && this.node.isMatch(n)) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                this.isMatch = isMatch;
                
                return val === cnt;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type && this.node.isMatch(n)) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                this.isMatch = isMatch;
                
                return !!(cnt & 1);
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type && this.node.isMatch(n)) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                this.isMatch = isMatch;
                
                return !(cnt & 1);
            };
        } else {
            isNth = new Function('i,n', 'return (i === ' + args.replace(/([0-9]+)n/g, '$1*n') + ') || (i > ' + args.replace(/([0-9]+)n/g, '$1*n') + ' ? arguments.callee(i, n + 1) : false);');
            
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type && this.node.isMatch(n)) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                this.isMatch = isMatch;
                
                return isNth(cnt, 0);
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
    /**
     * :only-child疑似クラスを解析するロジック(:only-child)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    onlyChild: function (args) {
        return {
            isMatch: function (element) {
                
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 0;
                  
                var n = element.parentNode.firstChild.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                return cnt === 1;
            }
        };
    },
    
    /**
     * :only-of-type疑似クラスを解析するロジック(:only-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    onlyOfType: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var isMatch = this.isMatch;
                this.isMatch = Jeeel.Function.Template.RETURN_TRUE;
                
                var n = element.parentNode.firstChild;
                  
                while (n) {
                    if (n.nodeType === type && n !== element && this.node.isMatch(n)) {
                        this.isMatch = isMatch;
                        return false;
                    }
                    
                    n = n.nextSibling;
                }
                
                this.isMatch = isMatch;
                
                return true;
            }
        };
    },
    
    /**
     * :empty疑似クラスを解析するロジック(:empty)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    empty: function (args) {
        return {
            isMatch: function (element) {
                return element.childNodes.length === 0;
            }
        };
    },
    
    /**
     * :enabled疑似クラスを解析するロジック(:enabled)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    enabled: function (args) {
        return {
            isMatch: function (element) {
                return ! element.disabled;
            }
        };
    },
    
    /**
     * :disabled疑似クラスを解析するロジック(:disabled)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    disabled: function (args) {
        return {
            isMatch: function (element) {
                return element.disabled;
            }
        };
    },
    
    /**
     * :checked疑似クラスを解析するロジック(:checked)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    checked: function (args) {
        return {
            isMatch: function (element) {
                return element.checked;
            }
        };
    }
};

Jeeel.Dom.Selector.Mock.prototype = {
  
    /**
     * 疑似クラスセレクタ
     * 
     * @type String
     */
    selector: '',
    
    /**
     * 親ノード
     * 
     * @type Jeeel.Dom.Selector.Node
     */
    node: null,
    
    /**
     * 疑似クラスの名前
     * 
     * @type String
     */
    name: '',
    
    /**
     * 疑似クラスの引数
     * 
     * @type String
     */
    args: '',
    
    /**
     * 指定した要素がセレクタと一致するかどうか返す
     * 
     * @param {Element} element 調べる要素
     * @return {Boolean} 一致したかどうか
     */
    isMatch: function (element) {
        return true;
    },
    
    /**
     * 指定した要素リストをフィルタリングする
     * 
     * @param {Element[]} elements 要素リスト
     * @return {Element[]} フィルタリング後の要素リスト
     */
    filter: function (elements) {
        return elements;
    },
    
    /**
     * 現在の情報を元にロジックを構築する
     * 
     * @return {Jeeel.Dom.Selector.Mock} 自インスタンス
     */
    compile: function () {
        
        var type = Jeeel.String.toCamelCase(this.name);
        var tmp = this.constructor.LOGIC[type] && this.constructor.LOGIC[type](this.args);
        
        if ( ! tmp) {
            return this;
        }

        if (tmp.isMatch) {
            this.isMatch = tmp.isMatch;
        }
        
        if (tmp.filter) {
            this.filter = tmp.filter;
        }
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Dom.Selector.Mock
};