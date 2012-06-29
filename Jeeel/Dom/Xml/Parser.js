
/**
 * @staticClass XMLをパースするための静的クラス(対応しているのは完全XML形式でヘッダ、通常要素、テキスト、属性、名前空間)
 */
Jeeel.Dom.Xml.Parser = {
    
    /**
     * 元から存在するネームスペース
     * 
     * @type Hash
     * @constant
     */
    NAMESPACES: {
        xmlns: 'http://www.w3.org/2000/xmlns/'
    },
    
    /**
     * 現在パース中のXMLドキュメント
     * 
     * @type Hash
     * @private
     */
    _xml: null,

    /**
     * XML文字列をパースする
     * 
     * @param {String} xml パース対象のXML文字列
     * @return {Hash} パース後の簡易オブジェクト
     */
    parse: function (xml) {
        xml = Jeeel.String.trim(xml);
        
        this._xml = {
            nodeName: '#document',
            nodeValue: null,
            nodeType: Jeeel.Dom.Node.DOCUMENT_NODE,
            innerXML: xml
        };
        
        xml = this._parseXmlHeader(xml);
        
        this._parseXmlDocument(xml);
        
        this._xml.firstChild = this._xml.childNodes[0] || null;
        this._xml.lastChild = this._xml.childNodes[this._xml.childNodes.length - 1] || null;
        
        return this._xml;
    },
    
    /**
     * XMLのヘッダを解析する
     * 
     * @param {String} xml 解析XML
     * @return {String} ヘッダを取り除いた値
     * @private
     */
    _parseXmlHeader: function (xml) {
        var self = this;
        
        return xml.replace(/<\?xml(.*)?\?>/, function (match, header) {
            
            var v = header.match(/version=(?:([0-9.]+)|((["'])?[0-9.]+[^\\]\3))/);
            var e = header.match(/encoding=(?:([^"']+)|((["'])?[^"']+[^\\]\3))/);
            
            self._xml.xmlVersion = v[1] || v[2] && v[2].replace(/^["']|["']$/g, '') || '';
            self._xml.xmlEncoding = e[1] || e[2] && e[2].replace(/^["']|["']$/g, '') || '';
            
            return '';
        });
    },
    
    /**
     * XMLのドキュメント本体を解析する
     * 
     * @param {String} xml 解析XML
     * @private
     */
    _parseXmlDocument: function (xml) {
        var inTag = false, isTagName = false, isAttrName = false, isAttrValue = false, isEndTag = false;
        var attrName, prefix, tagName, tag, bchar, quot = null, txt = '', bi = null;
        var i, j, l, tmp, tmpName, tmpTags = [], attrs, namespaceVal = this.NAMESPACES;
        var parent;
        
        this._xml.childNodes = [];
        this._xml.documentElement = null;
        
        parent = this._xml;
        
        for (i = 0, l = xml.length; i < l; i++) {
            var chr = xml.charAt(i);
            
            switch (chr) {
                case '<':
                    inTag = true;
                    isTagName = true;
                    isAttrName = false;
                    isAttrValue = false;
                    isEndTag = false;
                    tagName = '';
                    prefix = null;
                    attrs = [];
                    bi = i;
                    
                    // 今までテキストを保持指定居た場合テキストノードを生成して親に入れる
                    if (txt && ! ('documentElement' in parent)) {
                        tag = {
                            attributes: null,
                            childNodes: [],
                            parentNode: parent,
                            nodeValue: txt,
                            nodeName: '#text',
                            prefix: null,
                            namespaceURI: null,
                            nodeType: Jeeel.Dom.Node.TEXT_NODE,
                            innerXML: ''
                        };
                        
                        parent.childNodes.push(tag);
                    }
                    break;
                    
                case '>':
                    if ( ! inTag) {
                        break;
                    }
                    
                    inTag = false;
                    
                    // テキストが存在しておりそれが属性値の場合は属性を作成
                    if (txt && isAttrValue) {
                        attrs.push({
                            nodeName: attrName,
                            nodeValue: txt,
                            prefix: prefix,
                            namespaceURI: namespaceVal[prefix] || null
                        });
                    }
                    
                    // タグが閉じられているかどうかで分岐する
                    if (isEndTag) {
                        
                        // 前後にタグが存在するタイプと1つのタグで開始と終了を併せ持つ場合で分岐する
                        if (bchar !== '/') {
                            tag = tmpTags.pop();
                            
                            // 開始タグと終了タグの名前が異なっていた場合はパースエラー
                            if (tag.nodeName !== tagName) {
                                throw new Error('Parse error.');
                            }
                            
                            parent = parent.parentNode;
                            
                            tag.innerXML = xml.substring(tag.innerXML, bi);
                            
                            if ( ! tag.childNodes.length) {
                                tag.nodeValue = tag.innerXML;
                            }
                            
                            if (namespaceVal.__back) {
                                namespaceVal = namespaceVal.__back;
                            }
                            
                            tag.firstChild = tag.childNodes[0] || null;
                            tag.lastChild = tag.childNodes[tag.childNodes.length - 1] || null;
                        } else {
                            tmpName = {};

                            for (j = attrs.length; j--;) {
                                if (tmp = attrs[j].nodeName.match(/^xmlns:(.+)$/)) {
                                    tmpName[tmp[1]] = attrs[j].nodeValue;
                                }
                            }

                            this._namespace.prototype = namespaceVal;
                            tmp = namespaceVal;

                            namespaceVal = new this._namespace(tmpName);
                            namespaceVal.__back = tmp;
                        
                            tag = {
                                attributes: attrs,
                                childNodes: [],
                                parentNode: parent,
                                nodeName: tagName,
                                nodeValue: null,
                                prefix: prefix,
                                namespaceURI: namespaceVal[prefix] || null,
                                nodeType: Jeeel.Dom.Node.ELEMENT_NODE,
                                innerXML: '',
                                firstChild: null,
                                lastChild: null
                            };
                            
                            if (namespaceVal.__back) {
                                namespaceVal = namespaceVal.__back;
                            }
                        }
                        
                        parent.childNodes.push(tag);
                        
                        // ルートノードが未定義で親がドキュメントだった場合はルートノードを定義する
                        if (parent.nodeType === Jeeel.Dom.Node.DOCUMENT_NODE && ! parent.documentElement) {
                            parent.documentElement = tag;
                        }
                    } else {
                        tmpName = {};
                        
                        for (j = attrs.length; j--;) {
                            if (tmp = attrs[j].nodeName.match(/^xmlns:(.+)$/)) {
                                tmpName[tmp[1]] = attrs[j].nodeValue;
                            }
                        }
                        
                        this._namespace.prototype = namespaceVal;
                        tmp = namespaceVal;
                        
                        namespaceVal = new this._namespace(tmpName);
                        namespaceVal.__back = tmp;
                      
                        tag = {
                            attributes: attrs,
                            childNodes: [],
                            parentNode: parent,
                            nodeName: tagName,
                            nodeValue: null,
                            prefix: prefix,
                            namespaceURI: namespaceVal[prefix] || null,
                            nodeType: Jeeel.Dom.Node.ELEMENT_NODE,
                            innerXML: i + 1,
                            firstChild: null,
                            lastChild: null
                        };
                        
                        parent = tag;
                        
                        tmpTags.push(tag);
                    }
                    
                    txt = '';

                    break;
                    
                case '/':
                    if (quot) {
                        txt += chr;
                        break;
                    }
                    
                    if (inTag) {
                        isEndTag = true;
                    } else {
                        txt += chr;
                    }
                    break;
                    
                case ':':
                    if (quot) {
                        txt += chr;
                        break;
                    }
                    
                    if (inTag) {
                        if (isTagName) {
                            prefix = tagName;
                            tagName += chr;
                        } else if (isAttrName) {
                            prefix = attrName;
                            attrName += chr;
                        } else if (isAttrValue) {
                            txt += chr;
                        }
                    } else {
                        txt += chr;
                    }
                    break;
                    
                case ' ':
                    if (quot) {
                        txt += chr;
                        break;
                    }
                    
                    if (inTag && isTagName) {
                        isTagName = false;
                        isAttrName = true;
                        isAttrValue = false;
                        attrName = '';
                        prefix = null;
                    } else if (inTag && isAttrValue) {
                        isAttrName = true;
                        isAttrValue = false;

                        attrs.push({
                            nodeName: attrName,
                            nodeValue: txt,
                            prefix: prefix,
                            namespaceURI: namespaceVal[prefix] || null
                        });
                        
                        attrName = '';
                        
                    } else if ( ! inTag) {
                        txt += chr;
                    }
                    break;
                    
                case '=':
                    if (quot) {
                        txt += chr;
                        break;
                    }
                    
                    if (inTag && isAttrName) {
                        isAttrName = false;
                        isAttrValue = true;
                        txt = '';
                    } else if ( ! inTag) {
                        txt += chr;
                    }
                    break;
                
                case "'":
                case '"':
                    if ( ! inTag) {
                        txt += chr;
                        break;
                    }
                    
                    if (quot === chr) {
                        quot = null;
                    } else if ( ! quot) {
                        quot = chr;
                    }
                    break;
                    
                default:
                    if (inTag) {
                        if (isTagName) {
                            tagName += chr;
                        } else if (isAttrName) {
                            attrName += chr;
                        } else if (isAttrValue) {
                            txt += chr;
                        }
                    } else {
                        txt += chr;
                    }
                    break;
            }
            
            bchar = chr;
        }
    },
    
    /**
     * コンストラクタ
     * 
     * @class 名前空間に使用するための内部クラス
     * @param {Hash} values 継承プロパティ
     * @private
     */
    _namespace: function (values) {
        if (values) {
            for (var key in values) {
                this[key] = values[key];
            }
        }
    }
};
