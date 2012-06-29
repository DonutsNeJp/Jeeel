Jeeel.directory.Jeeel.Framework = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel + 'Framework/';
    }
};

/**
 * @namespace 大規模アプリケーション開発を円滑にするための汎用クラス等を保持するネームスペース
 * @see Jeeel.Framework.EventDispatcher
 * @see Jeeel.Framework.Event
 * @see Jeeel.Framework.Layer
 * @see Jeeel.Framework.Net.Connect
 * @see Jeeel.Framework.Mvc.Model
 * @see Jeeel.Framework.Mvc.View
 * @see Jeeel.Framework.Mvc.Controller
 * @see Jeeel.Framework.Acl
 * @see Jeeel.Framework.Acl.Role.Abstract
 * @see Jeeel.Framework.Acl.Resource.Abstract
 * @see Jeeel.Framework.Acl.Role.User
 * @see Jeeel.Framework.Acl.Resource.Url
 * @example
 * Frameworkネームスペース以下は大規模アプリケーション開発の補助ツールを提供する
 * この機能は現在大きく分けてMVCモデルのアプリの枠組みとACLを用いた認証システム機能を保持する
 * 
 * 
 * MVCモデル
 * この機能は継承前提のモデルであり枠組みとして使用するクラスも既に継承関係がある状態である
 * 枠組みに入る前の基底クラスを以下に示す
 * 
 * Jeeel.Framework.EventDispatcher
 * このクラスはイベントの送信、ハンドリングなどイベントの操作を行うクラス
 * このクラスは継承なしで使用できなく、継承後のクラスを使用して実装する
 * 
 * Jeeel.Framework.Event
 * ディスパッチャーと一緒に使うイベントの基底クラスで継承なしでも使用できる
 * 
 * Jeeel.Framework.Layer extends Jeeel.Framework.EventDispatcher
 * ディスパッチャーを継承するクラスで、それに加えて親子関係を管理するクラス
 * また子要素に追加、削除する時点で専用イベントを発生させるようになる
 * ディスパッチしたイベントも親子間のイベント伝搬を行いActionScriptのように、
 * キャプチャ段階、ターゲット段階、バグリング段階(設定をするとフォーリング段階も)を経てイベントが伝搬する
 * すなわち発生した要素の一番上のルート要素から発生要素まで辿って行き、またルート要素まで戻っていく一般的な(ASでは)イベントフローと、
 * ディスパッチするイベントの設定でフォーリング段階を追加した場合、発生要素以下の子要素全てに伝搬して行く逆フローが存在する
 * 発生の順番はキャプチャ、ターゲット、バブリング、フォーリングの順番で発生する
 * 
 * Jeeel.Framework.Net.Connect
 * サーバーへの接続を提供するクラスで、接続結果からコールバックを呼ぶ最低限の機能を保持したクラス
 * ただし、接続後の呼び出されるコールバックを指定しない場合は継承後のクラスのメソッドを呼ぶ仕様になっている
 * 
 * 
 * 派生クラス(MVC)
 * 以下のクラスは派生クラスであるが、MVC合わせて1パーツになるという考えのもと実装してある(.NetのPictureBoxなどを初めとする1パーツで最小完結型)
 * 従って大きなパーツを生成する際には1パーツ単位を複数組み合わせて実装する手法をお勧めする
 * 
 * モデルクラス
 * Jeeel.Framework.Mvc.Model extends Jeeel.Framework.Net.Connect
 * コネクトクラスを継承し、計算・サーバー接続を担うクラス
 * 
 * ビュークラス
 * Jeeel.Framework.Mvc.View extends Jeeel.Framework.Layer
 * レイヤークラスを継承し、HTML要素への描画指示やDOMイベントをハンドリングするクラス
 * このクラスはHTML要素と1対で対応し、対応するコントローラが親コントローラに追加された時に、
 * 親コントローラのビューに対して自動的にaddChildされる機能を保有する
 * ビューの親子関係は実要素となり、そのままHTML要素と同じ構成になるのが望ましい
 * また、子要素に対してコントローラに保持されないビューを追加する事も可能で、コントローラと組み合わせる必要のないくらい単純な要素に適用する(表示のみなど)
 * 
 * コントローラクラス
 * Jeeel.Framework.Mvc.Controller extends Jeeel.Framework.Layer
 * レイヤークラスを継承し、制御を担うクラス
 * このクラスはモデル、ビューを管理するクラスであり外部との中継役でもある
 * パーツ単位で親子関係を築く場合はこのクラス同士が結合し、ビュー同士も自動結合しそれに伴いHTML要素も結合する運びとなる
 * 基本的にイベントをディスパッチするのはこのクラスで行うべきである
 * 
 * 例：
 * <div id="mvc-owner">
 * </div>
 * 
 * // 親コントローラの定義
 * var Parent = function () {
 *     Jeeel.Framework.Mvc.Controller.call(this);
 *     
 *     this.addEventListener('child-click', this.onClick, false, this);
 * };
 * 
 * Parent.prototype = {
 *     onClick: function () {
 *         this._model.countClick();
 *     }
 * };
 * 
 * Jeeel.Class.extend(Parent, Jeeel.Framework.Mvc.Controller);
 * 
 * // 親モデルの定義
 * var ParentModel = function () {
 *     Jeeel.Framework.Mvc.Model.call(this);
 * };
 * 
 * ParentModel.prototype = {
 *     _cnt: 0,
 *     
 *     countClick: function () {
 *         this._cnt++;
 *         
 *         this.notify();
 *     }
 * };
 * 
 * Jeeel.Class.extend(ParentModel, Jeeel.Framework.Mvc.Model);
 * 
 * // 親ビューの定義
 * var ParentView = function () {
 *     Jeeel.Framework.Mvc.View.call(this, 'mvc-owner');
 * };
 * 
 * ParentView.prototype = {
 * };
 * 
 * Jeeel.Class.extend(ParentView, Jeeel.Framework.Mvc.View);
 * 
 * 
 * // 子コントローラの定義
 * var Child = function () {
 *     Jeeel.Framework.Mvc.Controller.call(this);
 *     
 *     this._view.addEventListener('child-click', this.onClick, false, this);
 * };
 * 
 * Child.prototype = {
 *     onClick: function (mvcEvent) {
 *         this.dispatchEvent(mvcEvent.clone(true));
 *     }
 * };
 * 
 * Jeeel.Class.extend(Child, Jeeel.Framework.Mvc.Controller);
 * 
 * // 子ビューの定義
 * var ChildView = function () {
 *     var elm = document.createElement('div');
 *     
 *     elm.innerHTML = 'Click Please!!.';
 *     
 *     Jeeel.Framework.Mvc.View.call(this, elm, true);
 *     
 *     this.addDomEventListener(Jeeel.Dom.Event.Type.CLICK, this.onClick, this);
 * };
 * 
 * ChildView.prototype = {
 *     onClick: function (domEvent) {
 *         var mvcEvent = new Jeeel.Framework.Event('child-click');
 *         
 *         this.dispatchEvent(mvcEvent);
 *     },
 *     
 *     update: function () {
 *         this._element.innerHTML = 'Clicked!!';
 *     }
 * };
 * 
 * Jeeel.Class.extend(ChildView, Jeeel.Framework.Mvc.View);
 * 
 * 
 * 以上のようなHTML、クラスがあった場合に以下のコードを実行する
 * 
 * var parent = new Parent();
 * var parentModel = new ParentModel();
 * var parentView = new ParentView();
 * 
 * parent.setModel(parentModel);
 * parent.setView(parentView);
 * 
 * var child = new Child();
 * child.setView(new ChildView());
 * 
 * parent.addChild(child);
 * 
 * その場合まずHTML要素は以下のようになる
 * 
 * <div id="mvc-owner">
 *   <div>Click Please!!.</div>
 * </div>
 * 
 * そしてクラスのインスタンス間のつながりは以下のようになる
 * 
 * parent: Parent
 *   _model: ParentModel
 *     _cnt: Integer
 *   _view: ParentView
 *     _element: <div id="mvc-owner"></div>
 *     _children: Array
 *       0: ChildView
 *   _children: Array
 *     0: Child
 *       _view: ChildView
 *         _element: <div>Click Please!!.</div>
 *         _parent: ParentView
 *         
 * 少し分かりにくいがPearentインスタンスのビューにはParentViewインスタンス、
 * ChildインスタンスのビューにはChildViewインスタンスがそれぞれセットされている
 * そしてPearentインスタンスの子要素にはChildインスタンス、
 * ParentViewインスタンスの子要素にはChildViewインスタンスがそれぞれ親子関係を結んでいる
 * 
 * 図で親子関係を示すと以下のようになる
 * PC: Parentインスタンス(parent)
 * PV: ParentViewインスタンス(parent._view)
 * CC: Childインスタンス(child)
 * CV: ChildViewインスタンス(child._view)
 * 
 * PC―CC
 * ｜  ｜
 * PV…CV
 * 
 * この状態になった後CVのHTML要素に対してClickをすると以下のようなイベント伝搬＋メソッドの呼び出しが起こる
 * <div>Click Please!!.</div>  ← DOM上でクリック
 * ↓
 * ChildView#onClick
 * ↓
 * Child#onClick
 * ↓
 * Parent#onClick
 * ↓
 * ParentModel#countClick
 * ↓
 * Parent#update スーパークラスで実装済み
 * ↓
 * ParentView#update スーパークラスで実装済み
 * ↓
 * ChildView#update
 * 
 * この伝搬はDOM上でのクリックをChildView#onClickでハンドリング後MVCイベントを生成しディスパッチする
 * Childで対応するビュー(ChildView)に対してイベントハンドリングをしていたのでChild#onClickが呼ばれる
 * Child#onClick内でMVCイベントを複製して親コントローラに対してディスパッチする(イベント伝搬)
 * Parentで自分に対してイベントハンドリングをしていたのでParent#onClickが呼ばれる
 * その後モデルのParentModel#countClickを呼びクリック回数をカウントした後それを更新した主旨をコントローラ(Parent)に伝える(updateメソッド)
 * コントローラ(Parent)はスパークラスでの実装通りにビュー(ParentView)に対して再描画指令(updateメソッド)を出す
 * ビューはスーパークラスの実装通りに子要素のupdateメソッドを呼びChildView#updateが呼ばれる
 * そしてChildView#updateにてClickした要素のinnnerHTMLがClickedに変化する
 * 
 * 他にも以下のようなメソッドが良く使用される
 * 
 * parent.update(); // 実装依存、初期ではビューのupdateを呼ぶ
 * parent.getView(); // ビューを取得する
 * parent.getModel(); // モデルを取得する
 * parentView.update(); // 実装依存、初期では子要素のupdateを呼ぶ(通常はコントローラを通して呼ばれる)
 * parentModel.notify(); // モデルのデータが更新された主旨をコントローラに伝える(コントローラのupdateメソッドを呼ぶ)
 * 
 * 
 * 
 * ACL認証機能
 * 
 * Jeeel.Framework.Acl
 * ロールベースアクセス制御を管理するクラス
 * このインスタンスに対してロールとリソースを追加していきアクセス許可を制御する
 * 
 * Jeeel.Framework.Acl.Role.Abstract
 * ロールの基底クラス
 * 以降に示すロールユーザー以外を定義したい場合に継承して使用する
 * 
 * Jeeel.Framework.Acl.Resource.Abstract
 * リソースの基底クラス
 * 以降に示すURLリソース以外を定義したい場合に継承して使用する
 * 
 * Jeeel.Framework.Acl.Role.User extends Jeeel.Framework.Acl.Role.Abstract
 * ロールの基本クラスであるロールユーザー
 * このクラスはユーザー名を引数に取る単純なロールである
 * ロールは継承を行うことが可能であり(例えばGuestユーザーを継承したAdministratorユーザーなど)、
 * スーパーユーザーの権限はサブユーザーに引き継がれる
 * 
 * Jeeel.Framework.Acl.Resource.Url extends Jeeel.Framework.Acl.Resource.Abstract
 * リソースの基本クラスであるURリソース
 * このクラスはURL(リソースID)と下位下層を同じリソース内と見るかどうかのみを保持するリソースである
 * リソースには権限の種類を追加する事が出来、URLの場合はAccessのみ保持する
 * もし車のリソースがあった場合はIDとなるのは車の車種、
 * 権限の種類はRide, Drive, Buy, Sell等となると思われる
 * 
 * これらの基本クラスを使う限りでは以下の箇所にJeeel.Framework.Aclインスタンスが入っているので利用が簡単である
 * Jeeel.Acl: Jeeel.Framework.Acl
 * このインスタンスは通常のACLに加えてJeeelを通してサーバーにアクセスしたりフォーム、アンカーなどのURL遷移を自動制御することが出来る
 * ロールは初期値でAdministrator(全権限)を保持している
 * 
 * 以下のメソッドが良く使用される
 * Jeeel.Acl.enableAutoControl(); // form、aに対して自動制御を行う(URLの)
 * Jeeel.Acl.addErrorEvent(func, thisArg); // ACLで不許可のURLに対してアクセスしようとしたした際のエラーイベントを追加する
 * 
 * 
 * 例：
 * 現在のURLがhttp://test.co.jp/indexだとする
 * 
 * Jeeel.Acl.enableAutoControl();
 * 
 * var role = Jeeel.Framework.Acl.Role.User.create('Guest');
 * var resource1 = Jeeel.Framework.Acl.Resource.Url.create('/index');
 * var resource2 = Jeeel.Framework.Acl.Resource.Url.create('/test');
 * 
 * Jeeel.Acl.addRole(role);
 * Jeeel.Acl.addResource(resource1);
 * Jeeel.Acl.addResource(resource2);
 * 
 * Jeeel.Acl.addRole.switchRole('Guest');
 * Jeeel.Acl.allow('/index');
 *
 * Jeeel.Acl.isAllowed('/index'); // true
 * Jeeel.Acl.isAllowed('/test'); // false
 * Jeeel.Acl.isAllowed('/join'); // false
 * Jeeel.Acl.isAllowed('http://test.co.jp/index'); // true
 * Jeeel.Acl.isAllowed('http://index.co.jp/index'); // false
 * 
 * Jeeel.UserAgent.setUrl('/index'); // Success
 * Jeeel.UserAgent.setUrl('/test'); // Error
 * 
 * Jeeel.Acl.addRole.switchRole('Administrator');
 * 
 * Jeeel.Acl.isAllowed('/index'); // true
 * Jeeel.Acl.isAllowed('/test'); // true
 * Jeeel.Acl.isAllowed('/join'); // true
 * Jeeel.Acl.isAllowed('http://test.co.jp/index'); // true
 * Jeeel.Acl.isAllowed('http://index.co.jp/index'); // true
 * 
 * Jeeel.UserAgent.setUrl('/index'); // Success
 * Jeeel.UserAgent.setUrl('/test'); // Success
 */
Jeeel.Framework = {
    
};

Jeeel.file.Jeeel.Framework = ['Net', 'Event', 'EventDispatcher', 'Layer', 'Mvc', 'Acl'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Framework, Jeeel.file.Jeeel.Framework);
