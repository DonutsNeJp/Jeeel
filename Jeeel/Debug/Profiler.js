Jeeel.directory.Jeeel.Debug.Profiler = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Debug + 'Profiler/';
    }
};

/**
 * @staticClass メソッドのプロファイリング機能を提供するスタティッククラス
 */
Jeeel.Debug.Profiler = {
  
    /**
     * メソッドの呼び出しの際に一時的に借りる名前
     *
     * @type String
     * @constant
     */
    TEMPORARY_METHOD_NAME: '@JEEEL-METHOD@',
    
    /**
     * プロファイルが完了しているものに対してチェックと入れるためのキー
     * 
     * @type String
     * @constant
     */
    PROFILE_CHECK_NAME: '@PROFILE-CHECK@',
    
    /**
     * メソッド実行ログ
     * 
     * @type Jeeel.Debug.Profiler.Profile[]
     * @private
     */
    _logs: [],
    
    /**
     * 1メソッドが現在までの掛かった時間の総合計
     * 
     * @type Hash
     * @private
     */
    _times: {},
    
    /**
     * 1メソッドが現在までに呼ばれた回数
     * 
     * @type Hash
     * @private
     */
    _counts: {},
    
    /**
     * 現在呼び出されているメソッドのチェイン階層
     * 
     * @type Integer
     * @private
     */
    _hierarchy: 0,
    
    /**
     * 現在アクセス中のデータ
     * 
     * @type Jeeel.Debug.Profiler.Profile
     * @private
     */
    _accessData: null,
    
    /**
     * メソッド呼び出しの書き込みデータ
     * 
     * @type Jeeel.Debug.Profiler.Profile
     * @private
     */
    _data: null,
    
    /**
     * 指定したオブジェクト以下のメソッドをプロファイリング対象にする
     * 
     * @param {Object|Function} object プロファイリング対象のメソッドを保持するオブジェクトもしくは関数
     * @param {String} name オブジェクトの名前
     * @param {Boolean} [deepSet] オブジェクトのプロパティに対して再帰的にプロファイリングするかどうか
     * @return {Jeeel.Debug.Profiler} 自クラス
     */
    profile: function (object, name, deepSet) {
      
        if ( ! object || object === this) {
            return this;
        }
        
        var type = typeof object;
        
        if (type !== 'object' && type !== 'function') {
            return this;
        } else if ('nodeType' in object) {
            return this;
        } else if ('Object' in object && 'Array' in object && 'String' in object && 'Number' in object && 'Boolean' in object && 'Function' in object) {
            return this;
        } else if ( ! object.hasOwnProperty || object.hasOwnProperty(this.PROFILE_CHECK_NAME) && object[this.PROFILE_CHECK_NAME]) {
            return this;
        }
        
        object[this.PROFILE_CHECK_NAME] = name;
        
        var property;
        
        for (var propertyName in object) {
            try {
                property = object[propertyName];
            } catch (e) {
                continue;
            }
            
            if ( ! property || propertyName === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                continue;
            } else if ( ! property.hasOwnProperty || property.hasOwnProperty(this.PROFILE_CHECK_NAME) && property[this.PROFILE_CHECK_NAME]) {
                continue;
            }
            
            var fullName = (arguments[3] ? name + '#' + propertyName : name + '.' + propertyName);
            var propertyType = typeof property;
            
            if (deepSet) {
                this.profile(property, fullName, deepSet);
            }

            if (property instanceof Function && ! property.toString().match(/\{(\n|\s)+\[native code\](\n|\s)+\}/)) {
                object[propertyName] = this._getProfilingClosure(name, propertyName, fullName, object, property);
                
                for (var key in property) {
                    try {
                        object[propertyName][key] = property[key];
                    } catch (e) {
                        continue;
                    }
                }
                
                object[propertyName].prototype = property.prototype;
                
                object[propertyName][this.PROFILE_CHECK_NAME] = fullName;
            }
        }
        
        if (deepSet && object instanceof Function) {
            this.profile(object.prototype, name, deepSet, true);
        }
        
        return this;
    },
    
    /**
     * 現在までに呼び出されたメソッドのプロファイルを全て取得する
     * 
     * @return {Jeeel.Debug.Profiler.ProfileManager} プロファイル管理オブジェクト
     */
    getProfiles: function () {
        var manager = new this.ProfileManager();
        
        for (var i = 0, l = this._logs.length; i < l; i++) {
            manager.addProfile(this._logs[i]);
        }
        
        return manager;
    },
    
    getProfileHash: function (compareFunction) {
        var methodName,
            time,
            cnt,
            avg, 
            tmp = [],
            res = {};

        for (methodName in this._times) {
            if (methodName === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                continue;
            }

            time = this._times[methodName];
            cnt = this._counts[methodName];
            avg = time / this._counts[methodName];
            tmp[tmp.length] = [methodName, time, cnt, avg];
        }
        
        tmp.sort(compareFunction || function (a, b) {
            return b[1] - a[1];
        });
        
        for (var i = 0, l = tmp.length; i < l; i++) {
            res[tmp[i][0]] = tmp[i][1] + 'ms / ' + tmp[i][2] + 'times = ' + tmp[i][3] + 'ms/time';
        }

        return res;
    },
    
    getAverageProfileHash: function (compareFunction) {
        var methodName,
            avg, 
            tmp = [],
            res = {};

        for (methodName in this._times) {
            if (methodName === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                continue;
            }

            avg = this._times[methodName] / this._counts[methodName];
            tmp[tmp.length] = [methodName, avg];
        }
        
        tmp.sort(compareFunction || function (a, b) {
            return b[1] - a[1];
        });
        
        for (var i = 0, l = tmp.length; i < l; i++) {
            res[tmp[i][0]] = tmp[i][1];
        }

        return res;
    },
    
    /**
     * 現在までの呼び出されたメソッドの平均呼び出し時間のプロファイルを取得する
     * 
     * @return {Jeeel.Debug.Profiler.ProfileManager} プロファイル管理オブジェクト
     */
    getAverageProfiles: function () {
        var manager = new this.ProfileManager();
        
        if ( ! this._logs.length) {
            return manager;
        }
        
        var avg, methodName;
        
        for (methodName in this._times) {
            if (methodName === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                continue;
            }
            
            avg = this._times[methodName] / this._counts[methodName];
            manager.addProfile(new this.Profile(methodName, null, avg));
        }
        
        return manager;
    },
    
    /**
     * 現在までに収集したプロファイルの中から一番時間がかかっているプロファイルを取得する
     * 
     * @return {Jeeel.Debug.Profiler.Profile} 最遅のメソッドプロファイル
     */
    getBottleneckProfile: function () {
        if ( ! this._logs.length) {
            return null;
        }
        
        var max = this._logs[0].time,
            l = this._logs.length,
            i = 1,
            j = 0;

        for (; i < l; i++) {
            if (max < this._logs[i].time) {
                max = this._logs[i].time;
                j = i;
            }
        }
        
        return this._logs[j];
    },
    
    /**
     * 現在までに呼び出されたメソッドの中で平均で一番時間が掛かっているメソッドのプロファイルを取得する
     * 
     * @return {Jeeel.Debug.Profiler.Profile} 平均が最遅のメソッドプロファイル
     */
    getBottleneckAverageProfile: function () {
        if ( ! this._logs.length) {
            return null;
        }
        
        var first = true,
            max, 
            avg, 
            key;

        for (var methodName in this._times) {
            if (methodName === Jeeel.Debug.Debugger.INFORMATION_NAME) {
                continue;
            }
            
            avg = this._times[methodName] / this._counts[methodName];
            
            if (first) {
                max = avg;
                key = methodName;
                first = false;
            } else if (max < this._times[methodName]) {
                max = avg;
                key = methodName;
            }
        }
        
        return new this.Profile(key, null, max);
    },
    
    /**
     * プロファイリングのためのクロージャを取得する
     * 
     * @param {String} name メソッドの持ち主の名前
     * @param {String} property メソッド自身の名前
     * @param {String} fullName メソッドのネームスペース・クラスネームを含めた名前
     * @param {Object} owner メソッドの持ち主
     * @param {Function} func メソッド
     * @return {Function} プロファイリングクロージャ
     * @private
     */
    _getProfilingClosure: function (name, property, fullName, owner, func) {
        var self = this;
        
        return function () {
            var tmp,
                res, 
                time;

            if ( ! self._hierarchy) {
                self._accessData = self._data = new self.Profile(fullName, this);
            } else {
                tmp = self._accessData;

                self._accessData = tmp.calls[tmp.calls.length] = new self.Profile(fullName, this);
            }

            self._hierarchy++;

            time = (new Date()).getTime();

            try {
                
                // このクロージャインスタンスだったらインスタンスの作成を行う
                if (this instanceof arguments.callee && this.constructor === arguments.callee.prototype.constructor) {
                  
                    owner[self.TEMPORARY_METHOD_NAME] = func;
                    
                    // 引数が5つまでは高速化のために直接記述
                    switch (arguments.length) {
                        case 0:
                            res = new owner[self.TEMPORARY_METHOD_NAME]();
                            break;
                            
                        case 1:
                            res = new owner[self.TEMPORARY_METHOD_NAME](arguments[0]);
                            break;
                            
                        case 2:
                            res = new owner[self.TEMPORARY_METHOD_NAME](arguments[0], arguments[1]);
                            break;
                            
                        case 3:
                            res = new owner[self.TEMPORARY_METHOD_NAME](arguments[0], arguments[1], arguments[2]);
                            break;
                            
                        case 4:
                            res = new owner[self.TEMPORARY_METHOD_NAME](arguments[0], arguments[1], arguments[2], arguments[3]);
                            break;
                            
                        case 5:
                            res = new owner[self.TEMPORARY_METHOD_NAME](arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                            break;
                            
                        default:
                            res = (function (obj, methodName) {
                                methodName = 'new this["' + methodName + '"]';

                                return function () {
                                    var params = [];

                                    for (var i = arguments.length; i--;) {
                                        params[i] = "_" + i;
                                    }

                                    params = params.join(',');

                                    return Function(
                                        params,
                                        'return ' + methodName + '(' + params + ')'
                                    ).apply(obj, arguments);
                                };
                            })(owner, self.TEMPORARY_METHOD_NAME).apply(null, arguments);                
                            break;
                    }
                    
                    delete owner[self.TEMPORARY_METHOD_NAME];
                    
                } else {
                    res = func.apply(this, arguments);
                }
                
            } catch (e) {
                
                // エラー補足のための補助をする
                if ( ! e.jeeelStackTrace) {
                    e.jeeelStackTrace = [];
                }
                
                e.jeeelStackTrace[e.jeeelStackTrace.length] = fullName;
                
                throw e;
                
            } finally {
                time = (new Date()).getTime() - time;

                self._hierarchy--;

                if ( ! self._times[fullName]) {
                    self._counts[fullName] = 0;
                    self._times[fullName] = 0;
                }

                self._counts[fullName]++;
                self._times[fullName] += time;

                if ( ! self._hierarchy) {
                    self._data.time = time;

                    self._logs[self._logs.length] = self._data;
                } else {
                    self._accessData.time = time;
                    self._accessData = tmp;
                }
            }

            return res;
        };
    }
};

Jeeel.file.Jeeel.Debug.Profiler = ['Profile', 'ProfileManager'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Debug.Profiler, Jeeel.file.Jeeel.Debug.Profiler);
