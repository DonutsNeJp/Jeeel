Jeeel.directory.Jeeel.Debug = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Debug/';
    }
};

/**
 * @namespace デバッグ関連の機能を保持するネームスペース
 * @example
 * Debugネームスペース以下にはJSのデバッグに使える機能を保有する
 * この機能は主にIEやスマフォでのデバッグに役に立つ
 * その中でも主に以下のクラスが筆頭に立つ
 * Jeeel.Debug.Console
 * Jeeel.Debug.ErrorMessage
 * Jeeel.Debug.Timer
 * Jeeel.Debug.Profiler
 * 
 * Jeeel.Debug.Console
 * ChromeやFirefoxを初めとする高機能ブラウザに搭載されているJSコンソールの再現である
 * このクラスは主にIE8以下などのコンソール機能が弱いブラウザで使用する
 * 
 * 例：
 * Jeeel.Debug.Console.create(); // JSコンソールを生成し画面上に表示する、createConsole()と同じ意味
 * Jeeel.Debug.Console.log(); // JSコンソール上にログを出す
 * Jeeel.Debug.Console.clear(); // JSコンソールの履歴・表示を全て消去する
 * 
 * コンソールを生成した後は画面上に出たテキストエリア(コンソール)で操作を行う
 * コンソール上では通常通りにキーを入力すればグローバル階層からの予測変換とともにJSを入力する事が可能になる
 * またwindow.nameに履歴を保存するのでタブを閉じない限り履歴が保持される
 * 以下が通常記述以外の操作になる
 * 
 * Ctrl+m：複数行モードと単数行モードの変更
 * 
 * 単数行モード時
 *
 * ↑, PageUp：実行履歴を上がる
 * ↓, PageDown：実行履歴を下る
 * Enter：実行
 * 
 * 複数行モード時
 *
 * Ctrl+↑, Ctrl+PageUp：実行履歴を上がる
 * Ctrl+↓, Ctrl+PageDown：実行履歴を下る
 * Ctrl+Enter：実行 
 * 
 * 
 * Jeeel.Debug.ErrorMessage
 * 単にメッセージやHTMLをダンプするダンパーである
 * 基本的にJeeel以下にデバッグモードだったら機能する幾つかのメソッドがあるのでそちらを利用する
 * 
 * 例：
 * Jeeel.Debug.ErrorMessage.dump(1, 'eee'); // 画面上に可変引数で取った値を文字列として出力する、Jeeel.errorDumpがこれに相当する
 * Jeeel.Debug.ErrorMessage.dumpHtml('<p>Test!!</p>', '<div>AAA</div>'); // 画面上に可変引数で取った値をHTMLとして出力する、Jeeel.errorHtmlDumpがこれに相当する
 * Jeeel.Debug.ErrorMessage.dumpStripTags('<p>Test!!</p>', '<div>AAA</div>'); // 画面上に可変引数で取った値をタグ取りしてから出力する、対応するメソッドはない
 * 
 * 
 * Jeeel.Debug.Timer
 * 処理に掛った時間を計測するタイマー
 * Jeeel.Timerとの違いは遅延実行などの制御ではなく、ストップウォッチに近い機能を提供するところである
 * 
 * 例：
 * var timer = Jeeel.Debug.Timer.create(); // mew Jeeel.Debug.Timer()でも同じ
 * 
 * // 重い処理(2500ms経過したとする)
 * timer.lap('A'); // ラップを記録する
 * timer.interval('A'); // インターバルを記録する
 * 
 * // 重い処理(1500ms経過したとする)
 * timer.lap('B'); // ラップを記録する
 * timer.interval('B'); // インターバルを記録する
 * timer.stop(); // タイマーを停止する
 * 
 * 上記のように記録を取ると以下のような値が取得できる
 * timer.loadAllLap(); // {A: 2500, B: 4000}
 * timer.loadAllInterval(); // {A: 2500, B: 1500}
 * 
 * 
 * Jeeel.Debug.Profiler
 * 何処の処理が重いのかを判定するプロファイラー
 * 指定した名前空間や関数に対してトリガーを仕込みそれぞれの関数の呼び出し回数、経過時間、その平均等を割り出すことが出来る
 * 
 * 例：
 * var Test = {
 *     getHoge: funcion () {
 *         return this.getFuga();
 *     },
 *     
 *     getFuga: function () {
 *         return this.Circle.getArea();
 *     },
 *     
 *     Circle: {
 *         getArea: function () {
 *             return ths.getHalfDiameter() * ths.getHalfDiameter() * Math.PI;
 *         },
 *         
 *         getHalfDiameter: function () {
 *             return 2.5;
 *         }
 *     }
 * };
 * 
 * Jeeel.Debug.Profiler.profile(Test, 'Test', true); // Testネームスペース以下を全てプロファイル対象にする
 * 
 * Test.getHoge();
 * Test.getHoge();
 * Test.getHoge();
 * Test.getHoge();
 * 
 * 上記の様に4回先のメソッドを実行すると
 * 4回プロファイルが作成される
 * 
 * Jeeel.Debug.Profiler.getAverageProfileHash(); // 基本的にこのメソッドだけで十分、メソッド毎の平均して掛った時間を連想配列として返す
 * Jeeel.Debug.Profiler.getBottleneckProfile(); // 一番実行に時間が掛ったプロファイルを取得する
 * var m = Jeeel.Debug.Profiler.getProfiles(); // このメソッドを実行するとプロファイルマネージャーインスタンスが取得できる
 * m.getProfiles(); // このメソッドを実行するとプロファイルの時系列順配列を取得できる
 * 
 * このクラスは調節状況であり、継承などが複雑になりすぎるとデータを追えなくなってしまうことがある
 * クロージャなどのJSからアクセスできない関数には対応出来ないなどの欠点もある
 * 
 * <input type="button" value="コンソール生成" onclick="createConsole();" />
 */
Jeeel.Debug = {

};

/**
 * @private
 */
Jeeel._Object.JeeelDebug = {
    /**
     * 不特定なオブジェクトの名前を取得する
     *
     * @param {Mixied} obj 展開対象のオブジェクト
     * @return {String} 名前
     */
    getUnknownObjectName: function (obj) {
        var objType;
        var tmp;

        if (obj.__proto__ && obj.__proto__.constructor && obj.__proto__.constructor[Jeeel.Debug.Debugger.INFORMATION_NAME]) {
            objType = obj.__proto__.constructor[Jeeel.Debug.Debugger.INFORMATION_NAME].name;
        }
        else if ( ! obj.__proto__ && Object.getPrototypeOf && (tmp = Object.getPrototypeOf(obj)).constructor && tmp.constructor[Jeeel.Debug.Debugger.INFORMATION_NAME]) {
            objType = tmp.constructor[Jeeel.Debug.Debugger.INFORMATION_NAME].name;
        }
        else if ( ! obj.__proto__ && ! Object.getPrototypeOf && obj.hasOwnProperty && obj.hasOwnProperty('constructor') && obj.constructor !== Object) {
            objType = obj._super && obj._super.constructor && obj._super.constructor[Jeeel.Debug.Debugger.INFORMATION_NAME].name || 'Object';
        }
        else if ( ! obj.__proto__ && obj.constructor && obj.constructor[Jeeel.Debug.Debugger.INFORMATION_NAME]) {
            objType = obj.constructor[Jeeel.Debug.Debugger.INFORMATION_NAME].name;
        }
        else if (obj.constructor && obj.constructor.name) {
            objType = obj.constructor.name;
        }
        else {
            objType = Object.prototype.toString.call(obj);
            objType = objType.substring(8, objType.length - 1);
        }

        return objType;
    }
};

Jeeel.file.Jeeel.Debug = ['ObjectExport', 'ObjectExpander', 'ErrorMessage', 'Timer', 'Console', 'Profiler', 'UnitTest', 'Debugger', 'Compressor'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Debug, Jeeel.file.Jeeel.Debug);
