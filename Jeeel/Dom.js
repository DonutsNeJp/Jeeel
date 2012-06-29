Jeeel.directory.Jeeel.Dom = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Dom/';
    }
};

/**
 * @namespace Domに関するネームスペース
 * @see Jeeel.Dom.Event
 * @see Jeeel.Dom.Event.Type
 * @see Jeeel.Dom.Element
 * @see Jeeel.Dom.ElementOperator
 * @see Jeeel.Dom.Document
 * @see Jeeel.Dom.Window
 * @example
 * Domネームスペース以下はDOM関連の要素の操作やイベントのハンドリングなど多岐に渡るメイン機能の一つ
 * その中でも特に使用される頻度が高いのは以下のクラスである
 * Jeeel.Dom.Event
 * Jeeel.Dom.Element
 * Jeeel.Dom.ElementOperator
 * Jeeel.Dom.Document
 * Jeeel.Dom.Window
 * 
 * Jeeel.Dom.Event
 * このクラスはイベント関連の制御を一括で行うクラスである
 * このクラスはインスタンスを作成してから何かをする訳ではなく、静的メソッドからイベントを登録し呼び出されたタイミングで処理を行う
 * 
 * 例：
 * var Test = {
 *     
 *     // evがJeeel.Dom.Eventインスタンスになる
 *     onClick: function (ev) {
 *         console.log(ev.mousePoint.x, ev.mousePoint.y);
 *     }
 * };
 * 
 * Jeeel.Dom.Event.addEventListener($ID('test'), Jeeel.Dom.Event.Type.CLICK, Test.onClick, Test);
 * 
 * addEventListenerでイベントを登録する際に引数は順に要素, イベント名, 関数, 関数内でのthisとなる
 * 
 * 
 * Jeeel.Dom.Element
 * このクラスは良く使われる可能性の高いクラスのひとつである
 * このクラスはHTMLElementには無い幾つかの拡張機能を提供するクラスである
 * このクラスはHTMLElementを引数に取ってインスタンス化してから使用する
 * 
 * 例：
 * var elm = new Jeeel.Dom.Element($ID('test')); //他にもJeeel.Dom.Element.create($ID('test'))や$ELM($ID('test'))でも同じ意味である
 * elm.setText('<p>Pタグ</p>'); // 文字列としてinnnerHTMLを書き換える
 * elm.setHtml('<p>Pタグ</p>'); // HTMLとしてinnnerHTMLを書き換える
 * elm.hasClassName('test'); // testという名前のクラスを保持しているかどうか調べる
 * elm.toggle(1000); // jQueryでお馴染みのtoggleとほぼ同等でアニメーションを行う
 * elm.insertTop(document.createElement('div')); // Prototype.jsでお馴染みのInsertion.Topとほぼ同等でラッパーしている要素無いのトップに指定要素を追加する
 * elm.up(); // ラッパーしている要素自体をひとつ上に動かす(兄要素と交換する)
 * 
 * 他にも様々な機能があるがそれらはJeeel.Dom.Elementを参照
 * 
 * 
 * Jeeel.Dom.ElementOperator
 * 場合によってはもっとも多く使用される可能性の高いクラスである
 * 先のJeeel.Dom.Elementを更にラッパーし複数の要素に対して操作を行うクラスである
 * jQueryを参考にして作成してあるので近い機能が多く含まれている
 * このクラスはインスタンス化の際にセレクタ、HTML要素、HTML要素の配列、NodeList数多くの種類の引数を取ることが出来る
 * 
 * 例：
 * var elms = new Jeeel.Dom.ElementOperator('#test .child'); // Jeeel.Dom.ElementOperator.create('#test .child')や$ELMOP('#test .child')でも同じ意味である
 * elms.addClass('hoge'); // 現在保持する全ての要素にクラス hoge を追加する
 * elms.addClick(function (ev) { console.log('click'); }); // 現在保持する全ての要素にクリックイベントを追加する
 * elms.$TAG('p'); // 現在保持する全ての要素内のpタグを検索して新たにJeeel.Dom.ElementOperatorインスタンスを作成して返す
 * elms.filterOdd(); // 現在保持する全ての要素の内奇数の要素のみを収集し新たにインスタンス化して返す
 * elms.setText('chain'); // 現在保持する全ての要素のinnnerHTMLを文字列 "chain" に書き換える
 * 
 * 
 * Jeeel.Dom.Document
 * このクラスは直接インスタンス化する機会が殆ど無い
 * documentのラッパークラスである
 * このクラスの機能を使うときは基本的にJeeel.Documentに代入されているインスタンスを使用する
 * 検索系のショートカットがあるので直接検索メソッドが呼ばれることは殆ど無い
 * 
 * 例：
 * Jeeel.Document.getElementsByClassName('child'); // $CLASS('child')と同じ、ドキュメント上からchildクラスの要素を検索して返す
 * Jeeel.Document.getElementsBySelector('#test > .child'); // $QUERY('#test > .child')と同じ、ドキュメント上からIDがtestの直下のchildクラス要素を検索して返す
 * Jeeel.Document.createElementList('<p>Pタグ</p>'); //指定したHTML文字列から要素の配列を作成して返す
 * Jeeel.Document.getDocumentSize(); // 現在のドキュメントのサイズを取得する(スクロールの増減を含めた値)
 * 
 * 
 * Jeeel.Dom.Window
 * Jeeel.Dom.Documentと同じく直接インスタンス化する機会が殆ど無いクラスである
 * windowのラッパークラスである
 * このクラスの機能を使うときは基本的にJeeel.Windowに代入されているインスタンスを使用する
 * 
 * 例：
 * Jeeel.Window.getWindowSize(); // 現在のウィンドウのサイズを取得する(スクロールの増減を含めない値)
 * Jeeel.Window.createWindowOpener(); // window.openをラッピングし、新しく開くウィンドウに対してPOSTデータを送る機能などを追加したインスタンスを返す
 */
Jeeel.Dom = {

};

Jeeel.file.Jeeel.Dom = ['Core', 'Node', 'Window', 'Document', 'Xml', 'Event', 'Style', 'Element', 'ElementOperator', 'Selector', 'Behavior', 'SearchOption'];

if (Jeeel._auto) {
    Jeeel.Dom._tmp = function () {
        for (var i = 1, l = Jeeel.file.Jeeel.Dom.length; i < l; i++) {
            Jeeel._import(Jeeel.directory.Jeeel.Dom, Jeeel.file.Jeeel.Dom[i]);
        }

        delete Jeeel.Dom._tmp;
    };

    Jeeel._import(Jeeel.directory.Jeeel.Dom, Jeeel.file.Jeeel.Dom[0]);
}
