
Jeeel.directory.Jeeel.Config = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Config/';
    }
};

(function () {
    
    var cash = {};
    var creating = false;
    
    /**
     * コンストラクタ
     * 
     * @class 簡易設定ファイルを管理するクラス(for-inでループも可能)
     * @param {Jeeel.Dom.Xml} xml 軽量ファイルを読み込んだXMLインスタンス
     * @example
     * コンフィグファイルの書式例
     * -----------------------------------------------------
     * <?xml version="1.0" encoding="UTF-8"?>
     * <config>
     *   <url>http://Jeeel.co.jp/test.js</url>
     *   <enable>1</enable>
     * </config>
     * -----------------------------------------------------
     * 
     * // 上記のファイルを読み込む
     * var conf = Jeeel.Config.load(url);
     * 
     * //conf.url => http://Jeeel.co.jp/test.js
     * //conf.enable => 1
     * 
     * var vals = [];
     * 
     * for (var key in conf) {
     *     vals[vals.length] = {name: key, value: conf[key]};
     * }
     * 
     * vals => [{name: 'url', value: 'http://Jeeel.co.jp/test.js'}, {name: 'enable', value: '1'}]
     */
    Jeeel.Config = function (xml) {
        
        if (creating) {
            this._init(xml);
        } else {
          
            if ( ! (xml instanceof Jeeel.Dom.Xml)) {
                throw new Error('xmlがJeeel.Dom.Xmlインスタンスではありません。');
            }
            
            creating = true;
            
            this._init(xml.config);
            
            creating = false;
        }
    };
    
    /**
     * コンフィグファイルの読み込みを行う<br />
     * キャッシングも行い同じコンフィグへのアクセスは早くなる
     * 
     * @param {String} url コンフィグへのURL
     * @return {Jeeel.Config} コンフィグ
     */
    Jeeel.Config.load = function(url) {
        if (cash[url]) {
            return cash[url];
        }
        
        return cash[url] = new this(Jeeel.Dom.Xml.load(url));
    };
})();

Jeeel.Config.prototype = {
    
    /**
     * 初期化
     * 
     * @param {Jeeel.Dom.Xml.Node[]|Jeeel.Dom.Xml.Node} node ノード
     * @private
     */
    _init: function (node) {
        delete this._init;
        
        if ( ! (node instanceof Jeeel.Dom.Xml.Node)) {
            
            if (node.length !== 1) {
                throw new Error('コンフィグの同階層に同じ名前の要素が存在します。');
            }
            
            node = node[0];
        }
        
        if (node.getNamespace()) {
            throw new Error('コンフィグに名前空間が使用されています。');
        }
        
        var setProperty = false;
        
        for (var key in node) {
            var property = node[key];
            
            if ( ! (key in Jeeel.Dom.Xml.Node.prototype) && property) {
                this[key] = new Jeeel.Config(property);
                setProperty = true;
            }
        }
        
        if ( ! setProperty) {
            var value = node.getValue() || '';
            
            this.valueOf = function () {
                return value;
            };
        }
    }
};