
Jeeel.Dom.Selector.Matcher = function (rowSelecter) {
    this._css = rowSelecter;
    this._data = new Jeeel.Dom.Selector.Data(this._css);
    
    this._analyze(this._data, rowSelecter);
};

Jeeel.Dom.Selector.Matcher.prototype = {
    _css: '',
    
    _data: null,
    
    match: function (elm) {
        
    },
    
    /**
     * CSSセレクタの解析を行う
     *
     * @private
     */
    _analyze: function (data, originalCss) {
        var list = ['.', '#', '['];
        var css = originalCss.split(/>|\+| /, 1)[0];
        var cssBase = Jeeel.Filter.String.RegularExpressionEscape.create().filter(css);

        while(css.charAt(0)) {
            var index = css.length, tmp;

            for (var i = 0, l = list.length; i < l; i++) {
                tmp = css.indexOf(list[i], 1);

                if (tmp >= 0 && index > tmp) {
                    index = tmp;
                }
            }

            var cssCol = css.substr(0, index);

            if (cssCol.length <= 0) {
                break;
            }

            this._setData(data, cssCol);

            css = css.substr(index, css.length);
        }

        var childIndex = originalCss.search(/(>|\+| )/) + 1;

        if (childIndex > 0) {
            var reg = new RegExp('^' + cssBase + '(>|\\+| )');
            var narrow = originalCss.match(reg)[1];
            var cssNarrow = originalCss.replace(reg, '');

            this._setNarrowData(data, cssNarrow, narrow);
        }
    },

    /**
     * 次の絞り込みデータをセットする
     */
    _setNarrowData: function (self, css, narrow) {
        if ( ! css) {
            return;
        }

        var data = new Jeeel.Dom.Selector.Data(css, narrow);

        if (narrow == '+') {
            data.prev = self;
            self.next = data;
        } else if (narrow == '>') {
            data.parent = self;
            self.child  = data;
        } else {
            self.descendant = data;
        }
        
        this._analyze(data, css);
    },

    /**
     * CSSの一つのデータをセットする(タグ・CLASS・IDのいずれかを示すCSSセレクタ)
     *
     * @param {String} cssCol CSSセレクタの最小単位
     * @private
     */
    _setData: function (data, cssCol) {
        var prefix = cssCol.charAt(0);
        var base = cssCol.replace(/^(\.|#|\[)/, '');

        if ( ! base) {
            throw new SyntaxError('構文エラー');
        }

        switch (prefix) {
            case '.':
                if ( ! data.classNames) {
                    data.classNames = [];
                }

                data.classNames[data.classNames.length] = base;
                break;

            case '#':
                data.id = base;
                break;
              
            case '[':
                this._setAttr(data, base);
                break;

            default:
                data.tag = base;
                break;
        }
    },
    
    _setAttr: function (data, attr) {
        attr = attr.replace(']', '');
        
        if ( ! data.attributes) {
            data.attributes = [];
        }
        
        var match = attr.match(/((~|\|)?=)/);
        
        if ( ! match) {
            data.attributes[data.attributes.length] = {
                key: attr,
                val: '*'
            };
            
            return;
        }
        
        var key = attr.substr(0, match.index),
            val = attr.substr(match.index + match[0].length, attr.length).replace(/"/g, '');

        if (match[0].length === 1) {
            data.attributes[data.attributes.length] = {
                key: key,
                val: val
            };
            
            return;
        }
        
        switch(match[0][0]) {
            case '~':
                val = val.split(' ');
                break;
                
            case '|':
                val = {val: val, suffix: '-'};
                break;
                
            default:
                break;
        }
        
        data.attributes[data.attributes.length] = {
            key: key,
            val: val
        };
    }
};