
/**
 * @namespace 読み込み関連のメソッドを提供するModule
 */
Jeeel.Loader = {

    /**
     * Prototype.jsが読み込まれているかどうかを返す。
     * 
     * @return {Boolean} 読み込みが完了していたらtrueそれ以外はfalseを返す
     */
    completePrototype: function () {
        if (Jeeel._global.Prototype && ! Jeeel.Type.isEmpty(Prototype.Version)) {
            return true;
        }

        return false;
    },

    /**
     * jQuery.jsが読み込まれているかどうかを返す。
     *
     * @return {Boolean} 読み込みが完了していたらtrueそれ以外はfalseを返す
     */
    completeJQuery: function () {
        if (Jeeel._global.jQuery && Jeeel.Type.isFunction(jQuery) && Jeeel.Type.isString(jQuery.prototype.jquery)) {
            return true;
        }

        return false;
    },

    /**
     * YUI.jsが読み込まれているかどうかを返す。
     *
     * @return {Boolean} 読み込みが完了していたらtrueそれ以外はfalseを返す
     */
    completeYUI: function () {
        if (Jeeel._global.YUI && Jeeel.Type.isFunction(YUI) && Jeeel.Type.isString(YUI.version)) {
            return true;
        }

        return false;
    },

    /**
     * JavaScriptを読み込む
     *
     * @param {String} url JavaScriptのURL
     * @param {Function} [callback] 読み込み完了時のコールバック
     * @param {String} [charCode] 明示的にキャラクターコードを設定する場合に指定(Jeeel.Code.CharEncoding参照)
     * @return {Element} scriptタグのElement
     * @see Jeeel.Code.CharEncoding
     */
    loadScript: function (url, callback, charCode) {
      
        if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
        
        var script  = Jeeel.Document.createElement('script');
        script.type = 'text/javascript';

        if (Jeeel.Type.isString(charCode)) {
            script.charset = charCode;
        }

        if (callback) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    script.onload = null;
                    callback(script);
                }
            };
            
            script.onload = function () {
                script.onreadystatechange = null;
                script.onload = null;
                callback(script);
            };
        }
        
        script.src  = url;

        Jeeel.Document.appendToHead(script);
        
        return script;
    },

    /**
     * CSSを読み込む
     *
     * @param {String} url CSSのURL
     * @param {String} [charCode] 明示的にキャラクターコードを設定する場合に指定(Jeeel.Code.CharEncoding参照)
     * @return {Element} linkタグのElement
     * @see Jeeel.Code.CharEncoding
     */
    loadStyle: function (url, charCode) {
      
        if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
      
        var style  = Jeeel.Document.createElement('link');
        style.type = 'text/css';
        style.rel  = 'stylesheet';

        if (Jeeel.Type.isString(charCode)) {
            style.charset = charCode;
        }
        
        style.href = url;

        Jeeel.Document.appendToHead(style);
        
        return style;
    },

    /**
     * スクリプトを記述したJavaScript文字列を実行してヘッダに埋め込む
     *
     * @param {String} script JavaScript文字列
     * @return {Element} scriptタグのElement
     */
    addScript: function (script) {
        var scriptTag  = Jeeel.Document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.innerHTML = script;

        Jeeel.Document.appendToHead(scriptTag);
        
        return scriptTag;
    },

    /**
     * スタイルを記述したCSS文字列を適用してヘッダに埋め込む
     *
     * @param {String} style CSS文字列
     * @return {Element} styleタグのElement
     */
    addStyle: function (style) {
        var styleTag  = Jeeel.Document.createElement('style');
        styleTag.type = 'text/css';
        
        style = '\n' + style + '\n';

        if (styleTag.styleSheet) {
            styleTag.styleSheet.cssText = style;
        } else {
            styleTag.innerHTML = style;
        }

        Jeeel.Document.appendToHead(styleTag);
        
        return styleTag;
    },
    
    /**
     * ファイルの事前読み込みを行う<br />
     * これを行う事により事前にキャッシュを作る事が可能になる
     * 
     * @param {String} url 読み込みファイルのURL
     */
    preloadFile: function (url) {},

    /**
     * 現在読み込み中のJavaScriptのscriptタグを取得する<br />
     * 読み込み中のJavaScript内から呼ばないと意味がない
     *
     * @return {Element} scriptタグのElement
     * @deprecated 今後削除予定
     */
    getCurrentScript: function () {
        return (function (e) {
            return (e.nodeName.toUpperCase() === 'SCRIPT' ? e : arguments.callee(e.lastChild));
        })(Jeeel._doc);
    },

    /**
     * 指定したURLのファイルがあるかどうかを返す
     *
     * @param {String} url ファイルのURL
     * @return {Boolean} ファイルが存在するかどうか
     */
    existsFile: function (url) {
      
        if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
            Jeeel.Acl.throwError('Access Error', 404);
        }
      
        var file = Jeeel.Net.Ajax.serverResponse(url);

        if (Jeeel.Type.isString(file)) {
            return true;
        }

        return false;
    },
    
    /**
     * @ignore
     */
    _init: function () {
      
        if (/*@cc_on!@*/false) {
            /**
             * @ignore
             */
            this.preloadFile = function (url) {
                new Image().src = url;
            };
        } else {
            /**
             * @ignore
             */
            this.preloadFile = function (url) {
              
                if (Jeeel.Acl && Jeeel.Acl.isDenied(url, '*', 'Url')) {
                    Jeeel.Acl.throwError('Access Error', 404);
                }
                
                var obj = Jeeel.Document.createElement('object');
                
                obj.width  = 0;
                obj.height = 0;
                obj.data = url;
                Jeeel.Document.appendToBody(obj);
            };
        }
      
        delete this._init;
    }
};

Jeeel.Loader._init();