
/**
 * コンストラクタ
 * 
 * @abstractClass グラフィックス関連に抽象クラス
 */
Jeeel.Graphics.Abstract = function () {
    
};

Jeeel.Graphics.Abstract.prototype = {
  
    /**
     * 実際の操作を保持するインスタンス
     * 
     * @type Object
     * @private
     */
    _adapter: null,
    
    /**
     * 線を描画する際のペンを取得する
     * 
     * @return {Jeeel.Graphics.Pen} Penオブジェクト
     */
    getPen: function () {
        return this._adapter.getPen();
    },
    
    /**
     * 線を描画する際のペンを設定する<br />
     * getで取得したPenを変更した時はsetしないと反映されない
     * 
     * @param {Jeeel.Graphics.Pen} pen Penオブジェクト
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    setPen: function (pen) {
        this._adapter.setPen(pen);
        
        return this;
    },
    
    /**
     * 面を塗りつぶすためのブラシを取得する<br />
     * getで取得したBrushを変更した時はsetしないと反映されない
     * 
     * @return {Jeeel.Graphics.Brush} Brushオブジェクト
     */
    getBrush: function () {
        return this._adapter.getBrush();
    },
    
    /**
     * 面を塗りつぶすためのブラシを設定する
     * 
     * @param {Jeeel.Graphics.Brush} brush Brushオブジェクト
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    setBrush: function (brush) {
        this._adapter.setBrush(brush);
        
        return this;
    },
    
    /**
     * 文字を描くためのフォントを取得する
     * 
     * @return {Jeeel.Object.Font} フォント
     */
    getFont: function () {
        return this._adapter.getFont();
    },
    
    /**
     * 文字を描くためのフォントを設定する
     * 
     * @param {Jeeel.Object.Font} font フォント
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    setFont: function (font) {
        this._adapter.setFont(font);
        
        return this;
    },
    
    /**
     * 線を描画する
     * 
     * @param {Number} x1 一つ目の座標X
     * @param {Number} y1 一つ目の座標Y
     * @param {Number} x2 二つ目の座標X
     * @param {Number} y2 二つ目の座標Y
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    drawLine: function (x1, y1, x2, y2) {
        this._adapter.drawLine(x1, y1, x2, y2);
        
        return this;
    },
    
    /**
     * 長方形を描画する
     * 
     * @param {Number} x 座標X
     * @param {Number} y 座標Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    strokeRect: function (x, y, width, height) {
        this._adapter.strokeRect(x, y, width, height);
        
        return this;
    },
    
    /**
     * 長方形を描画し塗りつぶす
     * 
     * @param {Number} x 座標X
     * @param {Number} y 座標Y
     * @param {Number} width 幅
     * @param {Number} height 高さ
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    fillRect: function (x, y, width, height) {
        this._adapter.fillRect(x, y, width, height);
        
        return this;
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
        this._adapter.clipRect(x, y, width, height);
        
        return this;
    },
    
    /**
     * 指定した頂点リストから多角形を描画する
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    strokePolygon: function (vertexes) {
        if ( ! Jeeel.Type.isArray(vertexes)) {
            throw new Error('vertexesが配列ではありません。');
        } else if (vertexes.length < 3) {
            throw new Error('vertexesが必要数に達していません。');
        }
        
        this._adapter.strokePolygon(vertexes);
        
        return this;
    },
    
    /**
     * 指定した頂点リストから多角形を描画し塗りつぶす
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    fillPolygon: function (vertexes) {
        if ( ! Jeeel.Type.isArray(vertexes)) {
            throw new Error('vertexesが配列ではありません。');
        } else if (vertexes.length < 3) {
            throw new Error('vertexesが必要数に達していません。');
        }
        
        this._adapter.fillPolygon(vertexes);
        
        return this;
    },
    
    /**
     * 指定した頂点リストから多角形のパスを作り、その範囲をクリッピング対象にする
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    clipPolygon: function (vertexes) {
        if ( ! Jeeel.Type.isArray(vertexes)) {
            throw new Error('vertexesが配列ではありません。');
        } else if (vertexes.length < 3) {
            throw new Error('vertexesが必要数に達していません。');
        }
        
        this._adapter.clipPolygon(vertexes);
        
        return this;
    },
    
    /**
     * 楕円を描画する
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    strokeEllipse: function (x, y, radiusX, radiusY) {
        this._adapter.strokeEllipse(x, y, radiusX, radiusY);
        
        return this;
    },
    
    /**
     * 楕円を描画し塗りつぶす
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    fillEllipse: function (x, y, radiusX, radiusY) {
        this._adapter.fillEllipse(x, y, radiusX, radiusY);
        
        return this;
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
        this._adapter.clipEllipse(x, y, radiusX, radiusY);
        
        return this;
    },
    
    /**
     * 文字列を描画する
     * 
     * @param {String} text 描画文字
     * @param {Number} x X座標
     * @param {Number} y Y座標
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    strokeText: function (text, x, y) {
        this._adapter.strokeText(text, x, y);
        
        return this;
    },
    
    /**
     * 文字列を描画して塗りつぶす
     * 
     * @param {String} text 描画文字
     * @param {Number} x X座標
     * @param {Number} y Y座標
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    fillText: function (text, x, y) {
        this._adapter.fillText(text, x, y);
        
        return this;
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
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    strokePie: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        this._adapter.strokePie(x, y, radiusX, radiusY, startAngle, endAngle);
        
        return this;
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
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    fillPie: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        this._adapter.fillPie(x, y, radiusX, radiusY, startAngle, endAngle);
        
        return this;
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
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    drawArc: function (x, y, radiusX, radiusY, startAngle, endAngle) {
        this._adapter.drawArc(x, y, radiusX, radiusY, startAngle, endAngle);
        
        return this;
    },
    
    /**
     * イメージを描画する
     * 
     * @param {Image} image 描画イメージ
     * @param {Number} x 座標X
     * @param {Number} y 座標Y
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    drawImage: function (image, x, y) {},
    
    /**
     * 描画されている全ての図形を消去する
     * 
     * @return {Jeeel.Graphics.Abstract} 自インスタンス
     */
    clear: function () {
        this._adapter.clear();
        
        return this;
    }
};

/**
 * イメージを描画する
 * 
 * @param {Image} image 描画イメージ
 * @param {Jeeel.Object.Point} point 描画先座標
 * @return {Jeeel.Graphics.Abstract} 自インスタンス
 */
Jeeel.Graphics.Abstract.prototype.drawImage = function (image, point) {};

/**
 * イメージを描画する
 * 
 * @param {Image} image 描画イメージ
 * @param {Jeeel.Object.Rect} rect 描画先矩形
 * @return {Jeeel.Graphics.Abstract} 自インスタンス
 */
Jeeel.Graphics.Abstract.prototype.drawImage = function (image, rect) {};

/**
 * イメージを描画する
 * 
 * @param {Image} image 描画イメージ
 * @param {Number} x 描画座標X
 * @param {Number} y 描画座標Y
 * @param {Number} width 描画する幅
 * @param {Number} height 描画する高さ
 * @return {Jeeel.Graphics.Abstract} 自インスタンス
 */
Jeeel.Graphics.Abstract.prototype.drawImage = function (image, x, y, width, height) {
    
    switch (arguments.length) {
        case 2:
            if (x instanceof Jeeel.Object.Point) {
                this._adapter.drawImage(image, x.x, x.y);
            } else {
                this._adapter.drawImage(image, x.x, x.y, x.width, x.height);
            }
            break;
            
        case 3:
            this._adapter.drawImage(image, x, y);
            break;
            
        case 5:
            this._adapter.drawImage(image, x, y, width, height);
            break;
    }
    
    return this;
};
