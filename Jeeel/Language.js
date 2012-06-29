Jeeel.directory.Jeeel.Language = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Language/';
    }
};

/**
 * @staticClass 言語関連を管理するスタティッククラス
 */
Jeeel.Language = {
    
    /**
     * ユニークID
     * 
     * @type String
     * @private
     */
    _uid: Jeeel.UNIQUE_ID,
    
    /**
     * ロケール
     * 
     * @type String
     * @private
     */
    _locale: 'en',
    
    /**
     * 初期ロケール
     * 
     * @type String
     * @private
     */
    _defaultLocale: 'en',
    
    /**
     * サポートしているロケール
     * 
     * @type String[]
     * @private
     */
    _supportLocales: [
        'en',
        'ja'
    ],
    
    /**
     * ランゲージ格納ディレクトリ
     * 
     * @type String[]
     * @private
     */
    _languageDirectories: [
        Jeeel.BASE_URL + 'Jeeel/Language/'
    ],
    
    /**
     * 読み込み済みのランゲージ要素
     * 
     * @type Hash
     * @private
     */
    _languages: {},
    
    /**
     * 読み込み済みのパスリスト
     * 
     * @type String[]
     * @private
     */
    _loadedPaths: [],
    
    /**
     * このクラスがサポートするロケール一覧を取得する
     * 
     * @return {String[]} ロケール一覧
     */
    getSupportLocales: function () {
        return this._supportLocales;
    },
    
    /**
     * デフォルトのロケールを取得する
     * 
     * @return {String} ロケール
     */
    getDefaultLocale: function () {
        return this._defaultLocale;
    },
    
    /**
     * 現在のロケールを取得する
     * 
     * @return {String} ロケール
     */
    getLocale: function () {
        return this._locale;
    },
    
    /**
     * 現在のロケールを設定する(サポート外の値を指定すると初期ロケールに戻される)
     * 
     * @param {String} locale ロケール
     * @return {Jeeel.Language} 自クラス
     */
    setLocale: function (locale) {
        if ( ! Jeeel.Hash.inHash(locale, this._supportLocales, true)) {
            locale = this._defaultLocale;
        }
        
        this._locale = locale;
        
        return this._reloadLanguage();
    },
    
    /**
     * 言語設定を読み込む
     * 
     * @param {String} path 言語パス
     * @param {Function} [callback] 言語設定読み込み完了時のコールバック
     * @return {Jeeel.Language} 自クラス
     */
    loadLanguage: function (path, callback) {
        path = ('' + path);
        
        var urlPath = path.replace('.', '/');
        var idx = this._languageDirectories.length - 1;
        
        var url = this._languageDirectories[idx--] + urlPath + '/' + this._locale + '.xml';
        var ajax = Jeeel.Net.Ajax.create(url, 'GET');
        
        var retry = function () {
            if (Jeeel.UNIQUE_ID !== this._uid) {
                return;
            }
            
            if (idx >= 0) {
                url = this._languageDirectories[idx--] + urlPath + '/' + this._locale + '.xml';
                
                ajax.setUrl(url);
                ajax.execute();
            }
        };
        
        ajax.setSuccessMethod(function (response) {
            if (Jeeel.UNIQUE_ID !== this._uid) {
                return;
            }
            
            var xml = new Jeeel.Dom.Xml(response.responseXML || response.responseText);
            var names = path.split('.');
            var hash = this._languages;
            
            if ( ! hash[this._locale]) {
                hash[this._locale] = {};
            }

            hash = hash[this._locale];

            for (var i = 0, l = names.length - 1; i < l; i++) {
                if ( ! Jeeel.Type.isHash(hash[names[i]])) {
                    hash[names[i]] = {};
                }

                hash = hash[names[i]];
            }
            
            hash[names[l]] = xml.toHash().language;
            
            if ( ! Jeeel.Hash.inHash(path, this._loadedPaths, true)) {
                this._loadedPaths.push(path);
            }
            
            callback && callback();
            
        }, this).setFailureMethod(retry, this).setExceptionMethod(retry, this);

        ajax.execute();
        
        return this;
    },
    
    /**
     * 言語設定が存在するかどうかを返す
     * 
     * @param {String} path 言語パス
     * @return {Boolean} 存在するかどうか
     */
    hasLanguage: function (path) {
        var names = ('' + path).split('.');
        
        var hash = this._languages;
        
        if ( ! hash[this._locale]) {
            return false;
        }
        
        hash = hash[this._locale];
        
        for (var i = 0, l = names.length; i < l; i++) {
            if ( ! Jeeel.Type.isHash(hash[names[i]])) {
                return false;
            }
            
            hash = hash[names[i]];
        }
        
        return true;
    },
    
    /**
     * 言語設定を取得する
     * 
     * @param {String} path 言語パス
     * @return {Hash} 言語設定
     */
    getLanguage: function (path) {
        var names = ('' + path).split('.');
        
        var hash = this._languages;
        
        if ( ! hash[this._locale]) {
            return null;
        }
        
        hash = hash[this._locale];
        
        for (var i = 0, l = names.length; i < l; i++) {
            if ( ! Jeeel.Type.isHash(hash[names[i]])) {
                return null;
            }
            
            hash = hash[names[i]];
        }
        
        return hash;
    },
    
    /**
     * ロケールが変わった後に再読み込みを行う
     * 
     * @return {Jeeel.Language} 自クラス
     * @private
     */
    _reloadLanguage: function () {
        
        for (var i = this._loadedPaths.length; i--;) {
            var path = this._loadedPaths[i];
            
            if ( ! this.hasLanguage(path)) {
                this.loadLanguage(path);
            }
        }
        
        return this;
    }
};
