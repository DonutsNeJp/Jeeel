
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
        var quoteIn = false;
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
                    quoteIn = !quoteIn;
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
                    if (quoteIn) {
                        filtered.push(chr);
                    } else if (bchr !== chr) {
                        
                        switch (bchr) {
                            case '+':
                            case '~':
                            case '>':
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
                    if ( ! quoteIn && bchr === ' ') {
                        filtered.pop();
                    }
                    
                    filtered.push(chr);
                    break;
                    
                case ',':
                    if ( ! parenthesisCount && ! bracketCount && ! quoteIn) {
                        j = 0;
                        
                        while (filtered[j] && filtered[j] === ' ') {
                            filtered[j++] = '';
                        }
                        
                        while (filtered[filtered.length - 1] === ' ') {
                            filtered.pop();
                        }
                        
                        res[res.length] = this.compileNodeList(filtered.join(''));
                        filtered = [];
                    }
                    break;

                default:
                    filtered.push(chr);
                    break;
            }
            
            bchr = chr;
        }
        
        if ( ! parenthesisCount && ! bracketCount && ! quoteIn) {
            
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
        var quoteIn = false;
        var i, l, type = null, newType = null;
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
                    quoteIn = !quoteIn;
                    continue;
                    break;
                    
            }
            
            if (parenthesisCount || bracketCount || quoteIn) {
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
                    
                default:
                    continue;
                    break;
            }
            
            nodeList[nodeList.length++] = this.compileNode(selector.substring(beforeIndex + 1, i), type);
            beforeIndex = i;
            type = newType;
        }
        
        if (parenthesisCount || bracketCount || quoteIn) {
            throw new Error('Compile error.');
        }
        
        nodeList[nodeList.length++] = this.compileNode(selector.substring(beforeIndex + 1, l), type);
        
        return nodeList;
    },
    
    /**
     * ノードのコンパイルを行う
     * 
     * @param {String} selector セレクタ
     * @param {String} relationType このノードと他ノードの関係を示す文字列
     * @return {Jeeel.Dom.Selector.Node} コンパイル結果
     */
    compileNode: function (selector, relationType) {
        
        var cache = Jeeel.Dom.Selector.Node.caches[selector];
        
        if (cache && cache[relationType]) {
            return cache[relationType];
        }
        
        var node = new Jeeel.Dom.Selector.Node(selector, relationType);
        
        var parenthesisCount = 0;
        var bracketCount = 0;
        var quoteIn = false;
        var attrs = [];
        var beforeIndex = -1;
        var type = 'tag', newType;
        var i, l, chr, bchar, sp;
        
        for (i = 0, l = selector.length; i < l; i++) {
            chr = selector.charAt(i);
            
            sp = false;
            
            switch (chr) {
                case '#':
                    if ( ! parenthesisCount || ! bracketCount || ! quoteIn) {
                        newType = 'id';
                    }
                    break;
                    
                case '.':
                    if ( ! parenthesisCount || ! bracketCount || ! quoteIn) {
                        newType = 'class';
                    }
                    break;
                    
                case ':':
                    if (bchar === ':') {
                        continue;
                    } else if ( ! parenthesisCount || ! bracketCount || ! quoteIn) {
                        newType = 'mock';
                    }
                    break;
                    
                case '[':
                    if ( ! parenthesisCount || ! bracketCount || ! quoteIn) {
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
                    quoteIn = !quoteIn;
                    bchar = chr;
                    continue;
                    break;
                    
                default:
                    continue;
                    break;
            }
            
            bchar = chr;
            
            sp = sp && bracketCount && ( ! parenthesisCount && ! quoteIn);
            
            if ( ! sp && (parenthesisCount || bracketCount || quoteIn)) {
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
            }
            
            type = newType;
            beforeIndex = i;
        }
        
        switch (type) {
            case 'tag':
                node.tag = selector.substring(beforeIndex + 1, l).toUpperCase();
                break;

            case 'id':
                node.id = selector.substring(beforeIndex + 1, l);
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
        }
        
        node.attrs = this.compileAttribute(attrs);
        
        return node;
    },
    
    /**
     * 属性のコンパイルを行う
     * 
     * @param {String[]} selectors セレクタリスト
     * @return {Hash[]} コンパイル後の属性リスト
     */
    compileAttribute: function (selectors) {
        var regFilter = new Jeeel.Filter.String.RegularExpressionEscape();
        var attrReg = /([a-z0-9_\-]+)(?:((?:\^|\$|\*)?=)([\s\S]*))?/gi;
        var attrs = [];
        
        for (var i = 0, l = selectors.length; i < l; i++) {
            selectors[i].replace(attrReg, function (match, name, eq, value) {
                if (eq) {

                    value = value.replace(/^(["'])([\s\S]*)\1$/g, '$2');

                    switch (eq.charAt(0)) {
                        case '=':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp('^' + regFilter.filter(value) + '$', 'g')
                            };
                            break;

                        case '|':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp('^' + regFilter.filter(value) + '-?', 'g')
                            };
                            break;

                        case '^':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp('^' + regFilter.filter(value), 'g')
                            };
                            break;

                        case '$':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp(regFilter.filter(value) + '$', 'g')
                            };
                            break;

                        case '*':
                            attrs[attrs.length] = {
                                name: name,
                                reg: new RegExp(regFilter.filter(value), 'g')
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
        
        var reg = /^([a-z0-9_\-]+)(?:\((.+)\))?$/i;
        
        selector.replace(reg, function (match, name, args) {
            mock.name = name;
            
            if (args) {
                mock.args = args;
            }
        });
        
        return mock.compile();
    }
};