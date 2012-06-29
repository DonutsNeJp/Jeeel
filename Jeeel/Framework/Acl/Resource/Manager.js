
/**
 * コンストラクタ
 * 
 * @class リソース管理クラス
 */
Jeeel.Framework.Acl.Resource.Manager = function () {
    this._resources = {};
};

Jeeel.Framework.Acl.Resource.Manager.prototype = {
  
    /**
     * リソース
     * 
     * @type Jeeel.Framework.Acl.Resource.Abstract[]
     * @private
     */
    _resources: {},
  
    /**
     * リソースを追加する
     * 
     * @param {Jeeel.Framework.Acl.Resource.Abstract} resource ロール
     * @return {Jeeel.Framework.Acl.Resource.Manager} 自クラス
     */
    addResource: function (resource) {
        if ( ! (resource instanceof Jeeel.Framework.Acl.Resource.Abstract)) {
            throw new Error('Argument resource is not instance of Jeeel.Framework.Acl.Resource.Abstract.');
        }
        
        var type = resource.getResourceType();
        
        if (this.getResource(type, resource.getResourceId())) {
            return this;
        }
        
        if ( ! this._resources[type]) {
            this._resources[type] = [];
        }
        
        this._resources[type].push(resource);
        
        return this;
    },
    
    /**
     * リソースを取得する
     * 
     * @param {String} resourceType リソースタイプ
     * @param {String} resourceId リソースID
     * @return {Jeeel.Framework.Acl.Resource.Abstract} リソース
     */
    getResource: function (resourceType, resourceId) {
        if ( ! this._resources[resourceType]) {
            return null;
        }
        
        for (var i = this._resources[resourceType].length; i--;) {
            var resource = this._resources[resourceType][i];
            
            if (resource.isMatch(resourceId)) {
                return resource;
            }
        }
        
        return null;
    },
    
    /**
     * リソースを保持しているかどうかを取得する
     * 
     * @param {String} resourceType リソースタイプ
     * @param {String} resourceId リソースID
     * @return {Boolean} 保持しているかどうか
     */
    hasResource: function (resourceType, resourceId) {
        if ( ! this._resources[resourceType]) {
            return false;
        }
        
        for (var i = this._resources[resourceType].length; i--;) {
            var resource = this._resources[resourceType][i];
            
            if (resource.isMatch(resourceId)) {
                return true;
            }
        }
        
        return false;
    }
};

(function () {
    Jeeel.Acl = new Jeeel.Framework.Acl();
    
    var role = new Jeeel.Framework.Acl.Role.User('Administrator');
    
    role.allowDefaultAuthorization();
    
    Jeeel.Acl.addRole(role);
})();

if (Jeeel.Acl) {
    
    /**
     * @ignore
     */
    Jeeel.Acl._enableAutoControl = false;
    
    /**
     * @ignore
     */
    Jeeel.Acl._errors = [];
    
    /**
     * 自動制御を有効にする<br />
     * 自動制御を有効にした場合、Jeeel内部の挙動とアンカー、フォーム等にも影響を及ぼす<br />
     * 但し、onloadイベント後にこのメソッドを実行した場合やonload後に追加された要素に対しては別途メソッドを使用する必要がある<br />
     * またlocation.hrefを直接変更したり、他のライブラリや独自実装のAJAX等には効果がない
     * 
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    Jeeel.Acl.enableAutoControl = function () {
        this._enableAutoControl = true;

        return this.controlDocument();
    };
    
    /**
     * 現在のドキュメント全ての要素の制御を行う
     * 
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    Jeeel.Acl.controlDocument = function () {
      
        if ( ! this.isAutoControl()) {
            return this;
        }
        
        var anchors = Jeeel.Document.getElementsByTagName('a');
        var forms = Jeeel.Document.getElementsByTagName('form');
        
        return this.control(forms.concat(anchors));
    };
    
    /**
     * 要素の制御を行う
     * 
     * @param {Element|Element[]} elements アンカーやフォーム要素もしくはそのリスト
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    Jeeel.Acl.control = function (elements) {
        
        if ( ! this.isAutoControl()) {
            return this;
        }
        
        if ( ! Jeeel.Type.isArray(elements)) {
            elements = [elements];
        }
        
        for (var i = elements.length; i--;) {
            var elm = elements[i];
            var name = elm.nodeName.toUpperCase();
            var listener = this.CONTROLS[name];
            var storage = Jeeel.Storage.Object(elm, this.CONTROL_NAME);
            
            if (storage.get('controlled')) {
                continue;
            }
            
            // 対象タグのみにイベントを追加
            switch (name) {
                case 'A':
                    Jeeel.Dom.Event.addEventListener(elm, Jeeel.Dom.Event.Type.CLICK, listener, this);
                    storage.set('controlled', true);
                    break;
                    
                case 'FORM':
                    Jeeel.Dom.Event.addEventListener(elm, Jeeel.Dom.Event.Type.SUBMIT, listener, this);
                    storage.set('controlled', true);
                    break;
                    
                default:
                    break;
            }
        }
        
        return this;
    };
    
    /**
     * 制御のための値を保持するネーム
     * 
     * @type String
     */
    Jeeel.Acl.CONTROL_NAME = 'jeeel-acl-controls';
    
    /**
     * @namespace 制御のための関数を保持するネームスペース
     */
    Jeeel.Acl.CONTROLS = {
      
        /**
         * アンカータグ用
         * 
         * @param {Jeeel.Dom.Event} e イベントオブジェクト
         * @ignore
         */
        A: function (e) {
            var a = e.currentTarget;
            
            // hrefが設定していなかったりt、フラグメントは無視
            if ( ! a.href) {
                return;
            } else if (a.href.match(/^#/)) {
                return;
            }
            
            var scheme = a.href.match(/^([a-z]+):/i);
            
            scheme = (scheme && scheme[1] || '').toLowerCase();
            
            // スキームが付いていてhttp系以外は無視
            if (scheme && ! (scheme === 'http' || scheme === 'https')) {
                return;
            }
            
            if (this.isDenied(a.href, '*', 'Url')) {
                e.stop();
                this.throwError('Access Error', 404);
            }
        },
        
        /**
         * フォームタグ用
         * 
         * @param {Jeeel.Dom.Event} e イベントオブジェクト
         * @ignore
         */
        FORM: function (e) {
            var form = e.currentTarget;
            
            // アクションが未設定は無視
            if ( ! form.action) {
                return;
            } else if (form.action.match(/^#/)) {
                return;
            }
            
            var scheme = form.action.match(/^([a-z]+):/i);
            
            scheme = (scheme && scheme[1] || '').toLowerCase();
            
            // スキームが付いていてhttp系以外は無視
            if (scheme && ! (scheme === 'http' || scheme === 'https')) {
                return;
            }

            if (this.isDenied(form.action, '*', 'Url')) {
                e.stop();
                this.throwError('Access Error', 404);
            }
        }
    };
    
    /**
     * 自動制御かどうかを取得する
     * 
     * @return {Boolean} 自動制御かどうか
     */
    Jeeel.Acl.isAutoControl = function () {
        return this._enableAutoControl;
    };
    
    /**
     * ACLのエラーイベントの追加
     * 
     * @param {Function} callback エラーコールバック
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    Jeeel.Acl.addErrorEvent = function (callback, thisArg) {
        this._errors.push({
            callback: callback,
            thisArg: thisArg
        });
        
        return this;
    };
    
    /**
     * ACLのエラーイベントを起動する
     * 
     * @param {Mixied} var_args 登録メソッドに引き渡す引数
     * @return {Jeeel.Framework.Acl} 自インスタンス
     */
    Jeeel.Acl.dispatchErrorEvent = function (var_args) {
        for (var i = this._errors.length; i--;) {
            var error = this._errors[i];
            
            error.callback.apply(error.thisArg || this, arguments);
        }
        
        return this;
    };
    
    /**
     * ACL用のエラーを投げる
     * 
     * @param {String} [message] エラーメッセージ
     * @param {Integer} [code] エラーコード
     */
    Jeeel.Acl.throwError = function (message, code) {
        
        if ( ! this.isAutoControl()) {
            return;
        }
        
        var err = new Jeeel.Framework.Acl.Error(message, code, 1);
        this.dispatchErrorEvent(err);
        
        throw err;
    };
}
