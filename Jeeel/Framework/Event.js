Jeeel.directory.Jeeel.Framework.Event = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Framework + 'Event/';
    }
};

/**
 * コンストラクタ
 * 
 * @class イベントを管理するクラス<br />
 *         イベントの伝播は最上層からキャプチャリング段階に入り発生地点までたどる<br />
 *         発生地点でターゲティング段階になり、バブリング段階になって最上層に向かって上っていく<br />
 *         最後にフォーリング段階になり発生地点から最下層まで全ての要素に伝播していく
 * @param {String} type イベントタイプ
 * @param {Boolean} [bubbles=true] バブリング処理をするかどうか(上位伝播)
 * @param {Boolean} [falls] フォーリング処理をするかどうか(下位伝播)
 * @param {Boolean} [cancelable] デフォルト動作をキャンセル出来るかどうか(存在しない場合や出来ない場合がfalse)
 */
Jeeel.Framework.Event = function (type, bubbles, falls, cancelable) {
    this._type = type;
    this._bubbles = !!(bubbles === false ? bubbles : bubbles || true);
    this._falls = !!falls;
    this._cancelable = !!cancelable;
    this._captureTargets = [];
};

Jeeel.Framework.Event.prototype = {
  
    /**
     * イベントタイプ
     * 
     * @type String
     * @protected
     */
    _type: '',
    
    /**
     * 上階層の要素にバブリングフローをするかどうか
     * 
     * @type Boolean
     * @protected
     */
    _bubbles: true,
    
    /**
     * 下階層の要素にフォーリングフローするかどうか
     * 
     * @type Boolean
     * @protected
     */
    _falls: false,
    
    /**
     * デフォルトの動作をキャンセル出来るかどうか
     * 
     * @type Boolean
     * @protected
     */
    _cancelable: false,
    
    /**
     * デフォルトの挙動をキャンセルしたかどうか
     * 
     * @type Boolean
     * @protected
     */
    _cancelDefault: false,
    
    /**
     * イベントのハンドリングをキャンセルしたかどうか
     * 
     * @type Boolean
     * @protected
     */
    _cancelHandle: false,
    
    /**
     * イベントの伝播をキャンセルしたかどうか
     * 
     * @type Boolean
     * @protected
     */
    _cancelFlow: false,
    
    /**
     * イベントフェーズ
     * 
     * @type Integer
     * @protected
     */
    _phase: 1,
    
    /**
     * キャプチャ段階で使用する対象リスト
     * 
     * @type Object[]
     * @protected
     */
    _captureTargets: [],
    
    /**
     * イベント発生対象
     * 
     * @type Object
     * @protected
     */
    _target: null,
    
    /**
     * イベントハンドリング対象
     * 
     * @type Object
     * @protected
     */
    _currentTarget: null,
    
    /**
     * イベントタイプを取得する
     * 
     * @return {String} イベントタイプ
     */
    getType: function () {
        return this._type;
    },
    
    /**
     * バブリング処理をするかどうかを返す
     * 
     * @return {Boolean} バブリング処理をするかどうか
     */
    getBubbles: function () {
        return this._bubbles;
    },
    
    /**
     * フォーリング段階をするかどうかを返す
     * 
     * @return {Boolean} フォーリング処理をするかどうか
     */
    getFalls: function () {
        return this._falls;
    },
    
    /**
     * 現在のイベントフェーズを示す定数を取得する
     * 
     * @return {Integer} イベントフェーズ定数
     */
    getEventPhase: function () {
        return this._phase;
    },
    
    /**
     * イベント発生対象を取得する
     * 
     * @return {Object} イベント発生対象
     */
    getTarget: function () {
        return this._target;
    },
    
    /**
     * イベントハンドリング対象を取得する
     * 
     * @return {Object} イベントハンドリング対象
     */
    getCurrentTarget: function () {
        return this._currentTarget;
    },
    
    /**
     * イベントのデフォルトの動作がキャンセル出来るかどうかを返す
     * 
     * @return {Boolean} キャンセル出来るかどうか
     */
    isCancelable: function () {
        return this._cancelable;
    },
    
    /**
     * デフォルトの挙動がキャンセルされたかどうかを返す
     * 
     * @return {Boolean} キャンセルされたかどうか
     */
    isDefaultPrevented: function () {
        return this._cancelDefault;
    },
    
    /**
     * イベントのデフォルトの動作をキャンセルする<br />
     * デフォルトの挙動のキャンセルが許可されていない場合は無意味
     * 
     * @return {Jeeel.Framework.Event} 自インスタンス
     */
    preventDefault: function () {
        if (this._cancelable) {
            this._cancelDefault = true;
        }
        
        return this;
    },
    
    /**
     * イベントの伝播を止める
     * 
     * @return {Jeeel.Framework.Event} 自インスタンス
     */
    stopPropagation: function () {
        this._cancelFlow = true;
        
        return this;
    },
    
    /**
     * イベントの伝播とハンドリングを止める
     * 
     * @return {Jeeel.Framework.Event} 自インスタンス
     */
    stopImmediatePropagation: function () {
        this._cancelFlow = this._cancelHandle = true;
        
        return this;
    },
    
    /**
     * イベントの伝播、ハンドリング、デフォルトの挙動全てを停止する
     * 
     * @return {Jeeel.Framework.Event} 自インスタンス
     */
    stop: function () {
        this._cancelDefault = this._cancelFlow = this._cancelHandle = true;
        
        return this;
    },
    
    /**
     * 複製を行う
     * 
     * @param {Boolean} [dispatchable] ディスパッチ済みのインスタンスを複製した際にディスパッチ出来るようにするかどうか
     * @return {Jeeel.Framework.Event} 複製したインスタンス
     */
    clone: function (dispatchable) {
        var instance = new this.constructor(this._type, this._bubbles, this._cancelable);
        
        for (var key in this) {
            if ( ! Jeeel.Type.isFunction(this[key])) {
                instance[key] = this[key];
            }
        }
        
        for (var i = this._captureTargets.length; i--;) {
            instance._captureTargets[i] = this._captureTargets[i];
        }
        
        if (dispatchable) {
            instance._phase = 1;
            instance._target = null;
        }
        
        return instance;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Framework.Event
};

Jeeel.file.Jeeel.Framework.Event = ['Phase', 'Type'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework.Event, Jeeel.file.Jeeel.Framework.Event);
