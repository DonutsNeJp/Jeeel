Jeeel.directory.Jeeel.Graphics.Raster.Canvas = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Graphics.Raster + 'Canvas/';
    }
};

/**
 * Canvasに関してのネームスペース
 */
Jeeel.Graphics.Raster.Canvas = {
  
    /**
     * キャンバスの操作インスタンスの作成を行う
     * 
     * @param {Canvas} canvas キャンバス
     * @param {String} [contextId] コンテキストID
     * @return {Jeeel.Graphics.Raster.Canvas.Context.*} 作成したインスタンス
     */
    factory: function (canvas, contextId) {
        return this.Context.getContext(canvas, contextId || this.Context.Type.TWO_DIMENSION);
    }
};

Jeeel.file.Jeeel.Graphics.Raster.Canvas = ['Context'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Graphics.Raster.Canvas, Jeeel.file.Jeeel.Graphics.Raster.Canvas);