Jeeel.directory.Jeeel.Dom.Event.Rollover = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Event + 'Rollover/';
    }
};

/**
 * コンストラクタ
 * 
 * @class ロールバーに関するクラス
 */
Jeeel.Dom.Event.Rollover = function () {
    
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Dom.Event.Rollover} 作成したインスタンス
 */
Jeeel.Dom.Event.Rollover.create = function () {
    return new this();
};

Jeeel.Dom.Event.Rollover.prototype = {
  
    /**
     * ロールオーバーハンドラ
     * 
     * @type Function
     * @private
     */
    _on: null,
    
    /**
     * ロールアウトハンドラ
     * 
     * @type Function
     * @private
     */
    _off: null,
    
    /**
     * ロールオーバー時のハンドラを設定する
     * 
     * @param {Function} handler ハンドラ
     * @return {Jeeel.Dom.Event.Rollover} 自インスタンス
     */
    setRollover: function (handler) {
        this._on = handler;
        
        return this;
    },
    
    /**
     * ロールアウト時のハンドラを設定する
     * 
     * @param {Function} handler ハンドラ
     * @return {Jeeel.Dom.Event.Rollover} 自インスタンス
     */
    setRollout: function (handler) {
        this._off = handler;
        
        return this;
    },
    
    /**
     * ロールオーバーを指定したElementに適用する
     * 
     * @param {Element|Element[]} elements ElementまたはElementリスト
     * @return {Jeeel.Dom.Event.Rollover} 自インスタンス
     */
    rollover: function (elements) {
        if (Jeeel.Type.isElement(elements)) {
            elements = [elements];
        }
        
        if ( ! Jeeel.Type.isArray(elements)) {
            throw new Error('引数が間違っています。');
        }
        
        for (var i = elements.length; i--;) {
            
            elements[i].onmouseover = this._on;
            elements[i].onmouseout = this._off;
        }
        
        return this;
    }
};

Jeeel.file.Jeeel.Dom.Event.Rollover = ['Image'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Event.Rollover, Jeeel.file.Jeeel.Dom.Event.Rollover);
