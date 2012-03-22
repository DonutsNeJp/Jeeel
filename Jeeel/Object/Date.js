
/**
 * コンストラクタ
 *
 * @class 日付関係に関する操作を手助けするクラス
 * @param {Date|String|Integer|Jeeel.Object.Date} [date] 基となるDateオブジェクトやDateString(省略は現時刻)
 */
Jeeel.Object.Date = function (date) {

    if (Jeeel.Type.isString(date)) {
        date = new Date(date.replace(/-/g, '/'));
    } else if (Jeeel.Type.isInteger(date)) {
        date = new Date(date);
    } else if (date instanceof Jeeel.Object.Date) {
        date = new Date(date.getTime());
    }

    if ( ! Jeeel.Type.isDate(date)) {
        date = new Date();
    }

    this._date = date;
    
    this._refreshProperty();
    
    this._timestamp = new Date();
};

/**
 * インスタンスの作成を行う
 *
 * @param {Date|String|Integer|Jeeel.Object.Date} [date] 基となるDateオブジェクトやDateString(省略は現時刻)
 * @return {Jeeel.Object.Date} 作成したインスタンス
 */
Jeeel.Object.Date.create = function (date) {
    return new this(date);
};

/**
 * 指定した日付からインスタンスの作成を行う(全省略は現時刻)
 *
 * @param {Integer} [year] 年
 * @param {Integer} [month] 月
 * @param {Integer} [day] 日
 * @param {Integer} [hour] 時
 * @param {Integer} [minute] 分
 * @param {Integer} [second] 秒
 * @param {Integer} [millisecond] ミリ秒
 * @return {Jeeel.Object.Date} 作成したインスタンス
 */
Jeeel.Object.Date.createDate = function (year, month, day, hour, minute, second, millisecond) {
    var i, l = arguments.length;
    
    for (i = 0; i < l; i++) {
        if (Jeeel.Type.isEmpty(arguments[i])) {
            arguments[i] = null;
        }
    }

    if (Jeeel.Type.isSet(month)) {
        arguments[1]--;
    } else if (Jeeel.Type.isSet(year)) {
        arguments[1] = 0;
        l++;
    }
    
    return new this(Jeeel.Function.toNative(Jeeel._global, 'Date', true).apply(null, arguments));
};

/**
 * 指定した日付が存在するかどうかチェックする
 *
 * @param {Digit} year 年
 * @param {Digit} [month] 月
 * @param {Digit} [day] 日
 * @param {Digit} [hour] 時
 * @param {Digit} [minute] 分
 * @param {Digit} [second] 秒
 * @param {Digit} [millisecond] ミリ秒
 * @return {Boolean} 日付が存在するかどうか
 */
Jeeel.Object.Date.checkDate = function (year, month, day, hour, minute, second, millisecond) {
    var date = this.createDate.apply(this, arguments);

    return date.year === +year
        && date.month === (+month || 1)
        && date.date === (+day || 1)
        && date.hour === (+hour || 0)
        && date.minute === (+minute || 0)
        && date.second === (+second || 0)
        && date.millisecond === (+millisecond || 0);
};

/**
 * 指定した日付文字列を1970年1月1日0時0分0秒(UTC)からの経過ミリ秒に変換する
 * 
 * @param {String} dateString 日付文字列
 * @return {Integer} 経過ミリ秒
 */
Jeeel.Object.Date.parse = function (dateString) {
    return Date.parse((dateString || '').replace(/-/g, '/'));
};

/**
 * ミリ秒を日に換算し変換する
 * 
 * @param {Integer} time ミリ秒
 * @return {Number} 日
 */
Jeeel.Object.Date.timeToDate = function (time) {
    return time / 86400000;
};

/**
 * ミリ秒を時に換算し変換する
 * 
 * @param {Integer} time ミリ秒
 * @return {Number} 時
 */
Jeeel.Object.Date.timeToHour = function (time) {
    return time / 3600000;
};

/**
 * ミリ秒を分に換算し変換する
 * 
 * @param {Integer} time ミリ秒
 * @return {Number} 分
 */
Jeeel.Object.Date.timeToMinute = function (time) {
    return time / 60000;
};

/**
 * ミリ秒を秒に換算し変換する
 * 
 * @param {Integer} time ミリ秒
 * @return {Number} 分
 */
Jeeel.Object.Date.timeToSecond = function (time) {
    return time / 1000;
};

/**
 * 曜日と曜日を表す数値のペアリスト
 *
 * @type String[]
 * @constant
 */
Jeeel.Object.Date.DAYS = ['日', '月', '火', '水', '木', '金', '土'];

Jeeel.Object.Date.prototype = {

    /**
     * 基となるDateオブジェクト
     *
     * @type Date
     */
    _date: null,

    /**
     * このインスタンスを作成した日付
     *
     * @type Date
     */
    _timestamp: null,
    
    /**
     * 年
     * 
     * @type Integer
     */
    year: 0,
    
    /**
     * 月(1～12)
     * 
     * @type Integer
     */
    month: 0,
    
    /**
     * 日
     * 
     * @type Integer
     */
    date: 0,
    
    /**
     * 時
     * 
     * @type Integer
     */
    hour: 0,
    
    /**
     * 分
     * 
     * @type Integer
     */
    minute: 0,
    
    /**
     * 秒
     * 
     * @type Integer
     */
    second: 0,
    
    /**
     * ミリ秒
     * 
     * @type Integer
     */
    millisecond: 0,
    
    /**
     * 1970年1月1日0時0分0秒(UTC)からの経過ミリ秒
     * 
     * @type Integer
     */
    time: 0,
    
    /**
     * Dateオブジェクトを取得する
     * 
     * @return {Date} 取得したDateオブジェクト
     */
    getDateObject: function () {
        return this._date;
    },
    
    /**
     * 年を取得する
     * 
     * @return {Integer} 年
     */
    getYear: function () {
        return this._date.getFullYear();
    },
    
    /**
     * 月を取得する
     * 
     * @return {Integer} 月(1～12)
     */
    getMonth: function () {
        return this._date.getMonth() + 1;
    },
    
    /**
     * 日を取得する
     * 
     * @return {Integer} 日
     */
    getDate: function () {
        return this._date.getDate();
    },
    
    /**
     * 時を取得する
     * 
     * @return {Integer} 時
     */
    getHour: function () {
        return this._date.getHours();
    },
    
    /**
     * 分を取得する
     * 
     * @return {Integer} 分
     */
    getMinute: function () {
        return this._date.getMinutes();
    },
    
    /**
     * 秒を取得する
     * 
     * @return {Integer} 秒
     */
    getSecond: function () {
        return this._date.getSeconds();
    },
    
    /**
     * ミリ秒を取得する
     * 
     * @return {Integer} ミリ秒
     */
    getMillisecond: function () {
        return this._date.getMilliseconds();
    },
    
    /**
     * 1970年1月1日0時0分0秒(UTC)からの経過ミリ秒を取得する(オフセットを考慮)
     * 
     * @return {Integer} 経過ミリ秒
     */
    getTime: function () {
        return this._date.getTime();
    },
    
    /**
     * 1970年1月1日0時0分0秒(UTC)からの経過ミリ秒を取得する(オフセットを無視)
     * 
     * @return {Integer} 経過ミリ秒
     */
    getUtcTime: function () {
        return Date.UTC(this.year, this.month - 1, this.date, this.hour, this.minute, this.second, this.millisecond);
    },
    
    /**
     * 曜日を示す数を取得する
     * 
     * @return {Integer} 曜日を示す数(0～6)
     */
    getDay: function () {
        return this._date.getDay();
    },
    
    /**
     * 曜日名を取得する
     *
     * @return {String} 曜日の短縮名(日,月,火,...等)
     */
    getDayName: function () {
        return this.constructor.DAYS[this._date.getDay()];
    },

    /**
     * 作成時からの経過時間を返す
     *
     * @return {Integer} 作成時からの経過時間(ミリ秒)
     */
    getElapsedTime: function () {
        var now  = new Date();
        return now.getTime() - this._timestamp.getTime();
    },
    
    /**
     * 作成時からの経過時間を設定する
     *
     * @param {Integer} time 作成時からの経過時間(ミリ秒)
     * @return {Jeeel.Object.Date} 自インスタンス
     */
    setElapsedTime: function (time) {
        var now  = new Date();

        this._timestamp.setTime(now.getTime() - time);
        
        return this;
    },

    /**
     * 作成時からの経過時間を加味して新しくインスタンスを作成する
     *
     * @return {Jeeel.Object.Date} 新しく作成したインスタンス
     */
    getInstanceAddElapsedTime: function () {
        var time = this.getElapsedTime();

        return Jeeel.Object.Date.create(this.time + time);
    },
    
    /**
     * この週の日のリストを取得する<br />
     * 週は日曜から土曜となるように返す<br />
     * なお週なので前の月や次の月の日付が紛れる事がある
     * 
     * @return {Integer[]} 日リスト
     */
    getDatesOfWeek: function () {
        var date = new Date(this.year, this._date.getMonth(), this.date - this.getDay());
        var res  = [];

        do {
            res[res.length] = date.getDate();

            date.setDate(date.getDate() + 1);
        } while(date.getDay() !== 0);

        return res;
    },

    /**
     * この月の日のリストを取得する
     *
     * @return {Integer[]} 日リスト
     */
    getDatesOfMonth: function () {
        var month = this._date.getMonth();
        var date  = new Date(this.year, month, 1);
        var res   = [];

        while(date.getMonth() === month) {
            res[res.length] = date.getDate();

            date.setDate(date.getDate() + 1);
        }

        return res;
    },

    /**
     * Unix関連で良く使用されるUnixTimeを取得する
     *
     * @return {Integer} UnixTime(秒)
     */
    getUnixTime: function () {
        return Math.floor(this.time / 1000);
    },
    
    /**
     * 日付を加算する
     * 
     * @param {Integer} [year] 年
     * @param {Integer} [month] 月
     * @param {Integer} [day] 日
     * @param {Integer} [hour] 時
     * @param {Integer} [minute] 分
     * @param {Integer} [second] 秒
     * @param {Integer} [millisecond] ミリ秒
     * @return {Jeeel.Object.Date} 自インスタンス
     */
    add: function (year, month, day, hour, minute, second, millisecond) {
        var list = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds', 'Milliseconds'];
        
        for (var i = 0, l = Math.min(arguments.length, list.length); i < l; i++) {
            var setter = 'set' + list[i];
            var getter = 'get' + list[i];
            
            this._date[setter](this._date[getter]() + (+arguments[i]));
        }
        
        return this._refreshProperty();
    },
    
    /**
     * 日付を減算する
     * 
     * @param {Integer} [year] 年
     * @param {Integer} [month] 月
     * @param {Integer} [day] 日
     * @param {Integer} [hour] 時
     * @param {Integer} [minute] 分
     * @param {Integer} [second] 秒
     * @param {Integer} [millisecond] ミリ秒
     * @return {Jeeel.Object.Date} 自インスタンス
     */
    sub: function (year, month, day, hour, minute, second, millisecond) {
        var list = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes', 'Seconds', 'Milliseconds'];
        
        for (var i = 0, l = Math.min(arguments.length, list.length); i < l; i++) {
            var setter = 'set' + list[i];
            var getter = 'get' + list[i];
            
            this._date[setter](this._date[getter]() - (+arguments[i]));
        }
        
        return this._refreshProperty();
    },
    
    /**
     * この日付から指定した日付に時間経過した場合に発生するイベントの追加を行う<br />
     * この日付より後の実行日付でなければ登録は無効化される
     * 
     * @param {Function} listener 登録メソッド(引数には自インスタンス、実行日付インスタンス、任意の引数)
     * @param {Jeeel.Object.Date} date 実行日付を示すオブジェクト
     * @param {Mixied} var_args 登録メソッドに引き渡す引数
     * @return {Jeeel.Object.Date} 自インスタンス
     * @example 
     * var date1 = Jeeel.Object.Date.createDate(2010, 5, 6, 22, 10);
     * var date2 = Jeeel.Object.Date.createDate(2010, 5, 7, 22, 10);
     * 
     * date1.addTimeoutEvent(
     *     function (baseDate, execDate, name) {
     *         alert(name + 'さん ' + baseDate.toString('Y-m-d H:i:s') + 'から、' + execDate.toString('Y-m-d H:i:s') + 'へ時間経過しました。');
     *     }, 
     *     date2,
     *     'Ken'
     * );
     * 
     * // date1が作成されてから丸一日経った時間にイベントが実行される
     * // Kenさん 2011-05-06 22:10:00から、2011-05-07 22:10:00に時間経過しました。
     */
    addTriggerDateEvent: function (listener, date, var_args) {
        if ( ! (date instanceof Jeeel.Object.Date) || this >= date) {
            return this;
        }
        
        var _listener = function () {
            listener.apply(null, arguments);
        };
        
        var args = Array.prototype.slice.call(arguments, 2, arguments.length);
        
        args.unshift(
            _listener,
            date - (this + this.getElapsedTime()),
            this,
            date
        );
        
        if (args[1] <= 0) {
            args[1] = 1;
        }
        
        Jeeel.Timer.setTimeout.apply(null, args);
        
        return this;
    },

    /**
     * SQL等でよく使用されるDate形式の文字列に変換する
     *
     * @return {String} Date形式の文字列
     */
    toSqlDate: function () {
        return this.year + '-'
             + this._getNum(this.month) + '-'
             + this._getNum(this.date);
    },

    /**
     * SQL等でよく使用されるDateTime形式の文字列に変換する
     *
     * @return {String} DateTime形式の文字列
     */
    toSqlDateTime: function () {
        return this.year + '-'
             + this._getNum(this.month) + '-'
             + this._getNum(this.date) + ' '
             + this._getNum(this.hour) + ':'
             + this._getNum(this.minute) + ':'
             + this._getNum(this.second);
    },
    
    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Date} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Date(this);
    },
    
    /**
     * コンストラクタ
     * 
     * @param {Date|String|Integer|Jeeel.Object.Date} [date] 基となるDateオブジェクトやDateString(省略は現時刻)
     * @constructor
     */
    constructor: Jeeel.Object.Date,

    /**
     * 指定したフォーマットに従って文字列変換する<br />
     * フォーマットはphpのdateフォーマットと同等である<br />
     * なお一部は日本語化されており、英語での表記は出ないので注意
     *
     * @param {String} [format] フォーマット(省略時はDateTime形式になる)
     * @return {String} 変換後の文字列
     */
    toString: function (format) {

        if ( ! Jeeel.Type.isString(format)) {
            format = 'Y-m-d H:i:s';
        }

        var year     = this.year;
        var month    = this.month;
        var date     = this.date;
        var hour     = this.hour;
        var minute   = this.minute;
        var second   = this.second;
        var unixTime = this.getUnixTime();
        var day      = this._date.getDay();

        var lastDate = (new Date(year, month, 0)).getDate();

        var halfHour = hour % 12;
        var amString = (hour < 12 ? 'am' : 'pm');

        if (halfHour == 0) {
            halfHour = 12;
        }

        /**
         * @ignore
         */
        var formatList = {
            d: this._getNum(date),
            D: this.constructor.DAYS[day],
            j: date,
            l: this.constructor.DAYS[day] + '曜日',
            N: (day == 0 ? 7 : day),
            w: day,
            m: this._getNum(month),
            n: month,
            t: lastDate,
            Y: year,
            y: year.toString().substr(2, 4),
            a: amString,
            A: amString.toUpperCase(),
            g: halfHour,
            G: hour,
            h: this._getNum(halfHour),
            H: this._getNum(hour),
            i: this._getNum(minute),
            s: this._getNum(second),
            U: unixTime
        };

        for (var key in formatList) {
            var reg = new RegExp(key, 'g');
            
            format = format.replace(reg, formatList[key]);
        }

        return format;
    },

    /**
     * 現在の時刻を表すミリ秒を返す<br />
     * 1970年1月1日0時0分0秒(UTC)からの経過ミリ秒
     *
     * @return {Integer} 取得した経過ミリ秒
     */
    valueOf: function () {
        return this.time;
    },
    
    /**
     * 数値を二桁にフォーマットする
     * 
     * @param {Integer} num 数値
     * @return {String} フォーマット後の値
     * @private
     */
    _getNum: function (num) {
        num = '' + num;

        if (num.length < 2) {
            num = '0' + num;
        }

        return num;
    },
    
    /**
     * プロパティを更新する
     * 
     * @return {Jeeel.Object.Date} 自インスタンス
     * @private
     */
    _refreshProperty: function () {
        this.year  = this.getYear();
        this.month = this.getMonth();
        this.date  = this.getDate();
        this.hour  = this.getHour();
        this.minute = this.getMinute();
        this.second = this.getSecond();
        this.millisecond = this.getMillisecond();
        this.time = this.getTime();
        
        return this;
    }
};
