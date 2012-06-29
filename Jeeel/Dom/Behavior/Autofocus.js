
/**
 * オートフォーカスを有効にする
 * 
 * @return {Jeeel.Dom.Behavior} 自クラス
 */
Jeeel.Dom.Behavior.enableAutofocus = function () {
  
    Jeeel.Dom.Behavior.Autofocus.addLoadEvent();
    
    return this;
};

/**
 * HTML5のオートフォーカスを実現するためのクラス
 */
Jeeel.Dom.Behavior.Autofocus = {
    
    _focused: false,
    
    /**
     * 読み込み時のイベントに登録する
     * 
     * @return {Jeeel.Dom.Behavior.Autofocus} 自クラス
     */
    addLoadEvent: function () {
        Jeeel.addLoadEvent(function () {
            var elms = Jeeel.Document.getElementsByAttribute('autofocus', '*');

            this.focus(elms[0]);

            elms = null;
        }, this);
        
        return this;
    },
    
    /**
     * フォーカスを当てる
     * 
     * @param {Element} element フォーカス対象の要素
     * @return {Jeeel.Dom.Behavior.Autofocus} 自クラス
     */
    focus: function (element) {
        if ( ! element || this._focused) {
            return this;
        }
        
        var focus = element.getAttribute && element.getAttribute('autofocus');
        
        if ( ! focus) {
            return this;
        }
        
        element.focus();
        
        this._focused = true;
        
        return this;
    },
    
    _init: function () {
        delete this._init;
        
        if ( ! Jeeel._doc) {
            return;
        }
        
        var input = Jeeel._doc.createElement('input');
        
        input.type = 'text';
        
        if ('autofocus' in input) {
            this.focus = Jeeel.Function.Template.RETURN_THIS;
        }
        
        input = null;
    }
};

Jeeel.Dom.Behavior.Autofocus._init();
