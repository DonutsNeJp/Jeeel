
/**
 * 特殊検索に使用する列挙体
 */
Jeeel.Dom.SearchOption = {
    /**
     * 範囲に重なるものが対象
     * 
     * @param {Jeeel.Object.Rect} rect 検索範囲
     * @param {Jeeel.Object.Rect} targettRect 要素の範囲
     * @return {Boolean} 要素が検索範囲にマッチしたかどうか
     * @constant
     */
    RANGE_OVERLAY: function (rect, targettRect) {
        var s = rect.startPoint, e = rect.endPoint;
        var ts = targettRect.startPoint, te = targettRect.endPoint;

        return ! (ts.x <= s.x && te.x <= s.x || ts.x >= e.x && te.x >= e.x) && 
               ! (ts.y <= s.y && te.y <= s.y || ts.y >= e.y && te.y >= e.y);
    },
    
    /**
     * 範囲の内側にあるものが対象
     * 
     * @param {Jeeel.Object.Rect} rect 検索範囲
     * @param {Jeeel.Object.Rect} targettRect 要素の範囲
     * @return {Boolean} 要素が検索範囲にマッチしたかどうか
     * @constant
     */
    RANGE_INSIDE: function (rect, targettRect) {
        var s = rect.startPoint, e = rect.endPoint;
        var ts = targettRect.startPoint, te = targettRect.endPoint;

        return (s.x <= ts.x && ts.x <= e.x && s.x <= te.x && te.x <= e.x) &&
               (s.y <= ts.y && ts.y <= e.y && s.y <= te.y && te.y <= e.y);
    }
};