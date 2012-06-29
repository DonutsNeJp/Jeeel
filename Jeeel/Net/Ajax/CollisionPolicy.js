
/**
 * @namespace 並列リクエストをした時の動作ポリシー列挙体
 */
Jeeel.Net.Ajax.CollisionPolicy = {
  
    /**
     * 新しいリクエストを無視する
     *
     * @type Integer
     * @constant
     */
    IGNORE: 0,
    
    /**
     * 現在通信中のリクエストを破棄し新しいリクエストに置き換える
     *
     * @type Integer
     * @constant
     */
    CHANGE: 1,
    
    /**
     * 現在通信中のリクエストの終了後に次の通信を行う用にキューにリクエストを入れる
     *
     * @type Integer
     * @constant
     */
    ENQUEUE: 2
};

if (Jeeel._auto) {
    Jeeel._tmp();
}
