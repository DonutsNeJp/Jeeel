Jeeel.directory.Jeeel.Graphics.Raster = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Graphics + 'Raster/';
    }
};

/**
 * コンストラクタ
 * 
 * @class ラスター系のグラフィックス処理機能を提供するクラス
 * @augments Jeeel.Graphics.Abstract
 * @param {Jeeel.Graphics.Raster.*} adapter 内部アダプター
 */
Jeeel.Graphics.Raster = function (adapter) {
    Jeeel.Graphics.Abstract.call(this);
    
    this._adapter = adapter;
};

/**
 * Canvasタイプのインスタンスを作成する
 * 
 * @param {Canvas} canvas キャンバスElement
 * @param {String} [contextId] コンテキストID
 * @return {Jeeel.Graphics.Raster} 作成したインスタンス
 */
Jeeel.Graphics.Raster.factoryCanvas = function (canvas, contextId) {
    return new this(this.Canvas.factory(canvas, contextId));
};

Jeeel.Graphics.Raster.prototype = {
  
    /**
     * 未実装
     */
    strokePie: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        throw new Error('未実装');
    },
    
    /**
     * 未実装
     */
    fillPie: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        throw new Error('未実装');
    },
    
    /**
     * 未実装
     */
    drawArc: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        throw new Error('未実装');
    }
};

Jeeel.Class.extend(Jeeel.Graphics.Raster, Jeeel.Graphics.Abstract);

Jeeel.file.Jeeel.Graphics.Raster = ['Canvas'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Graphics.Raster, Jeeel.file.Jeeel.Graphics.Raster);
