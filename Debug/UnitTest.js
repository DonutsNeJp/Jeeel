
/**
 * コンストラクタ
 * 
 * @class ユニットテストを提供するクラス(通常継承して使用する)
 */
Jeeel.Debug.UnitTest = function () {
    
};

/**
 * 複数のユニットテストクラスを渡して実行を行う<br />
 * 結果はJeeel.Debug.ErrorMessageにて表示する<br />
 * ユニットテストクラスのコンストラクタにはそのクラスのコンストラクタを実装して名前を付けておくか、<br />
 * Jeeel.Debug.Debugger.setInformationにて情報を付与しておくと見やすくなる
 * 
 * @param {Jeeel.Debug.UnitTest|Function} var_args ユニットテスト継承のクラスもしくはインスタンスを順に渡す
 * @return {Boolean} 全てのテストが正常終了したかどうか
 * @throws {Error} 引数にユニットテストクラスかインスタンス以外を渡した場合に発生
 */
Jeeel.Debug.UnitTest.test = function (var_args) {
    
    var condition = true;
    
    for (var i = 0, l = arguments.length; i < l; i++) {
        var testCase = arguments[i];
        
        if (Jeeel.Type.isFunction(testCase)) {
            testCase = new testCase();
        }
        
        if ( ! (testCase instanceof Jeeel.Debug.UnitTest)) {
            throw new Error((i + 1) + 'つ目の引数がユニットテストクラスではありません。');
        }
        
        if (i) {
            Jeeel.Debug.ErrorMessage.dump('\n\n\n\n');
        }
        
        testCase.run();
        
        var asserts = testCase.getAsserts(),
            successes = testCase.getSuccesses(),
            errors = testCase.getErrors(),
            assertLength = asserts.length,
            successLength = successes.length,
            errorLength = errors.length,
            testCount = testCase.getTestCount(),
            assertCount = testCase.getAssertCount(),
            j;
            
        for (j = 0; j < assertLength; j++) {
            var assert = asserts[j];
            
            Jeeel.Debug.ErrorMessage.dump(assert.condition ? '.' : 'F');
        }
        
        Jeeel.Debug.ErrorMessage.dump('\n\nTime: ' + testCase.getTestTime() + ' milli seconds\n');
        
        if (errorLength) {
            condition = false;
            
            Jeeel.Debug.ErrorMessage.dump('\nThere were ' + errorLength + ' errors:\n\n');
            
            for (j = 0; j < errorLength; j++) {
                var error = errors[j];
                
                Jeeel.Debug.ErrorMessage.dump((j + 1) + ') ' + error.fullMethod + '\n');
                Jeeel.Debug.ErrorMessage.dump('error: ' + error.assert + '\n\n');
                
                if (error.message) {
                    Jeeel.Debug.ErrorMessage.dump(error.message + '\n\n');
                }
            }
            
            Jeeel.Debug.ErrorMessage.dump('\nFAILURES!\n');
            Jeeel.Debug.ErrorMessage.dump('Tests: ' + testCount +', Assertions: ' + assertCount + ',  Errors: ' + errorLength + '.');
        } else {
            Jeeel.Debug.ErrorMessage.dump('OK (' + testCount + ' tests, ' + assertCount + ' assertions)');
        }
    }
    
    return condition;
};

Jeeel.Debug.UnitTest.prototype = {
  
    /**
     * テストケースで失敗したアサート情報リスト
     * 
     * @type Hash[]
     * @private
     */
    _errors: [],
    
    /**
     * テストケースで成功したアサート情報リスト
     * 
     * @type Hash[]
     * @private
     */
    _successes: [],
    
    /**
     * テストケースのアサート情報リスト
     * 
     * @type Hash[]
     * @private
     */
    _asserts: [],
    
    /**
     * 実行テストメソッドのステータス
     * 
     * @type Hash
     * @private
     */
    _runState: {},
    
    /**
     * テストを実行する
     * 
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    run: function () {},
    
    /**
     * テストケース開始時に実行されるメソッド
     */
    setUpBeforeClass: function () {
        
    },
    
    /**
     * テストメソッド前に実行されるメソッド
     */
    setUp: function () {
        
    },
    
    /**
     * テストメソッド後に実行されるメソッド
     */
    tearDown: function () {
        
    },
    
    /**
     * テストケース終了後に実行されるメソッド
     */
    tearDownAfterClass: function () {
        
    },
    
    /**
     * trueかどうか確認する
     * 
     * @param {Boolean} condition 確認する値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertTrue: function (condition, message) {
        return this._setAssertResult(condition === true, 'assertTrue', message);
    },
    
    /**
     * falseかどうか確認する
     * 
     * @param {Boolean} condition 確認する値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertFalse: function (condition, message) {
        return this._setAssertResult(condition === false, 'assertFalse', message);
    },
    
    /**
     * nullかどうか確認する
     * 
     * @param {Mixied} value 確認する値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertNull: function (value, message) {
        return this._setAssertResult(value === null, 'assertNull', message);
    },
    
    /**
     * nullじゃないかどうか確認する
     * 
     * @param {Mixied} value 確認する値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertNotNull: function (value, message) {
        return this._setAssertResult(value !== null, 'assertNotNull', message);
    },
    
    /**
     * undefined・nullかどうか確認する
     * 
     * @param {Mixied} value 確認する値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertEmpty: function (value, message) {
        return this._setAssertResult(Jeeel.Type.isEmpty(value), 'assertEmpty', message);
    },
    
    /**
     * undefined・nullじゃないかどうか確認する
     * 
     * @param {Mixied} value 確認する値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertNotEmpty: function (value, message) {
        return this._setAssertResult( ! Jeeel.Type.isEmpty(value), 'assertNotEmpty', message);
    },
    
    /**
     * 値が一致するかどうか確認する
     * 
     * @param {Mixied} expected 確認する値1
     * @param {Mixied} actual 確認する値2
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertEquals: function (expected, actual, message) {
        return this._setAssertResult(expected == actual, 'assertEquals', message);
    },
    
    /**
     * 値が一致しないかどうか確認する
     * 
     * @param {Mixied} expected 確認する値1
     * @param {Mixied} actual 確認する値2
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertNotEquals: function (expected, actual, message) {
        return this._setAssertResult(expected != actual, 'assertNotEquals', message);
    },
    
    /**
     * 値と型が一致するかどうか確認する
     * 
     * @param {Mixied} expected 確認する値1
     * @param {Mixied} actual 確認する値2
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertIdentical: function (expected, actual, message) {
        return this._setAssertResult(expected === actual, 'assertIdentical', message);
    },
    
    /**
     * 値と型が一致しないかどうか確認する
     * 
     * @param {Mixied} expected 確認する値1
     * @param {Mixied} actual 確認する値2
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertNotIdentical: function (expected, actual, message) {
        return this._setAssertResult(expected !== actual, 'assertNotIdentical', message);
    },
    
    /**
     * キーを保持するかどうか確認する
     * 
     * @param {String} key キー
     * @param {Hash} hash オブジェクト
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertHasKey: function (key, hash, message) {
        return this._setAssertResult(Jeeel.Type.keyExists(key, hash), 'assertHasKey', message);
    },
    
    /**
     * キーを保持しないかどうか確認する
     * 
     * @param {String} key キー
     * @param {Hash} hash オブジェクト
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertNotHasKey: function (key, hash, message) {
        return this._setAssertResult( ! Jeeel.Type.keyExists(key, hash), 'assertNotHasKey', message);
    },
    
    /**
     * instanceがtypeクラスかどうかを確認する
     * 
     * @param {Mixied} instance インスタンス
     * @param {Function} type クラスタイプ
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertIsA: function (instance, type, message) {
        return this._setAssertResult(Jeeel.Type.isFunction(type) && instance instanceof type, 'assertIsA', message);
    },
    
    /**
     * instanceがtypeクラスじゃないかどうかを確認する
     * 
     * @param {Mixied} instance インスタンス
     * @param {Function} type クラスタイプ
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertIsNotA: function (instance, type, message) {
        return this._setAssertResult(Jeeel.Type.isFunction(type) && ! (instance instanceof type), 'assertIsNotA', message);
    },
    
    /**
     * subjectがpatternに一致したかどうかを確認する
     * 
     * @param {RegExp} pattern 検索パターン
     * @param {String} subject 対象文字列
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertPattern: function (pattern, subject, message) {
        return this._setAssertResult(Jeeel.Type.isRegularExpression(pattern) && pattern.test(subject), 'assertPattern', message);
    },
    
    /**
     * subjectがpatternに一致しなかったかどうかを確認する
     * 
     * @param {RegExp} pattern 検索パターン
     * @param {String} subject 対象文字列
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertNoPattern: function (pattern, subject, message) {
        return this._setAssertResult(Jeeel.Type.isRegularExpression(pattern) && ! pattern.test(subject), 'assertNoPattern', message);
    },
    
    /**
     * expect &lt; valueかどうか確認する
     * 
     * @param {Number} expect 比較値
     * @param {Number} value 対象値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertGreaterThan: function (expect, value, message) {
        return this._setAssertResult(expect < value, 'assertGreaterThan', message);
    },
    
    /**
     * expect &lt;= valueかどうか確認する
     * 
     * @param {Number} expect 比較値
     * @param {Number} value 対象値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertGreaterThanOrEqual: function (expect, value, message) {
        return this._setAssertResult(expect <= value, 'assertGreaterThanOrEqual', message);
    },
    
    /**
     * expect &gt; valueかどうか確認する
     * 
     * @param {Number} expect 比較値
     * @param {Number} value 対象値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertLessThan: function (expect, value, message) {
        return this._setAssertResult(expect > value, 'assertLessThan', message);
    },
    
    /**
     * expect &gt;= valueかどうか確認する
     * 
     * @param {Number} expect 比較値
     * @param {Number} value 対象値
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertLessThanOrEqual: function (expect, value, message) {
        return this._setAssertResult(expect >= value, 'assertLessThanOrEqual', message);
    },
    
    /**
     * abs(expect - value) &lt; marginかどうかを確認する
     * 
     * @param {Number} expect 基準値
     * @param {Number} value 比較値
     * @param {Number} margin 幅
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertWithinMargin: function (expect, value, margin, message) {
        return this._setAssertResult(Math.abs(expect - value) < margin, 'assertWithinMargin', message);
    },
    
    /**
     * abs(expect - value) &gt;= marginかどうかを確認する
     * 
     * @param {Number} expect 基準値
     * @param {Number} value 比較値
     * @param {Number} margin 幅
     * @param {String} [message] エラー時に表示するカスタムメッセージ
     * @return {Jeeel.Debug.UnitTest} 自インスタンス
     */
    assertOutsideMargin : function (expect, value, margin, message) {
        return this._setAssertResult(Math.abs(expect - value) >= margin, 'assertOutsideMargin', message);
    },

    /**
     * このテストケースで実行したアサートのリストを返す
     * 
     * @return {Hash[]} アサート連想配列のリスト(condition, method, fullMethod, assert, message)
     */
    getAsserts: function () {
        return this._asserts;
    },
    
    /**
     * このテストケースで成功したアサートのリストを返す
     * 
     * @return {Hash[]} 成功連想配列のリスト(method, fullMethod, assert, message)
     */
    getSuccesses: function () {
        return this._successes;
    },
    
    /**
     * このテストケースでエラーになったアサートのリストを返す
     * 
     * @return {Hash[]} エラー連想配列のリスト(method, fullMethod, assert, message)
     */
    getErrors: function () {
        return this._errors;
    },
    
    /**
     * テストメソッドの実行回数を返す
     * 
     * @return {Integer} 実行回数
     */
    getTestCount: function () {
        return this._runState.testCount || 0;
    },
    
    /**
     * アサートメソッドの実行回数を返す
     * 
     * @return {Integer} 実行回数
     */
    getAssertCount: function () {
        return this._runState.assertCount || 0;
    },
    
    /**
     * テスト実行時間を返す
     * 
     * @return {Integer} 実行時間(ミリ秒)
     */
    getTestTime: function () {
        return this._runState.time || 0;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Debug.UnitTest,
    
    /**
     * アサートの結果をセットする
     * 
     * @param {Boolean} condition 成功したかどうか
     * @param {String} assert アサート名
     * @param {String} [message] カスタムメッセージ
     * @private
     */
    _setAssertResult: function (condition, assert, message) {
        this._runState.assertCount++;
        
        this._asserts[this._asserts.length] = {
            condition: !!condition,
            method: this._runState.method.name,
            fullMethod: this._runState.method.fullName,
            assert: assert,
            message: message || ''
        };
        
        if (condition) {
            this._setSuccess(assert, message);
        } else {
            this._setError(assert, message);
        }
        
        return this;
    },
    
    /**
     * 成功をセットする
     * 
     * @param {String} assert アサート名
     * @param {String} [message] カスタムメッセージ
     * @private
     */
    _setSuccess: function (assert, message) {
        this._successes[this._successes.length] = {
            method: this._runState.method.name,
            fullMethod: this._runState.method.fullName,
            assert: assert,
            message: message || ''
        };
    },
    
    /**
     * エラーをセットする
     * 
     * @param {String} assert アサート名
     * @param {String} [message] カスタムメッセージ
     * @private
     */
    _setError: function (assert, message) {
        this._errors[this._errors.length] = {
            method: this._runState.method.name,
            fullMethod: this._runState.method.fullName,
            assert: assert,
            message: message || ''
        };
    },
    
    _init: function () {
        var testMethodPattern = /^test.+$/;
        
        this.run = function () {
            var constructor = this.constructor,
                debugInfo = constructor[Jeeel.Debug.Debugger.INFORMATION_NAME];
            
            this._runState = {
                className: debugInfo && debugInfo.name || constructor.name,
                testCount: 0,
                assertCount: 0
            };
            
            this._asserts = [];
            this._successes = [];
            this._errors = [];
            
            this.setUpBeforeClass();
            
            var date = new Date();

            for (var key in this) {
                if (key.match(testMethodPattern) && Jeeel.Type.isFunction(this[key])) {
                    
                    this._runState.method = {
                        name: key,
                        fullName: this._runState.className ? this._runState.className + '#' + key : key
                    };
                    
                    this._runState.testCount++;
                    
                    this.setUp();
                    this[key]();
                    this.tearDown();
                }
            }
            
            this._runState.time = new Date() - date;
            
            this.tearDownAfterClass();
            
            return this;
        };
        
        delete this._init;
    }
};

Jeeel.Debug.UnitTest.prototype._init();
