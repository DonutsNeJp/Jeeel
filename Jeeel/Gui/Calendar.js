
/**
 * コンストラクタ
 * @class カレンダーを扱うクラス
 * @param {Boolean} [multiSelect] 日付複数選択するかどうか
 */
Jeeel.Gui.Calendar = function (multiSelect) { 
    Jeeel.Gui.Abstract.call(this);
    
    this._init(multiSelect);
};

/**
 * インスタンスの作成を行う
 * 
 * @param {Boolean} [multiSelect] 日付複数選択するかどうか
 * @return {Jeeel.Gui.Calendar} 作成したインスタンス
 */
Jeeel.Gui.Calendar.create = function (multiSelect) {
    return new this(multiSelect);
};

Jeeel.Gui.Calendar.CLASS = {
    CALENDAR: 'jeeel-gui-calendar',
    HEADER: 'jeeel-gui-header',
    BODY: 'jeeel-gui-body',
    FOOTER: 'jeeel-gui-footer',
    BUTTON: 'jeeel-gui-button',
    POPUPABLE: 'jeeel-gui-popupable',
    DRAG: 'jeeel-gui-drag',
    HELP: 'jeeel-gui-help',
    CLOSE: 'jeeel-gui-close',
    DECISION: 'jeeel-gui-decision',
    TITLE: 'jeeel-gui-title',
    MESSAGE: 'jeeel-gui-message',
    HIGHLIGHT: 'jeeel-gui-highlight',
    ACTIVE: 'jeeel-gui-active',
    TABLE: 'jeeel-gui-table',
    TABLE_HEADER: 'jeeel-gui-table-header',
    TABLE_HEADER_TITLE: 'jeeel-gui-table-header-title',
    TABLE_HEADER_WEEK: 'jeeel-gui-table-header-week',
    TABLE_DATA: 'jeeel-gui-table-data',
    
    DAYS: [
        'jeeel-gui-calendar-day-sunday',
        'jeeel-gui-calendar-day-monday',
        'jeeel-gui-calendar-day-tuesday',
        'jeeel-gui-calendar-day-wednesday',
        'jeeel-gui-calendar-day-thursday',
        'jeeel-gui-calendar-day-friday',
        'jeeel-gui-calendar-day-saturday'
    ],
    
    TODAY: 'jeeel-gui-calendar-today',
    WEEK: 'jeeel-gui-calendar-week',
    DATE: 'jeeel-gui-calendar-date',
    SELECT: 'jeeel-gui-calendar-date-select',
    
    DATE_OPERATOR: 'jeeel-gui-date-operator',
    DATE_OPERATOR_PREV: 'jeeel-gui-date-operator-prev',
    DATE_OPERATOR_NEXT: 'jeeel-gui-date-operator-next',
    DATE_OPERATOR_TODAY: 'jeeel-gui-date-operator-today'
};

Jeeel.Gui.Calendar._initStyle = function () {
        
    if (arguments.callee.ignore) {
        return;
    }
    
    arguments.callee.ignore = true;
    
    var classNames = Jeeel.Gui.Calendar.CLASS;

    var css = '.' + classNames.CALENDAR + ' {\n'
            + '  width: 200px;\n'
            + '  height: auto;\n'
            + '  background-color: white;\n'
            + '  border: black 1px solid;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.TABLE + ' {\n'
            + '  border-spacing: 0;\n'
            + '  width: 100%;\n'
            + '  height: 100%;\n'
            + '  font-size: 16px;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.TABLE + ' .' + classNames.TABLE_HEADER_WEEK + ' {\n'
            + '  background-color: #BBDDFF;\n'
            + '  border-right: black 1px solid;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' * {\n'
            + '  border: 0;\n'
            + '  color: black;\n'
            + '  margin: 0;\n'
            + '  padding: 0;\n'
            + '  text-align: center;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BUTTON + ' {\n'
            + '  text-align: center;\n'
            + '  cursor: pointer;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + '.' + classNames.POPUPABLE + ' .' + classNames.DRAG + ' {\n'
            + '  cursor: move;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.HEADER + ' {\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.HEADER + ' tr {\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.HEADER + ' th {\n'
            + '  width: 17px;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.HEADER + ' .' + classNames.DATE_OPERATOR + ' td {\n'
            + '  background-color: #467AA7;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.HEADER + ' .' + classNames.DATE_OPERATOR + ' td:hover {\n'
            + '  background-color: #80B0DA;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.HEADER + ' .' + classNames.TABLE_HEADER + ' {\n'
            + '  background-color: #BBDDFF;\n'
            + '  font-weight: bold;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.HEADER + ' .' + classNames.TABLE_HEADER + ' th {\n'
            + '  border-bottom: black 1px solid;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.TABLE + ' .' + classNames.DAYS[0] + ' {\n'
            + '  color: #E33;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.TABLE + ' .' + classNames.DAYS[6] + ' {\n'
            + '  color: #33E;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.TABLE + ' .' + classNames.TODAY + ' {\n'
            + '  border: 1px solid black;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' {\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' tr {\n'
            + '  height: 18px;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.TABLE_HEADER + ' {\n'
            + '  font-weight: bold;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.TABLE_DATA + ' {\n'
            + '  text-align: center;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.WEEK + '.' + classNames.HIGHLIGHT + ' td.' + classNames.ACTIVE + ' {\n'
            + '  background-color: #DEF;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.WEEK + '.' + classNames.HIGHLIGHT + ' td.' + classNames.ACTIVE + '.' + classNames.SELECT + ' {\n'
            + '  background-color: #EBCBD3;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.WEEK + '.' + classNames.HIGHLIGHT + ' td.' + classNames.TABLE_HEADER_WEEK + ' {\n'
            + '  background-color: #80B0DA;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.WEEK + ' .' + classNames.TABLE_DATA + '.' + classNames.ACTIVE + '.' + classNames.HIGHLIGHT + ' {\n'
            + '  background-color: #80B0DA;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.WEEK + ' .' + classNames.TABLE_DATA + '.' + classNames.ACTIVE + '.' + classNames.SELECT + ' {\n'
            + '  background-color: #F9A7A7;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.BODY + ' .' + classNames.WEEK + ' .' + classNames.TABLE_DATA + '.' + classNames.ACTIVE + '.' + classNames.SELECT + '.' + classNames.HIGHLIGHT + ' {\n'
            + '  background-color: #BDACC1;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.FOOTER + ' {\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.FOOTER + ' tr td {\n'
            + '  border-top: black 1px solid;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.FOOTER + ' .' + classNames.MESSAGE + ' {\n'
            + '  vertical-align: middle;\n'
            + '  font-size: 13px;\n'
            + '}\n'
            + '.' + classNames.CALENDAR + ' .' + classNames.FOOTER + ' .' + classNames.DECISION + ' {\n'
            + '  vertical-align: middle;\n'
            + '  font-size: 15px;\n'
            + '}\n';

    this._defaultStyle = css;
    this._styleTag = Jeeel.Loader.addStyle(css);
};

Jeeel.Gui.Calendar.prototype = {
    
    /**
     * ポップアップ可能かどうか
     * 
     * @type Boolean
     * @private
     */
    _popupable: false,
    
    /**
     * 日付複数選択するかどうか
     * 
     * @type Boolean
     * @private
     */
    _multiSelect: false,
    
    /**
     * 日付の選択が決定した場合のコールバック
     * 
     * @type Function
     * @private
     */
    _okCallback: null,
    
    /**
     * カレンダーの要素
     * 
     * @type Jeeel.Dom.ElementOperator
     * @private
     */
    _calendar: null,
   
    /**
     * 現在表示の日付
     * 
     * @type Jeeel.Object.Date
     * @private
     */
    _date: null,
    
    /**
     * 現在選択中の日付リスト
     * 
     * @type Jeeel.Object.Date[]
     * @private
     */
    _selectDates: [],
    
    _dragData: {
        enable: false
    },
    
    /**
     * 現在の選択済みの日付を取得する
     * 
     * @return {Jeeel.Object.Date} 日付
     */
    getSelectedDate: function () {
        return this._selectDates[0] || null;
    },
    
    /**
     * 現在の選択済みの日付リストを取得する
     * 
     * @return {Jeeel.Object.Date[]} 日付リスト
     */
    getSelectedDates: function () {
        return this._selectDates;
    },
    
    /**
     * 指定した日付を選択する
     * 
     * @param {Jeeel.Object.Date|Date|String|Integer} date 日付を示す値
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    selectDate: function (date) {
        var tmp = new Jeeel.Object.Date(date);
        
        this._selectDates[this._selectDates.length] = Jeeel.Object.Date.createDate(tmp.year, tmp.month, tmp.date);
        
        return this._refreshSelected();
    },
    
    /**
     * 指定した年月日を選択する
     * 
     * @param {Integer} year 年
     * @param {Integer} month 月
     * @param {Integer} day 日
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    selectYmd: function (year, month, day) {
        this._selectDates[this._selectDates.length] = Jeeel.Object.Date.createDate(year, month, day);

        return this._refreshSelected();
    },
    
    /**
     * 表示中の日付を指定した日付に変更する
     * 
     * @param {Jeeel.Object.Date|Date|String|Integer} date 日付を示す値
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    changeDate: function (date) {
        var prev = this._date;
        
        var tmp = new Jeeel.Object.Date(date);
        
        this._date = Jeeel.Object.Date.createDate(tmp.year, tmp.month, tmp.date);
        
        return this._redraw(prev);
    },
    
    /**
     * 表示中の日付を指定した年月日に変更する
     * 
     * @param {Integer} year 年
     * @param {Integer} month 月
     * @param {Integer} day 日
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    changeYmd: function (year, month, day) {
         var prev = this._date;
         
        this._date = Jeeel.Object.Date.createDate(year, month, day);
        
        return this._redraw(prev);
    },
    
    /**
     * 表示中の日付を今日に変更する
     * 
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    changeToday: function () {
        return this.changeDate();
    },
    
    /**
     * 表示中の日付を前月に変更する
     * 
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    changePrevMonth: function () {
        return this.changeYmd(this._date.year, this._date.month - 1, 1);
    },
    
    /**
     * 表示中の日付を翌月に変更する
     * 
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    changeNextMonth: function () {
        return this.changeYmd(this._date.year, this._date.month + 1, 1);
    },
    
    /**
     * 表示中の日付を前年に変更する
     * 
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    changePrevYear: function () {
        return this.changeYmd(this._date.year - 1, this._date.month, 1);
    },
    
    /**
     * 表示中の日付を翌年に変更する
     * 
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    changeNextYear: function () {
        return this.changeYmd(this._date.year + 1, this._date.month, 1);
    },
    
    /**
     * カレンダーを表示する
     * 
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    show: function () {
        
        this._calendar.show();
        
        return this;
    },
    
    /**
     * カレンダーを非表示にする
     * 
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    hide: function () {
        
        this._calendar.hide();
        
        return this;
    },
    
    /**
     * 日付選択を決定した際に呼ばれるコールバックを設定する
     * 
     * @param {Function} callback コールバック
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    setDecisionCallback: function (callback) {
        
        if ( ! Jeeel.Type.isFunction(callback)) {
            throw new Error('callbackが関数ではありません。');
        }
        
        this._okCallback = callback;
        
        return this;
    },
    
    /**
     * カレンダーの要素を取得する
     * 
     * @return {Element} カレンダー要素
     */
    getCalendarElement: function () {
        return this._calendar.get(0);
    },
    
    /**
     * ポップアップの有効・無効を設定する
     * 
     * @param {Boolean} enable ポップアップ化を有効にするかどうか
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    enablePopup: function (enable) {
        var pos = (enable ? 'absolute' : '');
        var zi  = (enable ? '100' : '');
        
        this._calendar.setCss('position', pos)
                      .setCss('z-index', zi);
        
        if (enable) {
            this._calendar.addClass(this.constructor.CLASS.POPUPABLE)
                          .$CLASS(this.constructor.CLASS.CLOSE)
                          .setCss('visibility', 'visible');
        } else {
            this._calendar.removeClass(this.constructor.CLASS.POPUPABLE)
                          .$CLASS(this.constructor.CLASS.CLOSE)
                          .setCss('visibility', 'hidden');
        }
        
        this._popupable = !!enable;

        return this;
    },
    
    /**
     * このElementを指定座標に移動する
     * 
     * @param {Integer} x X座標
     * @param {Integer} y Y座標
     * @return {Jeeel.Gui.Calendar} 自インスタンス
     */
    shiftTo: function (x, y) {
        this._calendar.shiftTo(x, y);
        
        return this;
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Boolean} [multiSelect] 日付複数選択するかどうか
     * @constructor
     */
    constructor: Jeeel.Gui.Calendar,
    
    _refreshSelected: function () {
        
        if ( ! this._multiSelect) {
            this._selectDates = [this._selectDates[this._selectDates.length - 1]];
            this._ok();
            this._redraw(this._date);
            
            return this;
        }
        
        var len = this._selectDates.length,
            res = [];
        
        outerLoop: for (var i = 0; i < len; i++) {
            
            var resLen = res.length;
            
            for (var j = 0; j < resLen; j++) {
                if (res[j].year === this._selectDates[i].year && res[j].month === this._selectDates[i].month && res[j].date === this._selectDates[i].date) {
                    res.splice(j, 1);
                    break outerLoop;
                }
            }
            
            res[resLen] = this._selectDates[i];
        }
        
        this._selectDates = res;
        
        return this._redraw(this._date);
    },
    
    /**
     * @param {Jeeel.Dom.Event} ev
     */
    _selectDate: function (ev) {
        var target = Jeeel.Dom.Element.create(ev.target);
        
        if (target.hasClassName(this.constructor.CLASS.DATE)) {
            var date = +target.getText();
            
            if (date) {
                this.selectYmd(this._date.year, this._date.month, date);
            }
        }
    },
    
    _resetState: function () {
        this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText('日付を選択してください');
    },
    
    /**
     * @param {Jeeel.Dom.Event} ev
     */
    _changeState: function (ev) {
        var target = Jeeel.Dom.Element.create(ev.target);
        var txt, highlightTarget;
        
        if (target.hasClassName(this.constructor.CLASS.DRAG)) {
            
            txt = this._popupable ? 'ドラッグ可能' : '日付を選択してください';
            
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText(txt);
        }
        else if (target.hasClassName(this.constructor.CLASS.HELP)) {
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText('ヘルプ');
        }
        else if (target.hasClassName(this.constructor.CLASS.CLOSE)) {
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText('キャンセル');
        }
        else if (target.hasClassName(this.constructor.CLASS.DATE)) {
            
            var date = +target.getText();
            
            if (date) {
                highlightTarget = target;
                
                date = Jeeel.Object.Date.createDate(this._date.year, this._date.month, date);
                
                txt = date.toString('m月d日(D)');
                
                if (target.hasClassName(this.constructor.CLASS.TODAY)) {
                    txt += '(今日)';
                }
                
                this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText(txt);
            } else {
                this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText('日付を選択してください');
            }
        } 
        else if (target.hasClassName(this.constructor.CLASS.DATE_OPERATOR_TODAY)) {
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText('今日');
        }
        else if (target.hasClassName(this.constructor.CLASS.DATE_OPERATOR_NEXT)) {
            var nt = target.getText();
            
            txt = '翌' + ((nt === '>') ? '月' : '年');
            
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText(txt);
        }
        else if (target.hasClassName(this.constructor.CLASS.DATE_OPERATOR_PREV)) {
            var pt = target.getText();
            
            txt = '前' + ((pt === '<') ? '月' : '年');
          
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText(txt);
        } 
        else if (target.hasClassName(this.constructor.CLASS.TABLE_HEADER_WEEK)) {
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText('日付を選択してください');
        } 
        else if (target.hasClassName(this.constructor.CLASS.TABLE_HEADER_TITLE)) {
            this._calendar.$CLASS(this.constructor.CLASS.MESSAGE).setText('日付を選択してください');
        }
        
        this._highlight(highlightTarget);
    },
    
    _highlight: function (date) {
        this._calendar.$CLASS(this.constructor.CLASS.HIGHLIGHT).removeClass(this.constructor.CLASS.HIGHLIGHT);
        
        if (date) {
            Jeeel.Dom.Element.create(date.addClassName(this.constructor.CLASS.HIGHLIGHT).getParentNode())
                             .addClassName(this.constructor.CLASS.HIGHLIGHT);
        }
    },
    
    _cancel: function () {
        this._selectDates = [];
        
        this.hide();
        this._redraw(this._date);
    },
    
    _ok: function () {
        if (this._popupable) {
            this.hide();
        }
        
        if (this._okCallback) {
            this._okCallback(this);
        }
    },
    
    /**
     * @param {Jeeel.Dom.Event} ev
     */
    _drag: function (ev) {
        if ( ! this._dragData.enable) {
            return;
        }
        
        ev.stop();
        
        var bpoint = this._dragData.point;
        var apoint = ev.mousePoint;
        
        var top  = apoint.y - bpoint.y;
        var left = apoint.x - bpoint.x;
        
        this._calendar.setCss('top', top + 'px')
                      .setCss('left', left + 'px');
    },
    
    /**
     * @param {Jeeel.Dom.Event} ev
     */
    _dragOn: function (ev) {
        this._dragData.enable = true;
        this._dragData.point = ev.getRelativeMousePoint(this._calendar.get(0));
        
        Jeeel.Document.addEventListener(Jeeel.Dom.Event.Type.MOUSE_MOVE, this._drag, this)
                      .addEventListener(Jeeel.Dom.Event.Type.MOUSE_UP, this._dragOff, this);
    },
    
    /**
     * @param {Jeeel.Dom.Event} ev
     */
    _dragOff: function (ev) {
        this._dragData.enable = false;
        
        Jeeel.Document.removeEventListener(Jeeel.Dom.Event.Type.MOUSE_MOVE, this._drag)
                      .removeEventListener(Jeeel.Dom.Event.Type.MOUSE_UP, this._dragOff);
    },
    
    _isSelected: function (year, month, day) {
        for (var i = 0, l = this._selectDates.length; i < l; i++) {
            
            var date = this._selectDates[i];
            
            if (date.year == year && date.month == month && date.date == day) {
                return true;
            }
        }
        
        return false;
    },
    
    _redraw: function (prevDate) {
        var today   = Jeeel.Object.Date.createDate();
        var toMonth = Jeeel.Object.Date.createDate(this._date.year, this._date.month, 1);
        
        if (toMonth.year !== today.year || toMonth.month !== today.month) {
            today = null;
        }
        
        var dates = toMonth.getDatesOfMonth();
        var l = Jeeel.Object.Date.getDays().length;
        var title = this._calendar.$CLASS(this.constructor.CLASS.TITLE);
        var body = this._calendar.$CLASS(this.constructor.CLASS.WEEK);
        
        title.setText(toMonth.toString('Y年m月'));
        
        var mi = -toMonth.getDay();
        
        for (var i = 0; i < 6; i++) {
            var weekTr = body.$GET(i);
            var week = weekTr.$CLASS(this.constructor.CLASS.DATE);
            
            var hide = true;
            
            for (var w = 0; w < l; w++) {
                var date = week.$GET(w);
                var txt  = dates[mi] || '';
                
                date.setText(txt);
                
                if (today && today.date == txt) {
                    date.addClass(this.constructor.CLASS.TODAY);
                } else {
                    date.removeClass(this.constructor.CLASS.TODAY);
                }
                
                if (this._isSelected(toMonth.year, toMonth.month, txt)) {
                    date.addClass(this.constructor.CLASS.SELECT);
                } else {
                    date.removeClass(this.constructor.CLASS.SELECT);
                }
                
                if (txt) {
                    hide = false;
                    date.addClass(this.constructor.CLASS.ACTIVE);
                } else {
                    date.removeClass(this.constructor.CLASS.ACTIVE);
                }
                
                mi++;
            }
            
            if (hide) {
                weekTr.hide();
            } else {
                weekTr.show();
            }
        }
        
        return this;
    },
    
    /**
     * Elementの作成を行う
     * 
     * @param {String} tagName 作成タグ名
     * @return {Jeeel.Dom.ElementOperator} 作成タグのラッパー
     */
    _createElm: function (tagName) {
        var tag = Jeeel.Document.createElement(tagName);
        
        return Jeeel.Dom.ElementOperator.create(tag);
    },
    
    _init: function (multiSelect) {
        
        if (multiSelect) {
            this._multiSelect = true;
        }
      
        var calendar = this._createElm('table');
        var header   = this._createElm('thead');
        var body     = this._createElm('tbody');
        var footer   = this._createElm('tfoot');
        
        calendar.addClass(this.constructor.CLASS.TABLE)
                .appendChild(header)
                .appendChild(body)
                .appendChild(footer);
                
        header.addClass(this.constructor.CLASS.HEADER);
        body.addClass(this.constructor.CLASS.BODY);
        footer.addClass(this.constructor.CLASS.FOOTER);
        
        var topBar = this._createElm('tr');
        var title = this._createElm('td');
        var help   = this._createElm('td');
        var close  = this._createElm('td');

        title.addClass([this.constructor.CLASS.DRAG, this.constructor.CLASS.TITLE])
             .setProp('colSpan', 6);
             
        help.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.HELP])
            .setCss('visibility', 'hidden');
            
        close.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.CLOSE])
             .addClick(this._cancel, this);
        
        help.setText('?');
        close.setText('×');
        
        topBar.appendChild([help, title, close]);
        
        var opBar  = this._createElm('tr');
        var pYear  = this._createElm('td');
        var pMonth = this._createElm('td');
        var today  = this._createElm('td');
        var nMonth = this._createElm('td');
        var nYear  = this._createElm('td');
        
        opBar.addClass(this.constructor.CLASS.DATE_OPERATOR);
        pYear.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.DATE_OPERATOR_PREV])
              .addClick(this.changePrevYear, this);
        
        pMonth.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.DATE_OPERATOR_PREV])
             .addClick(this.changePrevMonth, this);
        
        nYear.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.DATE_OPERATOR_NEXT])
              .addClick(this.changeNextYear, this);
        
        nMonth.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.DATE_OPERATOR_NEXT])
             .addClick(this.changeNextMonth, this);
        
        today.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.DATE_OPERATOR_TODAY])
             .addClick(this.changeToday, this)
             .setProp('colSpan', 4);
        
        pYear.setText('<<');
        pMonth.setText('<');
        today.setText('今日');
        nMonth.setText('>');
        nYear.setText('>>');
        
        opBar.appendChild([pYear, pMonth, today, nMonth, nYear]);
        
        var tr, th, td, w, l = Jeeel.Object.Date.getDays().length;
        var dayClasses = this.constructor.CLASS.DAYS;
        var weekTitle = this._createElm('tr')
                            .addClass(this.constructor.CLASS.TABLE_HEADER);
        
        th = this._createElm('th');
        th.addClass([this.constructor.CLASS.TABLE_HEADER_TITLE, this.constructor.CLASS.TABLE_HEADER_WEEK])
          .setText('週');
        
        weekTitle.appendChild(th);
        
        for (w = 0; w < l; w++) {
            th = this._createElm('th');
            th.addClass([this.constructor.CLASS.TABLE_HEADER_TITLE, dayClasses[w]])
              .setText(Jeeel.Object.Date.getDays()[w].substr(0, 1));
            
            weekTitle.appendChild(th);
        }
        
        header.appendChild([topBar, opBar, weekTitle]);
        
        body.addClass(this.constructor.CLASS.DATE_TABLE)
            .addClick(this._selectDate, this);

        var date = Jeeel.Object.Date.create();
        today = date;
        
        this._date = date;
        
        title.setText(date.toString('Y年m月'));
        date = Jeeel.Object.Date.create(date.toString('Y-m-1'));
        
        var dates = date.getDatesOfMonth();
        var mi = - date.getDay();
        
        for (var i = 0; i < 6; i++) {
            tr = this._createElm('tr').addClass(this.constructor.CLASS.WEEK);
            td = this._createElm('td');
            td.addClass([this.constructor.CLASS.TABLE_DATA, this.constructor.CLASS.TABLE_HEADER_WEEK])
              .setText(i + 1);
                  
            tr.appendChild(td);
            
            var hide = true;
            
            for (w = 0; w < l; w++) {
                var txt = dates[mi] || '';
                
                td = this._createElm('td');
                td.addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.TABLE_DATA, this.constructor.CLASS.DATE, dayClasses[w]])
                  .setText(txt);
                  
                if (today.date == txt) {
                    td.addClass(this.constructor.CLASS.TODAY);
                }
                
                if (txt) {
                    hide = false;
                    td.addClass(this.constructor.CLASS.ACTIVE);
                } else {
                    td.removeClass(this.constructor.CLASS.ACTIVE);
                }

                tr.appendChild(td);
                
                mi++;
            }
            
            if (hide) {
                tr.hide();
            }
            
            body.appendChild(tr);
        }
        
        tr = this._createElm('tr');
        td = this._createElm('td');
        
        td.setProp('colSpan', 8)
          .addClass([this.constructor.CLASS.DRAG, this.constructor.CLASS.MESSAGE])
          .setText('日付を選択して下さい');
          
        tr.appendChild(td);
        
        footer.appendChild(tr);
        
        tr = this._createElm('tr');
        td = this._createElm('td');

        td.setProp('colSpan', 8)
          .addClass([this.constructor.CLASS.BUTTON, this.constructor.CLASS.DECISION])
          .addClick(this._ok, this)
          .setText('決定');
          
        tr.appendChild(td);
        
        if ( ! this._multiSelect) {
            tr.hide();
        }
        
        footer.appendChild(tr);
        
        var parent = this._createElm('div');
        
        this._calendar = parent.addMouseMove(this._changeState, this)
                               .addOut(this._resetState, this)
                               .addClass(this.constructor.CLASS.CALENDAR)
                               .appendChild(calendar);
                               
        this._calendar.$CLASS(this.constructor.CLASS.DRAG)
                      .addMouseDown(this._dragOn, this);
        
        this.enablePopup(false);
        Jeeel.Document.appendToBody(this._calendar.get(0));
                      
        this.constructor._initStyle();
        
        this._defaultStyle = this.constructor._defaultStyle;
        this._styleTag = this.constructor._styleTag;
    }
};

Jeeel.Class.extend(Jeeel.Gui.Calendar, Jeeel.Gui.Abstract);
