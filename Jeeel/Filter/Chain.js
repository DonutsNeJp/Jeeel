
/**
 * コンストラクタ
 *
 * @class フィルターを複数連結するフィルター
 * @augments Jeeel.Filter.Abstract
 */
Jeeel.Filter.Chain = function () {
  
    Jeeel.Filter.Abstract.call(this);

    this._filters = [];
    this._log = {};
};

/**
 * インスタンスを作成して返す
 *
 * @return {Jeeel.Filter.Chain} 作成したインスタンス
 */
Jeeel.Filter.Chain.create = function () {
    return new this();
};

Jeeel.Filter.Chain.prototype = {
    
    /**
     * 連結フィルター
     * 
     * @type Jeeel.Filter.Abstract[]
     * @private
     */
    _filters: [],
    
    /**
     * フィルターログ
     * 
     * @type Hash
     * @private
     */
    _log: {},
    
    /**
     * フィルターログ使用の可否
     * 
     * @type Boolean
     * @private
     */
    _useLog: false,
    
    /**
     * 連結するフィルタを追加する
     *
     * @param {Jeeel.Filter.Abstract} filter 連結するフィルタ
     * @param {String} [name] 連結するフィルタの名前を指定する(デフォルトは無名)<br />
     *                         名前をしてした場合途中結果を保持する対象に入る
     * @return {Jeeel.Filter.Chain} 自インスタンス
     */
    add: function (filter, name) {
        this._filters[this._filters.length] = {name: name, filter: filter};

        return this;
    },

    /**
     * 途中結果を取得する
     *
     * @return {Hash} 名前のついたフィルターの結果をキーと結果のペア
     */
    getLog: function () {
        return this._log;
    },

    /**
     * 途中結果を保持するかどうかを設定する
     *
     * @param {Boolean} useLog 途中結果を保持するかどうか
     * @return {Jeeel.Filter.Chain} 自インスタンス
     */
    setUseLog: function (useLog) {
        this._useLog = Boolean(useLog);

        return this;
    },
    
    /**
     * @private
     */
    _filter: function (params) {
        throw new Error('このフィルターは配列式が使えないオブジェクトには対応していません。');
    },

    /**
     * @private
     */
    _filterEach: function (params) {
        var log = {};

        for (var i = 0, l = this._filters.length; i < l; i++) {
            var filter = this. _filters[i];

            params = filter.filter.filter(params);

            if (this._useLog && filter.name) {
                log[filter.name] = params;
            }
        }

        this._log = log;

        return params;
    }
};

Jeeel.Class.extend(Jeeel.Filter.Chain, Jeeel.Filter.Abstract);
