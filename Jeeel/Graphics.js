
Jeeel.directory.Jeeel.Graphics = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Graphics/';
    }
};

/**
 * @namespace グラフィックス関連のネームスペース
 * @see Jeeel.Graphics.Raster
 * @see Jeeel.Graphics.Vector
 * @see Jeeel.Graphics.Pen
 * @see Jeeel.Graphics.Brush
 * @see Jeeel.Object.Color
 * @see Jeeel.Object.Font
 * @example
 * Graphicsのネームスペース以下はcanvasやSVGなどのグラフィックス機能を保持している拡張機能の一つ
 * この機能には大きく分けて2つの種類が存在する
 * 双方の機能ともに共通の抽象クラスを持ち操作メソッド自体は同じであり、共通の記述で操作できるようになっている
 * ただ、双方まだ対応していないメソッドが存在するため、複雑なメソッドは未実装エラーが出る箇所がある
 * 
 * 
 * Jeeel.Graphics.Raster
 * ラスター系(ドット単位の色情報で構成されるグラフィックス)の機能を扱うクラス
 * 現在はcanvas要素に対しての描画を補助するクラスのみ
 * 
 * Jeeel.Graphics.Vector
 * ベクター系(座標と式で構成されるグラフィックス)の機能を扱うクラス
 * 現在はSVGの要素を容易に操作できるようにした機能のみ
 * 
 * 
 * Jeeel.Graphics.Raster
 * var canvas = $ID('canvas'); // canvas要素を取得する
 * var graphics = Jeeel.Graphics.Raster.factoryCanvas(canvas); // canvasからラスターインスタンスを作成する
 * 
 * Jeeel.Graphics.Vector
 * var svg = $ID('svg'); // svg要素を取得する
 * var graphics = Jeeel.Graphics.Vector.factorySvg(svg); // SVGからベクターインスタンスを作成する
 * 
 * Rasterは現在
 * strokePie, fillPie, drawArc が未実装である
 * 
 * 以下上記のメソッド以外は共通で使用可能
 * 
 * graphics.drawLine(10, 10, 110, 110); // ラインを引く
 * graphics.strokeRect(10, 10, 100, 100); // 長方形の枠を引く
 * graphics.fillText('text', 5, 5); // 塗りつぶしのテキストを描画する
 * graphics.fillRect(10, 10, 100, 100); // 長方形を塗りつぶす
 * graphics.fillPie(100, 100, 50, 50, 0, Math.PI * 2 / 3); // 0°～60°の扇型を塗りつぶす
 * var pen = graphics.getPen(); // ストロークの設定を行うペンを取得する
 * var brush = graphics.getBrush(); // 塗りつぶしのためのブラシを取得する
 * var font = graphics.getFont(); // テキストを記述するためのフォントを取得する
 * 
 * pen.setWidth(5); // ラインの幅を5pxにする(setPenで設定しなくても即時反映する)
 * pen.setColor(Jeeel.Object.Color.createRgb(255, 0, 0)); // ラインの色を赤に設定する
 * 
 * brush.setColor(Jeeel.Object.Color.createRgb(0, 0, 255)); // 塗りつぶしの色を緑に設定する
 * 
 * font.size = '50px'; // テキストのフォントサイズを50pxにする
 * font.weight = 'bold'; // テキストのフォントを太字にする
 * 
 * graphics.drawLine(20, 20, 50, 50); // 5pxのラインを赤で引く
 * graphics.fillRect(100, 100, 100, 50); // 緑で長方形を塗りつぶす
 * graphics.strokeRect(100, 100, 100, 50); // 赤の5pxのラインで長方形を描く
 * graphics.fillText('テスト文字', 100, 100); // 緑色の50pxの太字で"テスト文字列"とテキストを描画する
 */
Jeeel.Graphics = {

};

Jeeel.file.Jeeel.Graphics = ['Abstract', 'Pen', 'Brush', 'Raster', 'Vector'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Graphics, Jeeel.file.Jeeel.Graphics);
