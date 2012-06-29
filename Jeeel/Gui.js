Jeeel.directory.Jeeel.Gui = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Gui/';
    }
};

/**
 * @namespace GUI関連のネームスペース
 * @see Jeeel.Gui.ColorPicker
 * @see Jeeel.Gui.Scrollbar.Vertical
 * @example
 * Guiのネームスペース以下は独自で生成したGUIパーツを保持する拡張機能の一つ
 * カラーピッカーやスクロールバー、カレンダーなどがある
 * この機能は拡張なので、まだ十分と言えるだけパーツを保持していないがあるパーツにおいては十分に使えるものとなっている
 * 
 * Jeeel.Gui.ColorPicker
 * カラーピッカーを扱うクラス
 * 指定したテキストボックスなどに色選択をさせてデータを入力させる補助ツールとして使用する
 * 
 * 例：
 * var picker = Jeeel.Gui.ColorPicker.create();
 * picker.addTarget($ID('text')); // このカラーピッカーが起動する要素を追加する(クリックイベント)
 * 
 * Jeeel.Gui.Scrollbar.Vertical
 * 垂直方向にスクロールバー
 * 通常のスクロールバーと違いdivで生成した擬似スクロールバーである
 * このクラスを使用するとある要素のスクロールを離れた位置のスクロールバーで操作したり、
 * 複数の要素のスクロールを1つのスクロールバーで操作したりできる
 * 
 * 例：
 * var vscroll = Jeeel.Gui.Scrollbar.Vertical.create();
 * vscroll.getScrollbar(); // このクラスは要素を勝手にbodyなどに埋め込まないため取得してから手動で埋め込む必要がる
 * vscroll.addScrollEvent(Test.onscroll, Test); // スクロールバーがスクロールした際に発生するイベントをハンドルする
 * vscroll.setContainerHeight(788); // このスクロールバーが対応するコンテナの高さを設定する
 */
Jeeel.Gui = {
    
};

Jeeel.file.Jeeel.Gui = ['Abstract', 'Tooltip', 'ColorPicker', 'Scrollbar', 'Calendar', 'Mouse'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Gui, Jeeel.file.Jeeel.Gui);
