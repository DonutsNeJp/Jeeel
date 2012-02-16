Jeeel.directory.Jeeel.Graphics.Vector = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Graphics + 'Vector/';
    }
};

/**
 * コンストラクタ
 * 
 * @class ベクター系のグラフィックス処理機能を提供するクラス
 * @augments Jeeel.Graphics.Abstract
 * @param {Jeeel.Graphics.Vector.*} adapter 内部アダプター
 * @ignore 未完
 */
Jeeel.Graphics.Vector = function (adapter) {
    Jeeel.Graphics.Abstract.call(this);
    
    this._adapter = adapter;
};

/**
 * SVGタイプのインスタンスを作成する
 * 
 * @param {SVG} svg SVGElement
 * @return {Jeeel.Graphics.Vector} 作成したインスタンス
 */
Jeeel.Graphics.Vector.factorySvg = function (svg) {
    return new this(new this.Svg(svg));
};

Jeeel.Graphics.Vector.prototype = {

};

Jeeel.Class.extend(Jeeel.Graphics.Vector, Jeeel.Graphics.Abstract);

Jeeel.file.Jeeel.Graphics.Vector = ['Svg'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Graphics.Vector, Jeeel.file.Jeeel.Graphics.Vector);