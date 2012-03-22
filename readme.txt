library Name: Jeeel

Copyright (c) 2012 嶋田 将人

Jeeel is only compatible with Japanese

--------------------------------------------------------------

このテキストはJeeel.js使い方を示したものです。
開発環境はnetbeans6.91以上を想定しています。

圧縮は以下のサイトで行いました。
http://dean.edwards.name/packer/

ソースの流用にさせてもらったライブラリ
・jQuery(http://jquery.com/)
・Prototype(http://prototypejs.org/)
・JSTweener(http://coderepos.org/share/wiki/JSTweener)
・Packer.js(http://dean.edwards.name/packer/)
・md5.js(http://www.onicos.com/staff/iz/amuse/javascript/expert/)
・base64.js(http://www.onicos.com/staff/iz/amuse/javascript/expert/)


ソースを参考にさせてもらったライブラリ
・jQuery(http://jquery.com/)
・Prototype(http://prototypejs.org/)
・Dojo(http://dojotoolkit.org/)
・JSDeferred(https://github.com/cho45/jsdeferred)

デザインを参考にさせてもらったもの
・Chrome
・Redmine

参考文献
・ハイパフォーマンスJavaScript(オライリー)
・第5版 JavaScript(オライリー)
・JavaScriptパターン(オライリー)
・JavaScript & DHTMLクックブッ(オライリー)
・大規模Webアプリケーション開発入門(オライリー)
・IT戦記(http://d.hatena.ne.jp/amachang/)
・jQuery日本語リファレンス(http://semooh.jp/jquery/)
・HTMLリファレンス(http://www.htmq.com/index.htm)
・とほほのJavaScriptリファレンス(http://www.tohoho-web.com/js/index.htm)
・Mozilla Developer Network(https://developer.mozilla.org/en/JavaScript/Reference)
・anything from here(http://hkom.blog1.fc2.com/)
・PHPマニュアル(http://www.php.net/manual/ja/index.php)
・DOBON.NET(http://dobon.net/)
・gihyo.jp(http://gihyo.jp/)
・その他ウェブサイト

netbeansのオプションからその他→ファイル無視するファイルパターンのカッコの後に Jeeel-Set.*\.js| を入れておく事をお勧めします。
これを行うことによりJeeel-Set.jsが予測変換から消えるのでスマートに検索できます。

例： ^(Jeeel-Set.*\.js|CVS|SCCS|vssver.?\.scc|#.*#|%.*%|_svn)$|~$|^\.(?!htaccess$).*$


[1] 簡易使い方

1, Jeeelディレクトリ以下を全て任意の場所にコピーしてください
2, htmlにてJeeel.jsを読み込みます。


[2-1] まとめて読み込む場合

1, htmlにてJeeel-Set.jsを読み込みます。

[2-2] 最小サイズまとめて読み込む場合(コメントが無くなり、いくつかの機能も使えません)

1, htmlにてJeeel-Set-Min.jsを読み込みます。


[3] 個別に読み込む場合

1, 読み込みを行う前にjeeelConfig.manualLoadをtrue(引数にml=1でも可)にします。
2, htmlに必要なファイルのみを読み込みます。


[4] ネームスペースをJeeel以外に表示させなようにする

1, 読み込みを行う前にjeeelConfig.cleanをtrue(引数にcl=1でも可)にします。
2, htmlに必要なファイルのみを読み込みます。


[5] デバッグ専用モードを使用する([4]を実行しているとショートカットは作成されない)

1, 読み込みを行う前にjeeelConfig.debugをtrue(引数にdbg=1でも可)にします。
2, htmlに必要なファイルのみを読み込みます。


[6] 拡張機能を使用する

1, 読み込みを行う前にjeeelConfig.extendを連想配列として定義します(引数にext[gui]=1等と記述も可)。(定義するキーにより個別に機能が追加される(カッコ内は引数の場合): gui(gui), webStorage(ws), database(db), worker(wk), geolocation(geo), file(file), media(md), graphics(grp), net(net))
2, htmlに必要なファイルのみを読み込みます。


[7] Jeeelの全ての機能を使用する

1, 読み込みを行う前にjeeelConfig.fullをtrue(引数にfull=1でも可)にします。
2, htmlに必要なファイルのみを読み込みます。


設定一覧
jeeelConfigに対して設定できる項目
manualLoad: 自動読み込みの無効化(Jeeel-Set.js, Jeeel-Set-Min.jsは定義済み)
clean: Jeeel以外のグローバル変数を使わせない
debug: デバッグモードの有効化
extend: 拡張機能を項目別に有効化(gui, webStorage, database, worker, geolocation, file, media, graphics, net)
full: 全機能の有効化(デバッグモードと拡張機能)

URLのクエリ(?以降の文)に対して設定できる項目
ml: 自動読み込みの無効化(Jeeel-Set.js, Jeeel-Set-Min.jsはjeeelConfigにて定義済み)
cl: Jeeel以外のグローバル変数を使わせない
dbg: デバッグモードの有効化
ext: 拡張機能を項目別に有効化(gui, ws, db, wk, geo, file, md, grp, net)
full: 全機能の有効化(デバッグモードと拡張機能)