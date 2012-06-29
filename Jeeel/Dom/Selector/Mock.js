
/**
 * コンストラクタ
 * 
 * @class 擬似クラスと擬似要素を扱うクラス
 * @param {Jeeel.Dom.Selector.Node} node 親ノード
 * @param {String} selector セレクタ
 */
Jeeel.Dom.Selector.Mock = function (node, selector) {
    this.node = node;
    this.selector = selector;
};

/**
 * @namespace 擬似クラスのロジックを保有するネームスペース
 */
Jeeel.Dom.Selector.Mock.LOGIC = {
  
    /**
     * 否定擬似クラスを解析するロジック(:not)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    not: function (args) {
        return {
            isMatch: function (element) {
                for (var i = this._nodes.length; i--;) {
                    if (this._nodes[i].isMatch(element)) {
                        return false;
                    }
                }
                
                return true;
            },
            
            _nodes: Jeeel.Dom.Selector.Compiler.compileNodes(args)
        };
    },
    
    /**
     * :matches擬似クラスを解析するロジック(:matches)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    matches: function (args) {
        return {
            isMatch: function (element) {
                for (var i = this._nodes.length; i--;) {
                    if (this._nodes[i].isMatch(element)) {
                        return true;
                    }
                }
                
                return false;
            },
            
            _nodes: Jeeel.Dom.Selector.Compiler.compileNodes(args)
        };
    },
    
    /**
     * 言語擬似クラスを解析するロジック(:dir)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    dir: function (args) {
        if (args) {
            args = args.toLowerCase();
        }
        
        return {
            isMatch: (args ? function (element) {
                while(element) {
                    
                    if (element.dir) {
                        return element.dir.toLowerCase() === args;
                    }
                    
                    element = element.parentNode;
                }
                
                return false;
            } : Jeeel.Function.Template.RETURN_FALSE)
        };
    },
    
    /**
     * 言語擬似クラスを解析するロジック(:lang)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    lang: function (args) {
      
        if (args) {
            args = new RegExp('^' + args.toLowerCase() + '(?:-|$)', 'i');
        }
        
        return {
            isMatch: (args ? function (element) {
                while(element) {
                    
                    if (element.lang) {
                        return !!element.lang.match(args);
                    }
                    
                    element = element.parentNode;
                }
                
                return false;
            } : Jeeel.Function.Template.RETURN_FALSE)
        };
    },
    
    /**
     * :any-link擬似クラスを解析するロジック(:any-link)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    anyLink: function (args) {
        return {
            isMatch: function (element) {
                return element.nodeName.toUpperCase() === 'A' && !!element.href;
            }
        };
    },
    
    /**
     * :link擬似クラスを解析するロジック(:link)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    link: function (args) {
        return {
            isMatch: function (element) {
                return element.nodeName.toUpperCase() === 'A' && !!element.href;
            }
        };
    },
    
    /**
     * :visited擬似クラスを解析するロジック(:visited)
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
     * :local-link擬似クラスを解析するロジック(:local-link)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    localLink: function (args) {
        
        var limitHierarchy = false;
        
        if (args) {
            args = +args;
            
            limitHierarchy = ! isNaN(args);
            
            args++;
        }
        
        return {
            isMatch: (limitHierarchy ? function (element) { 
                var baseUrl = Jeeel.String.escapeRegExp(Jeeel.UserAgent.getBaseUrl());
                
                return element.nodeName.toUpperCase() === 'A' && element.href.match(new RegExp('^' + baseUrl + '(?:\\/[^\\/]*){' + args + '}$'));
            } : function (element) {
                var baseUrl = Jeeel.String.escapeRegExp(Jeeel.UserAgent.getBaseUrl());
                
                return element.nodeName.toUpperCase() === 'A' && element.href.match(new RegExp('^' + baseUrl));
            })
        };
    },
    
    /**
     * ターゲット擬似クラスを解析するロジック(:target)
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
     * :scope擬似クラスを解析するロジック(:scope)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    scope: function (args) {
        return {};
    },
    
    /**
     * :active擬似クラスを解析するロジック(:active)
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
     * :hover擬似クラスを解析するロジック(:hover)
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
     * :focus擬似クラスを解析するロジック(:focus)
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
     * :enabled擬似クラスを解析するロジック(:enabled)
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
     * :disabled擬似クラスを解析するロジック(:disabled)
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
     * :checked擬似クラスを解析するロジック(:checked)
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
    },
    
    /**
     * :indeterminate擬似クラスを解析するロジック(:indeterminate)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    indeterminate: function (args) {
        return {
            isMatch: function (element) {
                return element.nodeName.toUpperCase() === 'INPUT' && element.type && element.type.toLowerCase() === 'checkbox' && element.indeterminate;
            }
        };
    },
    
    /**
     * :required擬似クラスを解析するロジック(:required)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    required: function (args) {
        return {
            isMatch: function (element) {
                return element.required;
            }
        };
    },
    
    /**
     * :optional擬似クラスを解析するロジック(:optional)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    optional: function (args) {
        return {
            isMatch: function (element) {
                return 'required' in element && !element.required;
            }
        };
    },
    
    /**
     * :read-only擬似クラスを解析するロジック(:read-only)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    readOnly: function (args) {
        return {
            isMatch: function (element) {
                
                if (element.contentEditable === 'true') {
                    return false;
                }
                
                var e = element;
                
                while (e.contentEditable === 'inherit') {

                    e = e.parentNode;
                    
                    if (e.contentEditable === 'true') {
                        return false;
                    }
                }
                
                return element.readOnly;
            }
        };
    },
    
    /**
     * :read-write擬似クラスを解析するロジック(:read-write)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    readWrite: function (args) {
        return {
            isMatch: function (element) {
                
                if (element.contentEditable === 'true') {
                    return true;
                }
                
                var e = element;
                
                while (e.contentEditable === 'inherit') {

                    e = e.parentNode;
                    
                    if (e.contentEditable === 'true') {
                        return true;
                    }
                }
                
                return 'readOnly' in element && ! element.readOnly;
            }
        };
    },
    
    /**
     * :root擬似クラスを解析するロジック(:root)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    root: function (args) {
        return {
            isMatch: function (element) {
                return element.ownerDocument.documentElement === element;
            },
            
            isOnlyMock: true
        };
    },
    
    /**
     * :empty擬似クラスを解析するロジック(:empty)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    empty: function (args) {
        return {
            isMatch: function (element) {
                
                var type1 = Jeeel.Dom.Node.ELEMENT_NODE;
                var type2 = Jeeel.Dom.Node.TEXT_NODE;
                var child = element.firstChild;
                
                while (child) {
                    if (child.nodeType === type1 || child.nodeType === type2) {
                        return false;
                    }
                    
                    child = child.nextSibling;
                }
                
                return true;
            }
        };
    },
    
    /**
     * :first-child擬似クラスを解析するロジック(:first-child)
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
     * :nth-child擬似クラスを解析するロジック(:nth-child)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthChild: function (args) {
        var val = +args;
        
        var isMatch, isNth;
        
        if (val) {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }

                return val === cnt;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }

                return !!(cnt & 1);
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }

                return !(cnt & 1);
            };
        } else {
            isNth = this._getNth(args);
            
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var p = element.previousSibling;
                  
                while (p) {
                    if (p.nodeType === type) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }

                return isNth(cnt);
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
    /**
     * :last-child擬似クラスを解析するロジック(:last-child)
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
     * :nth-last-child擬似クラスを解析するロジック(:nth-last-child)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthLastChild: function (args) {
        var val = +args;
        
        var isMatch, isNth;
        
        if (val) {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }

                return val === cnt;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }

                return !!(cnt & 1);
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }

                return !(cnt & 1);
            };
        } else {
            isNth = this._getNth(args);
            
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                var cnt = 1;
                  
                var n = element.nextSibling;
                  
                while (n) {
                    if (n.nodeType === type) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }

                return isNth(cnt);
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
    /**
     * :only-child擬似クラスを解析するロジック(:only-child)
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
     * :first-of-type擬似クラスを解析するロジック(:first-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    firstOfType: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                
                var p = element.previousSibling;
                
                while (p) {
                    if (p.nodeType === type && p.nodeName === nodeName) {
                        return false;
                    }
                    
                    p = p.previousSibling;
                }
                
                return true;
            }
        };
    },
    
    /**
     * :nth-of-type擬似クラスを解析するロジック(:nth-of-type)
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
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var p = element.previousSibling;
                
                while (p) {
                    if (p.nodeType === type && p.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }
                
                return cnt === val;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var p = element.previousSibling;
                
                while (p) {
                    if (p.nodeType === type && p.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }
                
                return !!(cnt & 1);
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var p = element.previousSibling;
                
                while (p) {
                    if (p.nodeType === type && p.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }
                
                return !(cnt & 1);
            };
        } else {
            isNth = this._getNth(args);
            
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var p = element.previousSibling;
                
                while (p) {
                    if (p.nodeType === type && p.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    p = p.previousSibling;
                }
                
                return isNth(cnt);
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
    /**
     * :last-of-type擬似クラスを解析するロジック(:last-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    lastOfType: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                
                var n = element.nextSibling;
                
                while (n) {
                    if (n.nodeType === type && n.nodeName === nodeName) {
                        return false;
                    }
                    
                    n = n.nextSibling;
                }
                
                return true;
            }
        };
    },
    
    /**
     * :nth-last-of-type擬似クラスを解析するロジック(:nth-last-of-type)
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
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var n = element.nextSibling;
                
                while (n) {
                    if (n.nodeType === type && n.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                return cnt === val;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var n = element.nextSibling;
                
                while (n) {
                    if (n.nodeType === type && n.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                return !!(cnt & 1);
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var n = element.nextSibling;
                
                while (n) {
                    if (n.nodeType === type && n.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                return !(cnt & 1);
            };
        } else {
            isNth = this._getNth(args);
            
            isMatch = function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var cnt = 1;
                var n = element.nextSibling;
                
                while (n) {
                    if (n.nodeType === type && n.nodeName === nodeName) {
                        cnt++;
                    }
                    
                    n = n.nextSibling;
                }
                
                return isNth(cnt);
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
    /**
     * :only-of-type擬似クラスを解析するロジック(:only-of-type)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    onlyOfType: function (args) {
        return {
            isMatch: function (element) {
                var type = Jeeel.Dom.Node.ELEMENT_NODE;
                
                if (element.parentNode.nodeType !== type) {
                    return false;
                }
                
                var nodeName = element.nodeName;
                var n = element.nextSibling;
                var p = element.previousSibling;
                
                while (n || p) {
                    
                    if (n) {
                        if (n.nodeType === type && n.nodeName === nodeName) {
                            return false;
                        }

                        n = n.nextSibling;
                    }
                    
                    if (p) {
                        if (p.nodeType === type && p.nodeName === nodeName) {
                            return false;
                        }

                        p = p.previousSibling;
                    }
                }
                
                return true;
            }
        };
    },
    
    /**
     * :nth-match擬似クラスを解析するロジック(:nth-match)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     * @ignore 未完成
     */
    nthMatch: function (args) {
        
        var isNth, nodes;
        
        args = args.match(/^(odd|even|[0-9n+\-]+)\s+of\s+(.+)$/g);
        
        isNth = this._getNth(args[1]);
        nodes = Jeeel.Dom.Selector.Compiler.compileNodes(args[2]);
        
        if ( ! (args[1] && args[2])) {
            throw new Error('Selector compile error.');
        }
        
        return {};
    },
    
    /**
     * :column擬似クラスを解析するロジック(:column)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    column: function (args) {
        var node = Jeeel.Dom.Selector.Compiler.compileNode(args);
        
        return {
            isMatch: function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                return node.isMatch(element);
            }
        };
    },
    
    /**
     * :nth-column擬似クラスを解析するロジック(:nth-column)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthColumn: function (args) {
        var val = +args;
        
        var isMatch, isNth;
        
        if (val) {
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element);
                
                for (var i = cols.length; i--;) {
                    if (cols[i] === val) {
                        return true;
                    }
                }
                
                return false;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element);
                
                for (var i = cols.length; i--;) {
                    if (cols[i] & 1) {
                        return true;
                    }
                }
                
                return false;
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element);
                
                for (var i = cols.length; i--;) {
                    if ( ! (cols[i] & 1)) {
                        return true;
                    }
                }
                
                return false;
            };
        } else {
            isNth = this._getNth(args);
            
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element);
                
                for (var i = cols.length; i--;) {
                    if (isNth(cols[i])) {
                        return true;
                    }
                }
                
                return false;
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
    /**
     * :nth-last-column擬似クラスを解析するロジック(:nth-last-column)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    nthLastColumn: function (args) {
        var val = +args;
        
        var isMatch, isNth;
        
        if (val) {
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element, true);
                
                for (var i = cols.length; i--;) {
                    if (cols[i] === val) {
                        return true;
                    }
                }
                
                return false;
            };
        } else if (args === 'odd') {
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element, true);
                
                for (var i = cols.length; i--;) {
                    if (cols[i] & 1) {
                        return true;
                    }
                }
                
                return false;
            };
        } else if (args === 'even') {
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element, true);
                
                for (var i = cols.length; i--;) {
                    if ( ! (cols[i] & 1)) {
                        return true;
                    }
                }
                
                return false;
            };
        } else {
            isNth = this._getNth(args);
            
            isMatch = function (element) {
                var name = element.nodeName.toUpperCase();
                
                if ( ! (name === 'TD' || name === 'TH')) {
                    return false;
                }
                
                var cols = Jeeel._Object.JeeelDomSelector.getSameCellCols(element, true);
                
                for (var i = cols.length; i--;) {
                    if (isNth(cols[i])) {
                        return true;
                    }
                }
                
                return false;
            };
        }
        
        return {
            isMatch: isMatch
        };
    },
    
   /**
     * ::first-line擬似要素を解析するロジック(::first-line)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    firstLine: function (args) {
        return {};
    },
    
    /**
     * ::first-letter擬似要素を解析するロジック(::first-letter)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    firstLetter: function (args) {
        return {};
    },
    
    /**
     * ::before擬似要素を解析するロジック(::before)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    before: function (args) {
        return {};
    },
    
    /**
     * ::after擬似要素を解析するロジック(::after)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    after: function (args) {
        return {};
    },
    
    /**
     * カスタム擬似クラス、非表示要素に適用(:-jeeel-hidden)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    JeeelHidden: function (args) {
        return {
            isMatch: function (element) {
                
                if (element.nodeName.toUpperCase() === 'INPUT' && element.type === 'hidden') {
                    return true;
                }
                
                var style = Jeeel.Document.getComputedStyle(element);
                
                return style.display === 'none' || style.visibility === 'hidden';
            }
        };
    },
    
    /**
     * カスタム擬似クラス、表示要素に適用(:-jeeel-visible)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    JeeelVisible: function (args) {
        return {
            isMatch: function (element) {
                
                if (element.nodeName.toUpperCase() === 'INPUT' && element.type === 'hidden') {
                    return false;
                }
                
                var style = Jeeel.Document.getComputedStyle(element);
                
                return style.display !== 'none' && style.visibility !== 'hidden';
            }
        };
    },
    
    /**
     * カスタム擬似クラス、アニメーション中の要素に適用(:-jeeel-animated)
     * 
     * @param {String} args 引数
     * @return {Hash} ロジック構成要素
     */
    JeeelAnimated: function (args) {
        return {
            isMatch: function (element) {
                return Jeeel.Hash.inHash(element, Jeeel.Dom.Style.Animation.animated, true);
            }
        };
    },
    
    /**
     * nth系の引数部分を解析する関数を取得する
     * 
     * @param {String} nth 引数
     * @return {Function} 引数解析関数
     */
    _getNth: function (nth) {
        
        if (nth === 'odd') {
            return new Function('i',
                'return !!(i & 1);'
            );
        } else if (nth === 'even') {
            return new Function('i',
                'return !(i & 1);'
            );
        } else if (nth.match(/^[0-9]+$/g)) {
            return new Function('i',
                'return i === ' + nth + ';'
            );
        }
        
        var minus = !!nth.match(/-[0-9]*n/g);
        
        return new Function('i,n,pnth', 
            'if ( ! n) {n = 0;}var nth = ' + nth.replace(/(-?[0-9]+)n/g, '$1*n') + ';if (nth === pnth) {return false;}return (i === nth) || (' + (minus ? 'i < nth' : 'i > nth') + ' ? arguments.callee(i, n + 1, nth) : false);'
        );
    }
};

Jeeel.Dom.Selector.Mock.prototype = {
  
    /**
     * 擬似クラスセレクタ
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
     * 擬似クラスの名前
     * 
     * @type String
     */
    name: '',
    
    /**
     * 擬似クラスの引数
     * 
     * @type String
     */
    args: '',
    
    /**
     * 1つの要素にしかヒットしかないかどうか
     * 
     * @type Boolean
     */
    isOnlyMock: false,
    
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
        
        for (var key in tmp) {
            this[key] = tmp[key];
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