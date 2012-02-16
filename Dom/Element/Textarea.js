
/**
 * コンストラクタ
 *
 * @class テキストエリアを使いやすくするラッパークラス
 * @augments Jeeel.Dom.Element.Abstract
 * @param {Element} textarea テキストエリア
 * @ignore 未完成
 */
Jeeel.Dom.Element.Textarea = function (textarea) {
    Jeeel.Dom.Element.Abstract.call(this);
    
    this._element = textarea;
};

/**
 * インスタンスの作成を行う
 *
 * @param {Element} textarea テキストエリア
 * @return {Jeeel.Dom.Element.Textarea} 作成したインスタンス
 */
Jeeel.Dom.Element.Textarea.create = function (textarea) {
    return new this(textarea);
};

Jeeel.Dom.Element.Textarea.prototype = {
  
    /**
     * テキストエリア内の文字列を得る
     *
     * @return {String} 取得した文字列
     */
    getText: function () {
        return this._element.value;
    },

    /**
     * テキストエリア内の文字列を設定する
     *
     * @param {String} text セットする文字列
     * @return {Jeeel.Dom.Element.Textarea} 自インスタンス
     */
    setText: function (text) {
        this._element.value = text;

        return this;
    },

    /**
     * テキストエリア内の文字列を前方検索する
     *
     * @param {String} search 検索文字列
     * @param {Integer} [from] 検索開始位置
     * @return {Integer} 検索結果(見つかった文字列の最初の位置見つからない場合は-1)
     */
    indexOf: function (search, from) {
        return this.getText().indexOf(search, from);
    },

    /**
     * テキストエリア内の文字列を後方検索する
     *
     * @param {String} search 検索文字列
     * @param {Integer} [from] 検索開始位置
     * @return {Integer} 検索結果(見つかった文字列の最初の位置見つからない場合は-1)
     */
    lastIndexOf: function (search, from) {
        return this.getText().lastIndexOf(search, from);
    },

    /**
     * テキストエリア内の文字列を置き換えたものを得る
     *
     * @param {RegExp} regexp 検索表現
     * @param {String} text 置き換える文字列
     * @return {String} 置き換え後の文字列
     */
    replace: function (regexp, text) {
        return this.getText().replace(regexp, text);
    },

    /**
     * テキストエリアの選択している開始位置を取得する
     *
     * @return {Integer} 選択している開始位置
     */
    getSelectionStart: function () {
        var start;

        if (Jeeel.UserAgent.isInternetExplorer()) {
            start = this._getIeSelection().start;
        } else {
            start = this._element.selectionStart;
        }

        return start;
    },

    /**
     * テキストエリアの選択している開始位置を設定する
     *
     * @param {Integer} start 設定開始位置
     * @return {Jeeel.Dom.Element.Textarea} 自インスタンス
     */
    setSelectionStart: function (start) {
        this._element.selectionStart = start;

        return this;
    },

    /**
     * テキストエリアの選択している終了位置を取得する
     *
     * @return {Integer} 選択している終了位置
     */
    getSelectionEnd: function () {
        var end;

        if (Jeeel.UserAgent.isInternetExplorer()) {
            end = this._getIeSelection().end;
        } else {
            end = this._element.selectionEnd;
        }

        return end;
    },

    /**
     * テキストエリアの選択している終了位置を設定する
     *
     * @param {Integer} end 設定終了位置
     * @return {Jeeel.Dom.Element.Textarea} 自インスタンス
     */
    setSelectionEnd: function (end) {
        this._element.selectionEnd = end;

        return this;
    },

    /**
     * テキストエリアの選択している終了位置を取得する
     *
     * @return {Integer} 選択している終了位置
     */
    getSelectionLength: function () {
        return this.getSelectionEnd() - this.getSelectionStart();
    },

    /**
     * テキストエリアの選択文字列を取得する
     *
     * @return {String} 選択文字列
     */
    getSelectedText: function () {
        var start = this.getSelectionStart();
        var end   = this.getSelectionEnd();

        var baseText = this.getText();

        return baseText.substring(start, end);
    },

    /**
     * テキストエリアの選択文字列を設定する
     *
     * @param {String} text 選択文字列
     * @return {Jeeel.Dom.Element.Textarea} 自インスタンス
     */
    setSelectedText: function (text) {
        var start = this.getSelectionStart();
        var end   = this.getSelectionEnd();

        this.replaceTo(start, end, text);

        this.setSelectionStart(start + text.length);
        this.setSelectionEnd(start + text.length);
    },

    /**
     * 指定した位置の文字列を指定文字列で置き換える
     *
     * @param {Integer} start 開始位置
     * @param {Integer} end 終了位置
     * @param {String} text 置き換える文字列
     * @return {Jeeel.Dom.Element.Textarea} 自インスタンス
     */
    replaceTo: function (start, end, text) {
        var baseText = this.getText();
        var length   = baseText.length;

        var aboveTxt = baseText.substr(0, start);
        var postTxt  = baseText.substr(end, length);

        this._element.value = aboveTxt + text + postTxt;

        return this;
    },

    /**
     * 現在選択している文字列の開始位置、または現在のカーソル位置に文字列を挿入する
     *
     * @param {String} text 挿入文字列
     * @return {Jeeel.Dom.Element.Textarea} 自インスタンス
     */
    insert: function (text) {
        var index = this.getSelectionStart();

        return this.insertTo(index, text);
    },

    /**
     * 指定した位置に文字列を挿入する
     *
     * @param {Integer} index 挿入位置
     * @param {String} text 挿入文字列
     * @return {Jeeel.Dom.Element.Textarea} 自インスタンス
     */
    insertTo: function (index, text) {
        var baseText = this.getText();
        var length   = baseText.length;

        var aboveTxt = baseText.substr(0, index);
        var postTxt  = baseText.substr(index, length);

        this._element.value = aboveTxt + text + postTxt;

        return this;
    },

    _getIeSelection: function () {
        this._element.focus();
        var range = Jeeel._doc.selection.createRange();
        var clone = range.duplicate();

        clone.moveToElementText(this._element);
        clone.setEndPoint('EndToEnd', range);
        
        var pos ={};

        pos.start = clone.text.length - range.text.length;
        pos.end = clone.text.length - range.text.length + range.text.length;
        
        return pos;
    }
};

Jeeel.Class.extend(Jeeel.Dom.Element.Textarea, Jeeel.Dom.Element.Abstract);
