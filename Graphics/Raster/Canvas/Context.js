Jeeel.directory.Jeeel.Graphics.Raster.Canvas.Context = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Graphics.Raster.Canvas + 'Context/';
    }
};

/**
 * Canvasのコンテキストに関するネームスペース
 */
Jeeel.Graphics.Raster.Canvas.Context = {
    
    /**
     * canvasのコンテキストを取得する
     * 
     * @param {Canvas} canvas キャンバスElement
     * @param {String} contextId コンテキストの種類を示す定数文字列
     * @return {Jeeel.Graphics.Raster.Canvas.Context.2d} コンテキスト
     */
    getContext: function (canvas, contextId) {
        return new this[contextId](canvas);
    },
    
    /**
     * コンストラクタ
     * 
     * @class 2次元のグラフィックスを扱うクラス
     * @param {Canvas} canvas キャンバスElement
     * @constructor
     */
    '2d': function (canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._pen = new Jeeel.Graphics.Pen();
        this._brush = new Jeeel.Graphics.Brush();
        this._font = new Jeeel.Object.Font('sans-serif', '10px');
        
        var self = this, rp = this._refreshPen, rb = this._refreshBrush;
        
        this._refreshPen = function () {
            rp.apply(self, arguments);
        };
        
        this._refreshBrush = function () {
            rb.apply(self, arguments);
        };
        
        this._pen.setRefreshCallback(this._refreshPen);
        this._brush.setRefreshCallback(this._refreshBrush);
        
        this._context.textAlign = 'left';
        this._context.textBaseline = 'top';
    }
};

Jeeel.Graphics.Raster.Canvas.Context['2d'].prototype = {
  
    /**
     * キャンバス
     * 
     * @type Canvas
     * @private
     */
    _canvas: null,
  
    /**
     * キャンバスコンテキスト
     * 
     * @type CanvasRenderingContext2D
     * @private
     */
    _context: null,
    
    /**
     * Penオブジェクト
     * 
     * @type Jeeel.Graphics.Pen
     * @private
     */
    _pen: null,
    
    /**
     * Brushオブジェクト
     * 
     * @type Jeeel.Graphics.Brush
     * @private
     */
    _brush: null,
    
    /**
     * Fontオブジェクト
     * 
     * @type Jeeel.Object.Font
     * @private
     */
    _font: null,
    
    /**
     * 線を描画する際のペンを取得する
     * 
     * @return {Jeeel.Graphics.Pen} Penオブジェクト
     */
    getPen: function () {
        return this._pen;
    },
    
    /**
     * 線を描画する際のペンを設定する
     * 
     * @param {Jeeel.Graphics.Pen} pen Penオブジェクト
     */
    setPen: function (pen) {
        this._pen.setRefreshCallback(null);
        this._pen = pen.setRefreshCallback(this._refreshPen).refresh();
    },
    
    /**
     * 面を塗りつぶすためのブラシを取得する
     * 
     * @return {Jeeel.Graphics.Brush} Brushオブジェクト
     */
    getBrush: function () {
        return this._brush;
    },
    
    /**
     * 面を塗りつぶすためのブラシを設定する
     * 
     * @param {Jeeel.Graphics.Brush} brush Brushオブジェクト
     */
    setBrush: function (brush) {
        this._brush.setRefreshCallback(null);
        this._brush = brush.setRefreshCallback(this._refreshPen).refresh();
    },
    
    /**
     * 文字を描くためのフォントを取得する
     * 
     * @return {Jeeel.Object.Font} フォント
     */
    getFont: function () {
        return this._font;
    },
    
    /**
     * 文字を描くためのフォントを設定する
     * 
     * @param {Jeeel.Object.Font} font フォント
     */
    setFont: function (font) {
        this._font = font;
    },
    
    /**
     * 線を描画する
     * 
     * @param {Number} x1 一つ目の座標X
     * @param {Number} y1 一つ目の座標Y
     * @param {Number} x2 二つ目の座標X
     * @param {Number} y2 二つ目の座標Y
     */
    drawLine: function (x1, y1, x2, y2) {
        this._context.beginPath();
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.stroke();
    },
    
    /**
     * 長方形を描画する
     * 
     * @param {Number} x 座標X
     * @param {Number} y 座標Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     */
    strokeRect: function (x, y, width, height) {
        this._context.strokeRect(x, y, width, height);
    },
    
    /**
     * 長方形を描画し塗りつぶす
     * 
     * @param {Number} x 座標X
     * @param {Number} y 座標Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     */
    fillRect: function (x, y, width, height) {
        this._context.fillRect(x, y, width, height);
    },
    
    /**
     * 長方形のパス内をクリッピング対象にする
     * 
     * @param {Number} x 座標X
     * @param {Number} y 座標Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    clipRect: function (x, y, width, height) {
        this._context.beginPath();
        this._context.rect(x, y, width, height);
        this._context.clip();
    },
    
    /**
     * 指定した頂点リストから多角形を描画する
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     */
    strokePolygon: function (vertexes) {
        this._drawPolygonPath(vertexes);
        this._context.stroke();
    },
    
    /**
     * 指定した頂点リストから多角形を描画し塗りつぶす
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     */
    fillPolygon: function (vertexes) {
        this._drawPolygonPath(vertexes);
        this._context.fill();
    },
    
    /**
     * 指定した頂点リストから多角形のパスを作り、その範囲をクリッピング対象にする
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    clipPolygon: function (vertexes) {
        this._drawPolygonPath(vertexes);
        this._context.clip();
    },
    
    /**
     * 楕円を描画する
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     */
    strokeEllipse: function (x, y, radiusX, radiusY) {
        this._drawEllipsePath(x, y, radiusX, radiusY);
        this._context.stroke();
    },
    
    /**
     * 楕円を描画し塗りつぶす
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     */
    fillEllipse: function (x, y, radiusX, radiusY) {
        this._drawEllipsePath(x, y, radiusX, radiusY);
        this._context.fill();
    },
    
    /**
     * 楕円のパスを作り、その内部をクリッピング対象にする
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    clipEllipse: function (x, y, radiusX, radiusY) {
        this._drawEllipsePath(x, y, radiusX, radiusY);
        this._context.clip();
    },
    
    /**
     * 文字列を描画する
     * 
     * @param {String} text 描画文字
     * @param {Number} x X座標
     * @param {Number} y Y座標
     */
    strokeText: function (text, x, y) {
        this._context.font = this._font.toString();
        this._context.strokeText(text, x, y);
    },
    
    /**
     * 文字列を描画して塗りつぶす
     * 
     * @param {String} text 描画文字
     * @param {Number} x X座標
     * @param {Number} y Y座標
     */
    fillText: function (text, x, y) {
        this._context.font = this._font.toString();
        this._context.fillText(text, x, y);
    },
    
    /**
     * 扇形を描画する
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @param {Number} startAngle 円弧の始点の角度(ラジアン)
     * @param {Number} endAngle 円弧の終点の角度(ラジアン)
     */
    strokePie: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        this._drawArcPath(x, y, radiusX, radiusY, startAngle, endAngle, true);
        this._context.stroke();
    },
    
    /**
     * 扇形を描画して塗りつぶす
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @param {Number} startAngle 円弧の始点の角度(ラジアン)
     * @param {Number} endAngle 円弧の終点の角度(ラジアン)
     */
    fillPie: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        this._drawArcPath(x, y, radiusX, radiusY, startAngle, endAngle, true);
        this._context.fill();
    },
    
    /**
     * 楕円弧を描画する
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @param {Number} startAngle 円弧の始点の角度(ラジアン)
     * @param {Number} endAngle 円弧の終点の角度(ラジアン)
     */
    drawArc: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        this._drawArcPath(x, y, radiusX, radiusY, startAngle, endAngle);
        this._context.stroke();
    },
    
    /**
     * イメージを描画する
     * 
     * @param {Image} image 描画イメージ
     * @param {Number} imageX イメージ座標X
     * @param {Number} imageY イメージ座標Y
     * @param {Number} imageWidth 切り抜くイメージ幅
     * @param {Number} imageHeight 切り抜くイメージ高さ
     * @param {Number} drawX 描画座標X
     * @param {Number} drawY 描画座標Y
     * @param {Number} drawWidth 描画する幅
     * @param {Number} drawHeight 描画する高さ
     */
    drawImage: function (image, imageX, imageY, imageWidth, imageHeight, drawX, drawY, drawWidth, drawHeight) {
        switch (arguments.length) {
            case 3:
                this._context.drawImage(image, imageX, imageY);
                break;
                
            case 5:
                this._context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
                break;
                
            case 9:
                this._context.drawImage(image, imageX, imageY, imageWidth, imageHeight, drawX, drawY, drawWidth, drawHeight);
                break;
                
            default:
                this._context.drawImage.apply(this._context, arguments);
                break;
        }
    },
    
    /**
     * 描画されている全ての図形を消去する
     */
    clear: function () {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    },
    
    /**
     * Penの更新時に呼ばれるコールバック
     * 
     * @param {Jeeel.Graphics.Pen} pen ペン
     * @param {Integer} type 更新タイプ
     */
    _refreshPen: function (pen, type) {
        switch (type) {
            case 0:
                this._context.lineWidth = pen.getWidth();
                this._context.strokeStyle = pen.getColor().toRgb().toRgbaString();
                this._context.lineCap = pen.getCapStyle();
                this._context.lineJoin = pen.getJoinStyle();
                this._context.miterLimit = pen.getMiterLimit();
                break;
                
            case 1:
                this._context.lineWidth = pen.getWidth();
                break;
                
            case 2:
                this._context.strokeStyle = pen.getColor().toRgb().toRgbaString();
                break;
                
            case 3:
                this._context.lineCap = pen.getCapStyle();
                break;
                
            case 4:
                this._context.lineJoin = pen.getJoinStyle();
                break;
                
            case 5:
                this._context.miterLimit = pen.getMiterLimit();
                break;
                
            default:
                break;
        }
    },
    
    /**
     * Brushの更新時に呼ばれるコールバック
     * 
     * @param {Jeeel.Graphics.Brush} brush ブラシ
     * @param {Integer} type 更新タイプ
     */
    _refreshBrush: function (brush, type) {
        switch (type) {
            case 0:
                this._context.fillStyle = brush.getColor().toRgb().toRgbaString();
                break;
                
            case 1:
                this._context.fillStyle = brush.getColor().toRgb().toRgbaString();
                break;
                
            default:
                break;
        }
    },
    
    /**
     * 多角形を描画する際のパスを設定する
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト
     */
    _drawPolygonPath: function (vertexes) {
        var v = vertexes[0];
        
        this._context.beginPath();
        this._context.moveTo(v.x, v.y);
        
        for (var i = vertexes.length; i--;) {
            v = vertexes[i];
            
            this._context.lineTo(v.x, v.y);
        }

        this._context.closePath();
    },
    
    /**
     * 楕円のパスを描画する
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     */
    _drawEllipsePath: function (x, y, radiusX, radiusY) {
        var top = y - radiusY;
        var left = x - radiusX;
        var bottom = y + radiusY;
        var right = x + radiusX;
        
        var cw = 4.0 * (Math.SQRT2 - 1.0) * radiusX / 3.0;
        var ch = 4.0 * (Math.SQRT2 - 1.0) * radiusY / 3.0;
        
        this._context.beginPath();

        this._context.moveTo(x, top);
        this._context.bezierCurveTo(x + cw, top, right, y - ch, right, y);
        this._context.bezierCurveTo(right, y + ch, x + cw, bottom, x, bottom);
        this._context.bezierCurveTo(x - cw, bottom, left, y + ch, left, y);
        this._context.bezierCurveTo(left, y - ch, x - cw, top, x, top);
        this._context.closePath();
    },
    
    /**
     * 楕円弧のパスを描画する
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @param {Number} startAngle 円弧の始点の角度(ラジアン)
     * @param {Number} endAngle 円弧の終点の角度(ラジアン)
     * @param {Boolean} [isPie] 扇形かどうか
     */
    _drawArcPath: function (x, y, radiusX, radiusY, startAngle, endAngle, isPie) {
        var largeFlag = true, 
            sweepFlag = true, 
            PI2 = Math.PI * 2;
        
        if (startAngle > endAngle) {
            sweepFlag = false;
        }
        
        if (Math.abs(endAngle - startAngle) < Math.PI) {
            largeFlag = false;
        }
        
        while (startAngle < 0) {
            startAngle += PI2;
        }

        while (startAngle > PI2) {
            startAngle -= PI2;
        }

        while (endAngle < 0) {
            endAngle += PI2;
        }
        
        while (endAngle > PI2) {
            endAngle -= PI2;
        }
        
        if (Math.abs(endAngle - startAngle) >= PI2) {
            this._drawEllipsePath(x, y, radiusX, radiusY);
            return;
        }
        
        startAngle = PI2 - startAngle;
        endAngle = PI2 - endAngle;
        
        var sx = radiusX * Math.cos(startAngle);
        var sy = radiusY * Math.sin(startAngle);
        var ex = radiusX * Math.cos(endAngle);
        var ey = radiusY * Math.sin(endAngle);
        
        var cw = (radiusX * Math.cos(endAngle / 2 + startAngle) - sx / 2 - ex / 8) * 8 / 3;
        var ch = (radiusY * Math.sin(endAngle / 2 + startAngle) - ey / 2 - sy / 8) * 8 / 3;
        
        this._context.beginPath();
        this._context.moveTo(x + sx, y - sy);
        this._context.bezierCurveTo(x + sx, y - ch, x + cw, y - ey, x + ex, y - ey);
        this._context.stroke();
        
        console.log([sx + x, y - sy], [sx + x, y - ch], [x - cw, y - ey], [ex + x, y - ey], cw, ch);
    }
};

Jeeel.file.Jeeel.Graphics.Raster.Canvas.Context = ['Type'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Graphics.Raster.Canvas.Context, Jeeel.file.Jeeel.Graphics.Raster.Canvas.Context);