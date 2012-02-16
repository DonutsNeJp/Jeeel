
/**
 * コンストラクタ
 *
 * @class オブジェクトの情報を保持する構造体
 * @param {String} name オブジェクト名
 * @param {Mixied} parent 親オブジェクト
 */
Jeeel.Object.Technical.Information = function (name, parent) {
    var self = this;
    self.name = name;
    self.parent = parent;
};

Jeeel.Object.Technical.Information.prototype = {

    /**
     * オブジェクト名
     *
     * @type String
     */
    name: '',

    /**
     * オブジェクトの親
     *
     * @type Mixied
     */
    parent: ''
};
