Jeeel.directory.Jeeel.Class = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Class/';
    }
};

/**
 * クラスに関するネームスペース 
 */
Jeeel.Class = {
    
    /**
     * 新しいクラスを定義して返す
     * 
     * @param {Object} properties 定義クラスのプロパティ
     * @param {Function} [superClass] 継承元クラス(デフォルトはObject)
     * @return {Function} 定義したクラス
     */
    define: function (properties, superClass) {
        var subClass = function () {
            if (this._super && this._super.hasOwnProperty('__construct')) {
                this._super.__construct.apply(this, arguments);
            }
            
            if (subClass.prototype.hasOwnProperty('__construct')) {
                subClass.prototype.__construct.apply(this, arguments);
            }
        };
        
        this.extend(subClass, superClass || Object);
        
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                subClass.prototype[key] = properties[key];
            }
        }
        
        var list = ['toString', 'valueOf'];

        for (var i = list.length; i--;) {
            if (properties[list[i]] !== Object.prototype[list[i]]) {
                subClass.prototype[list[i]] = properties[list[i]];
            }
        }
        
        return subClass;
    },
    
    /**
     * クラスの継承を行う<br />
     * 継承後には_superがプロパティに反映される
     * 
     * @param {Function} subClass 継承先クラス
     * @param {Function} superClass 継承元クラス
     * @return {Function} 継承先クラス(Jeeel.Class.Abstractも同時に疑似継承する)
     * @example 
     * var Person = function () {
     * };
     * 
     * Person.prototype = {
     *     _age: 0,
     *     _weight: 0,
     *     _height: 0,
     *     _gender: '不明',
     *     
     *     getStatus: function () {
     *         return '性別: ' + this._gender + '\n'
     *              + '年齢: ' + this._age + '歳\n'
     *              + '身長: ' + this._height + 'cm\n'
     *              + '体重: ' + this._weight + 'kg\n';
     *     }
     * };
     * 
     * var Man = function (age, height, weight) {
     *     this._age = age;
     *     this._height = height;
     *     this._weight = weight;
     * };
     * 
     * Man.prototype = {
     *    _gender: '男'
     * }; 
     * 
     * Jeeel.Class.extend(Man, Person);
     * 
     * var man = new Man(25, 172, 56);
     * var status = man.getStatus();
     * 
     * // statusの値
     * 性別: 男
     * 年齢: 25歳
     * 身長: 172cm
     * 体重: 56kg
     */
    extend: function (subClass, superClass) {
        this.Abstract.prototype = superClass.prototype;
        var prototypeObject = subClass.prototype;
        
        subClass.prototype = new this.Abstract(superClass);
        
        if (prototypeObject) {
            for (var property in prototypeObject) {
                subClass.prototype[property] = prototypeObject[property];
            }
            
            var list = ['toString', 'valueOf'];
            
            for (var i = 0, l = list.length; i < l; i++) {
                if (prototypeObject[list[i]] !== Object.prototype[list[i]]) {
                    subClass.prototype[list[i]] = prototypeObject[list[i]];
                }
            }
            
            subClass.prototype.constructor = subClass;
        }
        
        this.Abstract.prototype = null;
        
        return subClass;
    }
};

Jeeel.file.Jeeel.Class = ['Abstract', 'Mixin'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Class, Jeeel.file.Jeeel.Class);