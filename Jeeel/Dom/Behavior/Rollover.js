
/**
 * ロールオーバーを有効にする
 * 
 * @return {Jeeel.Dom.Behavior} 自クラス
 */
Jeeel.Dom.Behavior.enableRollover = function () {
  
    Jeeel.Dom.Behavior.Rollover.addLoadEvent();
    
    return this;
};

/**
 * ロールオーバーを実現するためのクラス
 */
Jeeel.Dom.Behavior.Rollover = {
    
    _prefix: {
        on: '',
        off: ''
    },
    
    _suffix: {
        on: '_on',
        off: '_off'
    },
    
    /**
     * 読み込み時のイベントに登録する
     * 
     * @return {Jeeel.Dom.Behavior.Rollover} 自クラス
     */
    addLoadEvent: function () {
        Jeeel.addLoadEvent(function () {
            var elms = Jeeel.Document.getElementsByTagName('input');

            this.rollover(elms.concat(Jeeel.Document.getElementsByTagName('img')));

            elms = null;
        }, this);
        
        return this;
    },
    
    /**
     * 先頭のロールオーバーパターンを設定する
     * 
     * @param {String} prefixOn ロールオーバー時の先頭パターン
     * @param {String} prefixOff ロールアウト時の先頭パターン
     * @return {Jeeel.Dom.Behavior.Rollover} 自クラス
     */
    setPrefixPattern: function (prefixOn, prefixOff) {
        this._prefix = {
            on: prefixOn,
            off: prefixOff
        };
        
        return this;
    },
    
    /**
     * 後尾のロールオーバーパターンを設定する
     * 
     * @param {String} suffixOn ロールオーバー時の後尾パターン
     * @param {String} suffixOff ロールアウト時の後尾パターン
     * @return {Jeeel.Dom.Behavior.Rollover} 自クラス
     */
    setSuffixPattern: function (suffixOn, suffixOff) {
        this._suffix = {
            on: suffixOn,
            off: suffixOff
        };
        
        return this;
    },
    
    /**
     * イメージのロールオーバーを行う
     * 
     * @param {Element|Element[]} elements イメージもしくはイメージリスト(内部に他のElementが入っていた場合無視する)
     * @return {Jeeel.Dom.Behavior.Rollover} 自クラス
     */
    rollover: function (elements) {
        if (Jeeel.Type.isElement(elements)) {
            elements = [elements];
        }
        
        if ( ! Jeeel.Type.isArray(elements)) {
            throw new Error('引数が間違っています。');
        }
        
        var over, out;
        
        var regFilter = new Jeeel.Filter.String.RegularExpressionEscape();
        
        (function (pover, pout, sover, sout) {
            
            /**
             * @ignore
             */
            over = function () {
                var src = this.src;
                
                if (pout || pover) {
                    src = src.replace(new RegExp('/?' + regFilter.filter(pout) + '([^/]*)$'), '/' + pover + '$1');
                }
                
                if (sout || sover) {
                    src = src.replace(sout + '.', sover + '.');
                }
                
                this.src = src;
            };

            /**
             * @ignore
             */
            out = function () {
                var src = this.src;
                
                if (pover || pout) {
                    src = src.replace(new RegExp('/?' + regFilter.filter(pover) + '([^/]*)$'), '/' + pout + '$1');
                }
                
                if (sover || sout) {
                    src = src.replace(sover + '.', sout + '.');
                }
                
                this.src = src;
            };
        })(this._prefix.on, this._prefix.off, this._suffix.on, this._suffix.off);
        
        var reg = new RegExp('\\/?' + regFilter.filter(this._prefix.off) + '[^/]*' + regFilter.filter(this._suffix.off) + '\\.[^.]+$');
        
        for (var i = elements.length; i--;) {
            var element = elements[i];
            var tagName = element.tagName && element.tagName.toUpperCase();
            
            if (tagName === 'IMG' || tagName === 'INPUT' && element.type.toLowerCase() === 'image') {
                
                if ( ! element.src.match(reg)) {
                    continue;
                }
                
                elements[i].onmouseover = over;
                elements[i].onmouseout = out;
            }
        }
        
        return this;
    }
};
