
/**
 * 文字コードに関する列挙体
 */
Jeeel.Code.CharCode = {

    /**
     * 空文字
     *
     * @type Integer
     * @constant
     */
    Null: 0x00,

    /**
     * ヘッダ開始
     *
     * @type Integer
     * @constant
     */
    StartOfHeading: 0x01,

    /**
     * テキスト開始
     *
     * @type Integer
     * @constant
     */
    StartOfText: 0x02,

    /**
     * テキスト終了
     *
     * @type Integer
     * @constant
     */
    EndOfText: 0x03,

    /**
     * 伝送終了
     *
     * @type Integer
     * @constant
     */
    EndOfTransmission: 0x04,

    /**
     * 問い合わせ
     *
     * @type Integer
     * @constant
     */
    Enquiry: 0x05,
    
    /**
     * 肯定応答
     *
     * @type Integer
     * @constant
     */
    Acknowledge: 0x06,

    /**
     * ベル
     *
     * @type Integer
     * @constant
     */
    Bell: 0x07,

    /**
     * 1文字後退
     *
     * @type Integer
     * @constant
     */
    BackSpace: 0x08,

    /**
     * 水平タブ
     *
     * @type Integer
     * @constant
     */
    HorizontalTabulation: 0x09,
    
    /**
     * 改行
     *
     * @type Integer
     * @constant
     */
    LineFeed: 0x0A,

    /**
     * 垂直タブ
     *
     * @type Integer
     * @constant
     */
    VerticalTabulation: 0x0B,
    
    /**
     * 改ページ
     *
     * @type Integer
     * @constant
     */
    FormFeed: 0x0C,

    /**
     * 復帰
     *
     * @type Integer
     * @constant
     */
    CarriageReturn: 0x0D,
    
    /**
     * シフトアウト
     *
     * @type Integer
     * @constant
     */
    ShiftOut: 0x0E,

    /**
     * シフトイン
     *
     * @type Integer
     * @constant
     */
    ShiftIn: 0x0F,
    
    /**
     * データリンク拡張
     *
     * @type Integer
     * @constant
     */
    DataLinkEscape: 0x10,

    /**
     * 装置制御1(XON)
     *
     * @type Integer
     * @constant
     */
    DeviceControl1: 0x11,

    /**
     * 装置制御2
     *
     * @type Integer
     * @constant
     */
    DeviceControl2: 0x12,

    /**
     * 装置制御3(XOFF)
     *
     * @type Integer
     * @constant
     */
    DeviceControl3: 0x13,
    
    /**
     * 装置制御4
     *
     * @type Integer
     * @constant
     */
    DeviceControl4: 0x14,

    /**
     * 否定応答
     *
     * @type Integer
     * @constant
     */
    NegativeAcKnowledge: 0x15,

    /**
     * 同期信号
     *
     * @type Integer
     * @constant
     */
    SynchronousIdle: 0x16,

    /**
     * ブロック転送終了
     *
     * @type Integer
     * @constant
     */
    EndOfTransmissionBlock: 0x17,

    /**
     * 取り消し
     *
     * @type Integer
     * @constant
     */
    Cancel: 0x18,

    /**
     * メディア終了
     *
     * @type Integer
     * @constant
     */
    EndOfMedium: 0x19,
    
    /**
     * 置換(EOF)
     *
     * @type Integer
     * @constant
     */
    SubstituteCharacter: 0x1A,

    /**
     * エスケープ
     *
     * @type Integer
     * @constant
     */
    Escape: 0x1B,

    /**
     * ファイル区切り
     *
     * @type Integer
     * @constant
     */
    FileSeparator: 0x1C,

    /**
     * グループ区切り
     *
     * @type Integer
     * @constant
     */
    GroupSeparator: 0x1D,

    /**
     * レコード区切り
     *
     * @type Integer
     * @constant
     */
    RecordSeparator: 0x1E,

    /**
     * ユニット区切り
     *
     * @type Integer
     * @constant
     */
    UnitSeparator: 0x1F,

    /**
     * 空白
     *
     * @type Integer
     * @constant
     */
    Space: 0x20,

    /**
     * !
     *
     * @type Integer
     * @constant
     */
    ExclamationMark: 0x21,

    /**
     * "
     *
     * @type Integer
     * @constant
     */
    DoubleQuote: 0x22,

    /**
     * #
     *
     * @type Integer
     * @constant
     */
    Sharp: 0x23,

    /**
     * $
     *
     * @type Integer
     * @constant
     */
    DollarMark: 0x24,

    /**
     * %
     *
     * @type Integer
     * @constant
     */
    PercentSign: 0x25,

    /**
     * &amp;
     *
     * @type Integer
     * @constant
     */
    Ampersand: 0x26,

    /**
     * '
     *
     * @type Integer
     * @constant
     */
    SingleQuote: 0x27,

    /**
     * (
     *
     * @type Integer
     * @constant
     */
    LeftParenthesis: 0x28,

    /**
     * )
     *
     * @type Integer
     * @constant
     */
    RightParenthesis: 0x29,

    /**
     * &lowast;
     *
     * @type Integer
     * @constant
     */
    MultiplicationSign: 0x2A,

    /**
     * +
     *
     * @type Integer
     * @constant
     */
    AdditionSign: 0x2B,

    /**
     * ,
     *
     * @type Integer
     * @constant
     */
    Comma: 0x2C,

    /**
     * -
     *
     * @type Integer
     * @constant
     */
    SubtractionSign: 0x2D,

    /**
     * .
     *
     * @type Integer
     * @constant
     */
    Period: 0x2E,
    
    /**
     * /
     *
     * @type Integer
     * @constant
     */
    DivisionSign: 0x2F,

    /**
     * 0
     *
     * @type Integer
     * @constant
     */
    0: 0x30,

    /**
     * 1
     *
     * @type Integer
     * @constant
     */
    1: 0x31,

    /**
     * 2
     *
     * @type Integer
     * @constant
     */
    2: 0x32,

    /**
     * 3
     *
     * @type Integer
     * @constant
     */
    3: 0x33,

    /**
     * 4
     *
     * @type Integer
     * @constant
     */
    4: 0x34,

    /**
     * 5
     *
     * @type Integer
     * @constant
     */
    5: 0x35,

    /**
     * 6
     *
     * @type Integer
     * @constant
     */
    6: 0x36,

    /**
     * 7
     *
     * @type Integer
     * @constant
     */
    7: 0x37,

    /**
     * 8
     *
     * @type Integer
     * @constant
     */
    8: 0x38,

    /**
     * 9
     *
     * @type Integer
     * @constant
     */
    9: 0x39,

    /**
     * :
     *
     * @type Integer
     * @constant
     */
    Colon: 0x3A,

    /**
     * ;
     *
     * @type Integer
     * @constant
     */
    Semicolon: 0x3B,

    /**
     * &lt;
     *
     * @type Integer
     * @constant
     */
    LessThan: 0x3C,

    /**
     * =
     *
     * @type Integer
     * @constant
     */
    EqualsSign: 0x3D,

    /**
     * &gt;
     *
     * @type Integer
     * @constant
     */
    GreaterThan: 0x3E,

    /**
     * ?
     *
     * @type Integer
     * @constant
     */
    QuestionMark: 0x3F,

    /**
     * &#64;
     *
     * @type Integer
     * @constant
     */
    Atmark: 0x40,

    /**
     * A
     *
     * @type Integer
     * @constant
     */
    A: 0x41,

    /**
     * B
     *
     * @type Integer
     * @constant
     */
    B: 0x42,

    /**
     * C
     *
     * @type Integer
     * @constant
     */
    C: 0x43,

    /**
     * D
     *
     * @type Integer
     * @constant
     */
    D: 0x44,

    /**
     * E
     *
     * @type Integer
     * @constant
     */
    E: 0x45,

    /**
     * F
     *
     * @type Integer
     * @constant
     */
    F: 0x46,

    /**
     * G
     *
     * @type Integer
     * @constant
     */
    G: 0x47,

    /**
     * H
     *
     * @type Integer
     * @constant
     */
    H: 0x48,

    /**
     * I
     *
     * @type Integer
     * @constant
     */
    I: 0x49,

    /**
     * J
     *
     * @type Integer
     * @constant
     */
    J: 0x4A,

    /**
     * K
     *
     * @type Integer
     * @constant
     */
    K: 0x4B,

    /**
     * L
     *
     * @type Integer
     * @constant
     */
    L: 0x4C,

    /**
     * M
     *
     * @type Integer
     * @constant
     */
    M: 0x4D,

    /**
     * N
     *
     * @type Integer
     * @constant
     */
    N: 0x4E,

    /**
     * O
     *
     * @type Integer
     * @constant
     */
    O: 0x4F,

    /**
     * P
     *
     * @type Integer
     * @constant
     */
    P: 0x50,

    /**
     * Q
     *
     * @type Integer
     * @constant
     */
    Q: 0x51,

    /**
     * R
     *
     * @type Integer
     * @constant
     */
    R: 0x52,

    /**
     * S
     *
     * @type Integer
     * @constant
     */
    S: 0x53,

    /**
     * T
     *
     * @type Integer
     * @constant
     */
    T: 0x54,

    /**
     * U
     *
     * @type Integer
     * @constant
     */
    U: 0x55,

    /**
     * V
     *
     * @type Integer
     * @constant
     */
    V: 0x56,

    /**
     * W
     *
     * @type Integer
     * @constant
     */
    W: 0x57,

    /**
     * X
     *
     * @type Integer
     * @constant
     */
    X: 0x58,

    /**
     * Y
     *
     * @type Integer
     * @constant
     */
    Y: 0x59,

    /**
     * Z
     *
     * @type Integer
     * @constant
     */
    Z: 0x5A,

    /**
     * [
     *
     * @type Integer
     * @constant
     */
    LeftBracket: 0x5B,

    /**
     * \
     *
     * @type Integer
     * @constant
     */
    YenMark: 0x5C,

    /**
     * ]
     *
     * @type Integer
     * @constant
     */
    RightBracket: 0x5D,

    /**
     * ^
     *
     * @type Integer
     * @constant
     */
    Caret: 0x5E,

    /**
     * _
     *
     * @type Integer
     * @constant
     */
    Underscore: 0x5F,

    /**
     * `
     *
     * @type Integer
     * @constant
     */
    BackQuote: 0x60,

    /**
     * a
     *
     * @type Integer
     * @constant
     */
    a: 0x61,

    /**
     * b
     *
     * @type Integer
     * @constant
     */
    b: 0x62,

    /**
     * c
     *
     * @type Integer
     * @constant
     */
    c: 0x63,

    /**
     * d
     *
     * @type Integer
     * @constant
     */
    d: 0x64,

    /**
     * e
     *
     * @type Integer
     * @constant
     */
    e: 0x65,

    /**
     * f
     *
     * @type Integer
     * @constant
     */
    f: 0x66,

    /**
     * g
     *
     * @type Integer
     * @constant
     */
    g: 0x67,

    /**
     * h
     *
     * @type Integer
     * @constant
     */
    h: 0x68,

    /**
     * i
     *
     * @type Integer
     * @constant
     */
    i: 0x69,

    /**
     * j
     *
     * @type Integer
     * @constant
     */
    j: 0x6A,

    /**
     * k
     *
     * @type Integer
     * @constant
     */
    k: 0x6B,

    /**
     * l
     *
     * @type Integer
     * @constant
     */
    l: 0x6C,

    /**
     * m
     *
     * @type Integer
     * @constant
     */
    m: 0x6D,

    /**
     * n
     *
     * @type Integer
     * @constant
     */
    n: 0x6E,

    /**
     * o
     *
     * @type Integer
     * @constant
     */
    o: 0x6F,

    /**
     * p
     *
     * @type Integer
     * @constant
     */
    p: 0x70,

    /**
     * q
     *
     * @type Integer
     * @constant
     */
    q: 0x71,

    /**
     * r
     *
     * @type Integer
     * @constant
     */
    r: 0x72,

    /**
     * s
     *
     * @type Integer
     * @constant
     */
    s: 0x73,

    /**
     * t
     *
     * @type Integer
     * @constant
     */
    t: 0x74,

    /**
     * u
     *
     * @type Integer
     * @constant
     */
    u: 0x75,

    /**
     * v
     *
     * @type Integer
     * @constant
     */
    v: 0x76,

    /**
     * w
     *
     * @type Integer
     * @constant
     */
    w: 0x77,

    /**
     * x
     *
     * @type Integer
     * @constant
     */
    x: 0x78,

    /**
     * y
     *
     * @type Integer
     * @constant
     */
    y: 0x79,

    /**
     * z
     *
     * @type Integer
     * @constant
     */
    z: 0x7A,

    /**
     * &#123;
     *
     * @type Integer
     * @constant
     */
    LeftBrace: 0x7B,

    /**
     * |
     *
     * @type Integer
     * @constant
     */
    VerticalBar: 0x7C,

    /**
     * &#125;
     *
     * @type Integer
     * @constant
     */
    RightBrace: 0x7D,

    /**
     * ~
     *
     * @type Integer
     * @constant
     */
    Tilde: 0x7E,

    /**
     * 削除
     *
     * @type Integer
     * @constant
     */
    Delete: 0x7F
};

Jeeel.Code.CharCode.getChar = function (charCode) {
    var res = Jeeel.Hash.getKeys(this, charCode, true);
    
    if (res.length < 1) {
        return null;
    } else if (res.length == 1) {
        return res[0];
    } else {
        return (res[0].length < res[1].length ? res[1] : res[0]);
    }
};

(function () {
    for (var i = 0; i < 128; i++) {
        var chr = String.fromCharCode(i);

        if ( ! (chr in Jeeel.Code.CharCode)) {
            Jeeel.Code.CharCode[chr] = i;
        }
    }
})();
