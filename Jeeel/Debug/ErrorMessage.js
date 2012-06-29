
/**
 * @staticClass メッセージをHTML上に表示するためのモジュール
 */
Jeeel.Debug.ErrorMessage = {
    
    _timer: 0,
    
    _setLf: false,
    
    /**
     * エラーメッセージの出力するためのdivタグを作る
     *
     * @return {Element} 取得したdiv要素
     * @private
     */
    _create: function () {
        var errorDiv = 'jeeel-debug-error-message-div';

        var div = Jeeel._doc.getElementById(errorDiv);

        if ( ! div) {
            div = Jeeel.Document.createElement('div');
            div.id = errorDiv;
            
            var style = div.style;
            
            style.backgroundColor = 'white';
            style.color = 'black';
            style.textAlign = 'left';
            style.fontSize = '15px';
            style.fontWeight = 'normal';
            
            Jeeel.Debug.Debugger.elementInsertTop(div);
        }

        return div;
    },

    /**
     * エラーをダンプする<br />
     * errorDiv変数のIDからdivを取得<br />
     * なければ作成する
     *
     * @param {Mixied} var_args 可変引数、ダンプするエラーを羅列する
     */
    dump: function (var_args) {
        var div = Jeeel.Debug.ErrorMessage._create();

        var error = [];

        for (var i = 0, l = arguments.length; i < l; i++) {
            error[i] = Jeeel.String.escapeHtml(arguments[i], true);
        }

        Jeeel.Debug.ErrorMessage._setLinefeed();

        div.innerHTML += error.join(' ');

        Jeeel.Debug.ErrorMessage._setLinefeedTimer();
    },

    /**
     * タグを全て取り除いたエラーダンプする<br />
     * errorDiv変数のIDからdivを取得<br />
     * なければ作成する
     *
     * @param {Mixied} var_args 可変引数、ダンプするエラーを羅列する
     */
    dumpStripTags: function (var_args) {

        for (var i = 0, l = arguments.length; i < l; i++) {
            arguments[i] = Jeeel.String.stripTags(''+arguments[i]);
        }

        Jeeel.Debug.ErrorMessage.dump.apply(this, arguments);
    },

    /**
     * タグをエスケープしないで直接ダンプを行う<br />
     * errorDiv変数のIDからdivを取得<br />
     * なければ作成する
     *
     * @param {Mixied} var_args 可変引数、ダンプするエラーを羅列する
     */
    dumpHtml: function (var_args) {
        var div = Jeeel.Debug.ErrorMessage._create();

        var error = [];

        for (var i = 0, l = arguments.length; i < l; i++) {
            error[i] = arguments[i];
        }
        
        Jeeel.Debug.ErrorMessage._setLinefeed();
        
        div.innerHTML += error.join(' ');
        
        Jeeel.Debug.ErrorMessage._setLinefeedTimer();
    },

    /**
     * エラーを消去する<br />
     * errorDiv変数のIDからdivを取得<br />
     * なければ作成する
     */
    clear: function () {

        var div = Jeeel.Debug.ErrorMessage._create();

        div.innerHTML = '';
    },

    /**
     * エラーメッセージを出力するためのdiv要素を得る
     *
     * @return {Element} 取得したdiv要素
     */
    get: function () {
        return Jeeel.Debug.ErrorMessage._create();
    },

    /**
     * 出力されたエラーメッセージを文字列として得る
     *
     * @return {String} 取得したエラーメッセージ
     */
    getText: function () {
        return Jeeel.String.unescapeHtml(Jeeel.Debug.ErrorMessage._create().innerHTML, true);
    },
    
    _setLinefeed: function () {
        if (this._setLf) {
            this._create().innerHTML += '<br />';
            this._setLf = false;
        }
    },
    
    _setLinefeedTimer: function () {
        if (this._timer) {
            return;
        }
        
        this._timer = Jeeel.Timer.setTimeout(function () {
            Jeeel.Debug.ErrorMessage._setLf = true;
            Jeeel.Debug.ErrorMessage._timer = 0;
        }, 0);
    }
};
