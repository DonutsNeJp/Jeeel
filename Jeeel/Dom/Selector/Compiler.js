
/**
 * @staticClass セレクタをコンパイルするためのクラス
 */
Jeeel.Dom.Selector.Compiler = {
    
    /**
     * セレクタのコンパイルを行う
     * 
     * @param {String} selector セレクタ
     * @return {Jeeel.Dom.Selector.NodeList[]} コンパイル結果
     */
    compile: function (selector) {
      
        // 余分なコメント、前後のスペースの削除
        selector = selector.replace(/\/\*[\s\S]*?\*\//g, '')
                           .replace(/^\s+/g, '')
                           .replace(/\s\s*$/g, '');
        
        var parenthesisCount = 0;
        var bracketCount = 0;
        var quote = null;
        var i, j, l, $continue, chr, bchr = null, filtered = [];
        
        var res = [];
        
        for (i = 0, l = selector.length; i < l; i++) {
            chr = selector.charAt(i);
            
            switch (chr) {
                case '[':
                    bracketCount++;
                    $continue = true;
                    break;
                    
                case ']':
                    bracketCount--;
                    $continue = true;
                    break;
                    
                case '(':
                    parenthesisCount++;
                    $continue = true;
                    break;
                    
                case ')':
                    parenthesisCount--;
                    $continue = true;
                    break;
                  
                case "'":
                case '"':
                    if ( ! quote) {
                        quote = chr;
                    } else if (quote === chr) {
                        quote = null;
                    }
                    $continue = true;
                    break;
                    
                default:
                    $continue = false;
                    break;
            }
            
            if ($continue) {
                bchr = chr;
                filtered.push(chr);
                continue;
            }
            
            switch (chr) {
                case ' ':
                    if (quote) {
                        filtered.push(chr);
                    } else if (bchr !== chr) {
                        
                        switch (bchr) {
                            case '+':
                            case '~':
                            case '>':
                            case '/':
                                break;
                            
                            default:
                                filtered.push(chr);
                                break;
                        }
                    }
                    break;
                
                case '+':
                case '~':
                case '>':
                case '/':
                    if ( ! quote && bchr === ' ') {
                        filtered.pop();
                    }
                    
                    filtered.push(chr);
                    break;
                    
                case ',':
                    if ( ! parenthesisCount && ! bracketCount && ! quote) {
                        j = 0;
                        
                        while (filtered[j] && filtered[j] === ' ') {
                            filtered[j++] = '';
                        }
                        
                        while (filtered[filtered.length - 1] === ' ') {
                            filtered.pop();
                        }
                        
                        res[res.length] = this.compileNodeList(filtered.join(''));
                        filtered = [];
                    } else {
                        filtered.push(chr);
                    }
                    break;

                default:
                    filtered.push(chr);
                    break;
            }
            
            bchr = chr;
        }
        
        if ( ! parenthesisCount && ! bracketCount && ! quote) {
            
            j = 0;
            
            while (filtered[j] && filtered[j] === ' ') {
                filtered[j++] = '';
            }
            
            while (filtered[filtered.length - 1] === ' ') {
                filtered.pop();
            }

            res[res.length] = this.compileNodeList(filtered.join(''));
        }
        
        return res;
    },
    
    /**
     * ノードリストのコンパイルを行う
     * 
     * @param {String} selector セレクタ
     * @return {Jeeel.Dom.Selector.NodeList} コンパイル結果
     */
    compileNodeList: function (selector) {
        
        if (Jeeel.Dom.Selector.NodeList.caches[selector]) {
            return Jeeel.Dom.Selector.NodeList.caches[selector];
        }
        
        var nodeList = new Jeeel.Dom.Selector.NodeList(selector);
        
        var parenthesisCount = 0;
        var bracketCount = 0;
        var quote = null;
        var i, l, ref, type = 'default', newType = null;
        var beforeIndex = -1;

        for (i = 0, l = selector.length; i < l; i++) {
            var chr = selector.charAt(i);
            
            switch (chr) {
                case '[':
                    bracketCount++;
                    continue;
                    break;
                    
                case ']':
                    bracketCount--;
                    continue;
                    break;
                    
                case '(':
                    parenthesisCount++;
                    continue;
                    break;
                    
                case ')':
                    parenthesisCount--;
                    continue;
                    break;
                
                case "'":
                case '"':
                    if ( ! quote) {
                        quote = chr;
                    } else if (quote === chr) {
                        quote = null;
                    }
                    continue;
                    break;
                    
            }
            
            if (parenthesisCount || bracketCount || quote) {
                continue;
            }
            
            switch (chr) {
                case ' ':
                    newType = 'default';
                    break;
                    
                case '>':
                    newType = 'child';
                    break;
                    
                case '+':
                    newType = 'next';
                    break;
                    
                case '~':
                    newType = 'sbrother';
                    break;
                    
                case '/':
                    newType = 'reference';
                    break;
                    
                default:
                    continue;
                    break;
            }
            
            nodeList[nodeList.length++] = this.compileNode(selector.substring(beforeIndex + 1, i), type, ref);
            beforeIndex = i;
            type = newType;
            
            if (newType === 'reference') {
                beforeIndex = selector.indexOf('/', i + 1);
                
                if (beforeIndex < 0) {
                    throw new Error('Selector compile error.');
                }
                
                ref = selector.substring(i + 1, beforeIndex);
                
                i = beforeIndex;
            }
        }
        
        if (parenthesisCount || bracketCount || quote) {
            throw new Error('Selector compile error.');
        }
        
        nodeList[nodeList.length++] = this.compileNode(selector.substring(beforeIndex + 1, l), type, ref);
        
        var targetCnt = 0;
        
        for (i = nodeList.length; i--;) {
            if (nodeList[i].isTarget) {
                nodeList.targetIndex = i;
                targetCnt++;
            }
        }
        
        if (targetCnt > 1) {
            throw new Error('Selector compile error.');
        }
        
        return nodeList;
    },
    
    /**
     * ノードのコンパイルを行う
     * 
     * @param {String} selector セレクタ
     * @param {String} [relationType] このノードと他ノードの関係を示す文字列
     * @param {String} [ref] 属性参照のキー
     * @return {Jeeel.Dom.Selector.Node} コンパイル結果
     */
    compileNode: function (selector, relationType, ref) {
      
        if ( ! relationType) {
            relationType = 'default';
        }
        
        var cache = Jeeel.Dom.Selector.Node.caches[selector];
        
        if (cache && cache[relationType]) {
            return cache[relationType];
        }
        
        var node = new Jeeel.Dom.Selector.Node(selector, relationType, ref);
        
        var parenthesisCount = 0;
        var bracketCount = 0;
        var quote = null;
        var attrs = [];
        var beforeIndex = -1;
        var type = 'tag', newType;
        var i, l, chr, bchar, sp;
        
        for (i = 0, l = selector.length; i < l; i++) {
            chr = selector.charAt(i);
            
            sp = false;
            
            switch (chr) {
                case '#':
                    if ( ! parenthesisCount || ! bracketCount || ! quote) {
                        newType = 'id';
                    }
                    break;
                    
                case '.':
                    if ( ! parenthesisCount || ! bracketCount || ! quote) {
                        newType = 'class';
                    }
                    break;
                    
                case ':':
                    if (bchar === ':') {
                        continue;
                    } else if ( ! parenthesisCount || ! bracketCount || ! quote) {
                        newType = 'mock';
                    }
                    break;
                    
                case '!':
                    if ( ! parenthesisCount || ! bracketCount || ! quote) {
                        newType = 'parent';
                    }
                    break;
                    
                case '[':
                    if ( ! parenthesisCount || ! bracketCount || ! quote) {
                        newType = 'attr';
                        sp = true;
                    }
                    bracketCount++;
                    break;
                    
                case ']':
                    bracketCount--;
                    bchar = chr;
                    continue;
                    break;
                    
                case '(':
                    parenthesisCount++;
                    break;
                    
                case ')':
                    parenthesisCount--;
                    bchar = chr;
                    continue;
                    break;
                    
                case "'":
                case '"':
                    if ( ! quote) {
                        quote = chr;
                    } else if (quote === chr) {
                        quote = null;
                    }
                    bchar = chr;
                    continue;
                    break;
                    
                default:
                    continue;
                    break;
            }
            
            bchar = chr;
            
            sp = sp && bracketCount && ( ! parenthesisCount && ! quote);
            
            if ( ! sp && (parenthesisCount || bracketCount || quote)) {
                continue;
            }
            
            switch (type) {
                case 'tag':
                    node.tag = selector.substring(beforeIndex + 1, i).toUpperCase() || '*';
                    break;
                    
                case 'id':
                    node.id = selector.substring(beforeIndex + 1, i);
                    break;
                    
                case 'class':
                    node.classes.push(selector.substring(beforeIndex + 1, i));
                    break;
                    
                case 'attr':
                    attrs.push(selector.substring(beforeIndex + 1, i - 1));
                    break;
                    
                case 'mock':
                    node.mocks.push(this.compileMock(node, selector.substring(beforeIndex + 1, i)));
                    break;
                    
                case 'parent':
                    throw new Error('Selector compile error.');
                    break;
            }
            
            type = newType;
            beforeIndex = i;
        }
        
        switch (type) {
            case 'tag':
                node.tag = selector.substring(beforeIndex + 1, l).toUpperCase();
                
                if (node.tag === 'HTML' || node.tag === 'BODY' || node.tag === 'HEAD') {
                    node.isOnlyNode = true;
                }
                break;

            case 'id':
                if (node.id) {
                    throw new Error('Selector compile error.');
                }
                
                node.id = selector.substring(beforeIndex + 1, l);
                
                if ( ! node.id) {
                    throw new Error('Selector compile error.');
                }
                break;

            case 'class':
                node.classes.push(selector.substring(beforeIndex + 1, l));
                break;

            case 'attr':
                attrs.push(selector.substring(beforeIndex + 1, l - 1));
                break;

            case 'mock':
                node.mocks.push(this.compileMock(node, selector.substring(beforeIndex + 1, l)));
                break;
                
            case 'parent':
                if (selector.charAt(selector.length - 1) === chr) {
                    node.isTarget = true;
                }
                break;
        }
        
        node.attrs = this.compileAttribute(attrs);
        
        if ( ! node.isOnlyNode) {
            for (i = node.mocks.length; i--;) {
                if (node.mocks[i].isOnlyMock) {
                    node.isOnlyNode = true;
                    break;
                }
            }
        }
        
        return node;
    },
    
    /**
     * 複数のノードのコンパイルを行う
     * 
     * @param {String} selector セレクタ
     * @return {Jeeel.Dom.Selector.Node[]} コンパイル結果
     */
    compileNodes: function (selector) {
        var selectors = selector.replace(/\s+/g, '').split(',');
        var nodes = [];
        
        for (var i = 0, l = selectors.length; i < l; i++) {
            nodes[i] = this.compileNode(selectors[i]);
        }
        
        return nodes;
    },
    
    /**
     * 属性のコンパイルを行う
     * 
     * @param {String[]} selectors セレクタリスト
     * @return {Hash[]} コンパイル後の属性リスト
     */
    compileAttribute: function (selectors) {
        var attrReg = /([a-z0-9_\-]+)\s*(?:([\^|$*~]?=)\s*([\s\S]*))?/gi;
        var attrs = [];
        
        for (var i = 0, l = selectors.length; i < l; i++) {
            selectors[i].replace(attrReg, function (match, name, eq, value) {
                
                name = name.toLowerCase();
                
                if (eq) {
                    
                    var flg;
                    
                    value = value.replace(/^(["'])([\s\S]*)\1(?:\s+(i))?$/g, function (match, quot, orgValue, flag) {
                        flg = flag;
                        
                        return orgValue;
                    });
                    
                    if (flg !== 'i') {
                        flg = Jeeel.Dom.Selector.Node.IGNORE_CASE[name] ? 'i' : '';
                    }

                    switch (eq.charAt(0)) {
                        case '=':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp('^' + Jeeel.String.escapeRegExp(value) + '$', 'g' + flg)
                            };
                            break;
                            
                        case '~':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp('(?:^| )' + Jeeel.String.escapeRegExp(value) + '(?: |$)', 'g' + flg)
                            };
                            break;

                        case '^':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp('^' + Jeeel.String.escapeRegExp(value), 'g' + flg)
                            };
                            break;

                        case '$':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp(Jeeel.String.escapeRegExp(value) + '$', 'g' + flg)
                            };
                            break;

                        case '*':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp(Jeeel.String.escapeRegExp(value), 'g' + flg)
                            };
                            break;
                            
                        case '|':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp('^' + Jeeel.String.escapeRegExp(value) + '(?:-|$)', 'g' + flg)
                            };
                            break;

                        default:
                            break;
                    }

                    return '';
                }

                attrs[attrs.length] = {
                    name: name,
                    reg: '*'
                };

                return '';
            });
        }
        
        return attrs;
    },
    
    /**
     * 疑似クラスのコンパイルを行う
     * 
     * @param {Jeeel.Dom.Selector.Node} node 疑似クラスを所有するノード
     * @param {String} selector セレクタ
     * @return {Jeeel.Dom.Selector.Mock} コンパイル後の疑似クラス
     */
    compileMock: function (node, selector) {
        var mock = new Jeeel.Dom.Selector.Mock(node, selector);
        
        var reg = /^([a-z0-9_\-]+)(?:\((.*)\))?$/i;
        
        selector.replace(reg, function (match, name, args) {
            mock.name = name.toLowerCase();
            
            args = Jeeel.String.trim(args);
            
            if (args) {
                mock.args = args;
            }
        });
        
        return mock.compile();
    }
};