
/**
 * コンストラクタ
 * 
 * @class フォントを扱うクラス
 * @param {String[]} family フォントの種類
 * @param {String} [size] フォントのサイズ
 * @param {String} [weight] フォントの太さ
 * @param {String} [style] フォントスタイル
 * @param {String} [height] フォントの高さ
 * @param {String} [variant] スモールキャピタル
 */
Jeeel.Object.Font = function (family, size, weight, style, height, variant) {
    
    if (Jeeel.Type.isString(family)) {
        family = [family];
    }
    
    if ( ! Jeeel.Type.isArray(family)) {
        throw new Error('引数の型が違います。');
    }
    
    for (var i = family.length; i--;) {
        if ( ! Jeeel.Type.isString(family[i])) {
            throw new Error('引数の型が違います。');
        } else if (family[i].match(/^'.*'$/)) {
            continue;
        }
        
        family[i] = "'" + family[i] + "'";
    }
    
    /**
     * フォント名
     * 
     * @type String[]
     */
    this.family = family;
  
    /**
     * フォントサイズ
     * 
     * @type String
     */
    this.size = size || 'medium';
    
    /**
     * フォントの太さ
     * 
     * @type String
     */
    this.weight = weight || 'normal';
    
    /**
     * フォントスタイル
     * 
     * @type String
     */
    this.style = style || 'normal';
    
    /**
     * フォントの高さ
     * 
     * @type String
     */
    this.height = height || 'normal';
    
    /**
     * スモールキャピタル
     * 
     * @type String
     */
    this.variant = variant || 'normal';
};

Jeeel.Object.Font.prototype = {
    /**
     * 複製を行う
     *
     * @return {Jeeel.Object.Font} 複製したインスタンス
     */
    clone: function () {
        return new Jeeel.Object.Font(this.family, this.size, this.weight, this.style, this.height, this.variant);
    },

    /**
     * 内部比較を行い結果を返す
     *
     * @param {Jeeel.Object.Font} font 比較オブジェクト
     * @return {Boolean} 判定結果
     */
    equals: function (font) {
        return this.family.join('') === font.family.join('')
            && this.size === font.size
            && this.weight === font.weight
            && this.style === font.style
            && this.height === font.height
            && this.variant === font.variant;
    },

    /**
     * 文字列に変換する
     *
     * @return {String} 文字列に変換した自インスタンス
     */
    toString: function () {
        return this.style + ' '
             + this.variant + ' '
             + this.weight + ' '
             + this.size + '/'
             + this.height + ' '
             + this.family.join(',');
    }
};