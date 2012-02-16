
/**
 * XPathの戻り値を指定する列挙体
 */
Jeeel.Dom.Xpath.ResultType = {
  
    /**
     * 式の評価によって導き出される適切な型を格納した結果の集合<br />
     * 結果がノード集合ならば、結果の型は常に UNORDERED_NODE_ITERATOR となるので注意が必要
     * 
     * @type Integer
     * @constant
     */
    ANY: 0,

    /**
     * 一つの数値を格納した結果<br />
     * count() 関数を使用した XPath 式などで有用
     * 
     * @type Integer
     * @constant
     */
    NUMBER: 1,

    /**
     * 一つの文字列を格納した結果
     * 
     * @type Integer
     * @constant
     */
    STRING: 2,

    /**
     * 一つの真偽値を格納した結果<br />
     * not() 関数を使用した XPath 式などで有用
     * 
     * @type Integer
     * @constant
     */
    BOOLEAN: 3,

    /**
     * 式にマッチした全てのノードを格納した結果ノード集合<br />
     * ノードの順番は文書内に現れる順番と必ずしも一致しない
     * 
     * @type Integer
     * @constant
     */
    UNORDERED_NODE_ITERATOR: 4,

    /**
     * 式にマッチした全てのノードを格納した結果ノード集合<br />
     * ノードの順番は文書内に現れる順番に一致する
     * 
     * @type Integer
     * @constant
     */
    ORDERED_NODE_ITERATOR: 5,

    /**
     * 式にマッチした全てのノードのスナップショットを格納した結果ノード集合<br />
     * ノードの順番は文書内に現れる順番と必ずしも一致しない
     * 
     * @type Integer
     * @constant
     */
    UNORDERED_NODE_SNAPSHOT: 6,

    /**
     * 式にマッチした全てのノードのスナップショットを格納した結果ノード集合<br />
     * ノードの順番は文書内に現れる順番に一致する
     * 
     * @type Integer
     * @constant
     */
    ORDERED_NODE_SNAPSHOT: 7,

    /**
     * 式にマッチしたノードのうちのどれか一つを格納した結果ノード集合<br />
     * これは必ずしも文書内で式にマッチした最初のノードというわけではない
     * 
     * @type Integer
     * @constant
     */
    ANY_UNORDERED_NODE: 8,

    /**
     * 文書内で式にマッチした最初のノードを格納した結果ノード集合
     * 
     * @type Integer
     * @constant
     */
    FIRST_ORDERED_NODE: 9
};
