
Jeeel.Graphics.Vector.Svg = function (svg) {
    this._svg = svg;
    this._doc = Jeeel.Dom.Document.create(svg.ownerDocument);
    this._pen = new Jeeel.Graphics.Pen();
    this._brush = new Jeeel.Graphics.Brush();
    this._font = new Jeeel.Object.Font('sans-serif');
};

Jeeel.Graphics.Vector.Svg.prototype = {
    /**
     * ドキュメント
     * 
     * @type Jeeel.Dom.Document
     * @private
     */
    _doc: null,
    
    /**
     * SVGElement
     * 
     * @type SVGElement
     */
    _svg: null,
    
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
        var line = this._createSvgElement('line');
        
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        
        this._setStroke(line);
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
        var rect = this._createSvgElement('rect');
        
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        
        this._setStroke(rect);
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
        var rect = this._createSvgElement('rect');
        
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        
        this._setFill(rect);
    },
    
    /**
     * 指定した頂点リストから多角形を描画する
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     */
    strokePolygon: function (vertexes) {
        var polygon = this._createSvgElement('polygon');
        
        polygon.setAttribute('points', this._getPolygonPoints(vertexes));
        
        this._setStroke(polygon);
    },
    
    /**
     * 指定した頂点リストから多角形を描画し塗りつぶす
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト(最低3点必要、最後の点と最初の点は自動的に閉じられる)
     */
    fillPolygon: function (vertexes) {
        var polygon = this._createSvgElement('polygon');
        
        polygon.setAttribute('points', this._getPolygonPoints(vertexes));
        
        this._setFill(polygon);
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
        var ellipse = this._createSvgElement('ellipse');
        
        ellipse.setAttribute('cx', x);
        ellipse.setAttribute('cy', y);
        ellipse.setAttribute('rx', radiusX);
        ellipse.setAttribute('ry', radiusY);
        
        this._setStroke(ellipse);
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
        var ellipse = this._createSvgElement('ellipse');
        
        ellipse.setAttribute('cx', x);
        ellipse.setAttribute('cy', y);
        ellipse.setAttribute('rx', radiusX);
        ellipse.setAttribute('ry', radiusY);
        
        this._setFill(ellipse);
    },
    
    /**
     * 文字列を描画する
     * 
     * @param {String} text 描画文字
     * @param {Number} x X座標
     * @param {Number} y Y座標
     */
    strokeText: function (text, x, y) {
        var svgText = this._createSvgElement('text');
        
        svgText.setAttribute('x', x);
        svgText.setAttribute('font-size', this._font.size);
        svgText.setAttribute('font-family', this._font.family.join(','));
        svgText.setAttribute('font-style', this._font.style);
        svgText.setAttribute('font-weight', this._font.weight);
        
        svgText.appendChild(this._doc.createTextNode(text));
        
        this._setStroke(svgText);
        
        svgText.setAttribute('y', y + Jeeel.Dom.Element.prototype.getSize.call({_element: svgText}).height);
    },
    
    /**
     * 文字列を描画して塗りつぶす
     * 
     * @param {String} text 描画文字
     * @param {Number} x X座標
     * @param {Number} y Y座標
     */
    fillText: function (text, x, y) {
        var svgText = this._createSvgElement('text');
        
        svgText.setAttribute('x', x);
        svgText.setAttribute('font-size', this._font.size);
        svgText.setAttribute('font-family', this._font.family.join(','));
        svgText.setAttribute('font-style', this._font.style);
        svgText.setAttribute('font-weight', this._font.weight);
        
        svgText.appendChild(this._doc.createTextNode(text));
        
        this._setFill(svgText);
        
        svgText.setAttribute('y', y + Jeeel.Dom.Element.prototype.getSize.call({_element: svgText}).height);
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
        var directions = this._getArcDirections(x, y, radiusX, radiusY, startAngle, endAngle, true);
        
        if (directions === false) {
            this.strokeEllipse(x, y, radiusX, radiusY);
            return;
        }
        
        var arc = this._createSvgElement('path');
        
        arc.setAttribute('d', directions);
        
        this._setStroke(arc);
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
        var directions = this._getArcDirections(x, y, radiusX, radiusY, startAngle, endAngle, true);
        
        if (directions === false) {
            this.strokeEllipse(x, y, radiusX, radiusY);
            return;
        }
        
        var arc = this._createSvgElement('path');
        
        arc.setAttribute('d', directions);
        
        this._setFill(arc);
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
        var directions = this._getArcDirections(x, y, radiusX, radiusY, startAngle, endAngle);
        
        if (directions === false) {
            this.strokeEllipse(x, y, radiusX, radiusY);
            return;
        }
        
        var arc = this._createSvgElement('path');
        
        arc.setAttribute('d', directions);
        
        this._setStroke(arc);
    },

    /**
     * イメージを描画する
     * 
     * @param {Image} image 描画イメージ
     * @param {Number} x 描画座標X
     * @param {Number} y 描画座標Y
     * @param {Number} [width] 描画する幅
     * @param {Number} [height] 描画する高さ
     */
    drawImage: function (image, x, y, width, height) {
        var svgImage = this._createSvgElement('image');
        
        svgImage.setAttribute('x', x);
        svgImage.setAttribute('y', y);
        
        if (width && height) {
            svgImage.setAttribute('width', width);
            svgImage.setAttribute('height', height);
        } else {
            svgImage.setAttribute('width', image.width);
            svgImage.setAttribute('height', image.height);
        }
        
        svgImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', image.src);
        
        this._svg.appendChild(svgImage);
    },
    
    /**
     * 描画されている全ての図形を消去する
     */
    clear: function () {
        var f, elm = this._svg;

        while (f = elm.firstChild) {
            elm.removeChild(f);
        }
    },
    
    /**
     * SVGエレメントを作成する
     * 
     * @param {String} tagName 作成するSVGエレメントのタグ名
     * @return {SVGElement} 作成したSVGエレメント
     */
    _createSvgElement: function (tagName) {
        return this._doc.createElementNS(this._svg.namespaceURI, tagName);
    },
    
    /**
     * 枠塗り図形としてSVGに追加する
     * 
     * @param {SVGElement} element 対象のSVGエレメント
     */
    _setStroke: function (element) {
        element.setAttribute('fill', 'none');
        element.setAttribute('stroke', this._pen.getColor().toRgb().toRgbaString());
        element.setAttribute('stroke-width', this._pen.getWidth());
        element.setAttribute('stroke-linecap', this._pen.getCapStyle());
        element.setAttribute('stroke-linejoin', this._pen.getJoinStyle());
        element.setAttribute('stroke-miterlimit', this._pen.getMiterLimit());
        
        this._svg.appendChild(element);
    },
    
    /**
     * 塗りつぶし図形としてSVGに追加する
     * 
     * @param {SVGElement} element 対象のSVGエレメント
     */
    _setFill: function (element) {
        element.setAttribute('stroke', 'none');
        element.setAttribute('fill', this._brush.getColor().toRgb().toRgbaString());
        
        this._svg.appendChild(element);
    },
    
    /**
     * 指定した頂点リストから文字列化を行う
     * 
     * @param {Jeeel.Object.Point[]} vertexes 頂点リスト
     * @return {String} 頂点表記文字列
     */
    _getPolygonPoints: function (vertexes) {
        var v,
            p = [];
        
        for (var i = vertexes.length; i--;) {
            v = vertexes[i];
            
            p[p.length] = v.x;
            p[p.length] = v.y;
        }

        return p.join(' ');
    },
    
    /**
     * 楕円弧を作成するための命令文を取得する
     * 
     * @param {Number} x 中心点X
     * @param {Number} y 中心点Y
     * @param {Number} radiusX X方向の半径
     * @param {Number} radiusY Y方向の半径
     * @param {Number} startAngle 円弧の始点の角度(ラジアン)
     * @param {Number} endAngle 円弧の終点の角度(ラジアン)
     * @param {Boolean} [isPie] 扇形かどうか
     * @return {String} 命令文
     */
    _getArcDirections: function (x, y, radiusX, radiusY, startAngle, endAngle, isPie) {
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
            return false;
        }
        
        startAngle = PI2 - startAngle;
        endAngle = PI2 - endAngle;
        
        var sx = x + radiusX * Math.cos(startAngle);
        var sy = y - radiusY * Math.sin(startAngle);
        var ex = x + radiusX * Math.cos(endAngle);
        var ey = y - radiusY * Math.sin(endAngle);
        
        var d = [
            'M' + sx, 
            sy, 
            'A' + radiusX, 
            radiusY, 
            0, 
            +largeFlag, 
            +sweepFlag,
            ex, 
            ey
        ];
        
        if (isPie) {
            d[d.length] = 'L' + x;
            d[d.length] = y;
            d[d.length] = 'Z';
        }
        
        return d.join(' ');
    }
};