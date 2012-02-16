
Jeeel.Database.Result = function (result) {
    this._result = result;
};

Jeeel.Database.Result.prototype = {

    /**
     * @type SQLResultSet
     */
    _result: null,

    getInsertId: function () {
        return this._result.insertId;
    },

    getLength: function () {
        return this._result.rows.length;
    },

    get: function (index) {
        return this._result.rows.item(index);
    },

    getAll: function () {
        var res = [];
        var len = this.getLength();

        for (var i = 0; i < len; i++) {
            res[i] = this.get(i);
        }

        return res;
    }
};
