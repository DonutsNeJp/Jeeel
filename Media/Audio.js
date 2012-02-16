
/**
 * コンストラクタ
 * 
 * @class オーディオを扱うクラス
 * @augments Jeeel.Media.Abstract
 * @param {Audio} audio 基となるオーディオ要素
 */
Jeeel.Media.Audio = function (audio) {
    Jeeel.Media.Abstract.call(this, audio);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Audio} audio 基となるオーディオ要素
 * @return {Jeeel.Media.Audio} 作成したインスタンス
 */
Jeeel.Media.Audio.create = function (audio) {
    return new this(audio);
};

Jeeel.Media.Audio.prototype = new Jeeel.Media.Abstract();
