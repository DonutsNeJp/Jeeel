/**
 * フックの初期登録を行う
 */
(function () {
    
    if ( ! Jeeel._elm) {
        return;
    }
    
    var cssWidth = ['Left', 'Right'],
        cssHeight = ['Top', 'Bottom'];
    
    function getWidth(elm, style) {
        var val = elm.offsetWidth;
        
        if ( val > 0 ) {
            for (var i = 0, l = cssWidth.length; i < l; i++) {
                val -= parseFloat(style.getStyle('padding' + cssWidth[i])) || 0;

                val -= parseFloat(style.getStyle('border' + cssWidth[i] + 'Width') ) || 0;
            }

            return val + 'px';
        }
        
        return 0 + 'px';
    }
    
    function getHeight(elm, style) {
        var val = elm.offsetHeight;
        
        if ( val > 0 ) {
            for (var i = 0, l = cssHeight.length; i < l; i++) {
                val -= parseFloat(style.getStyle('padding' + cssHeight[i])) || 0;

                val -= parseFloat(style.getStyle('border' + cssHeight[i] + 'Width') ) || 0;
            }

            return val + 'px';
        }
        
        return 0 + 'px';
    }
    
    var module = Jeeel._Object.JeeelDomStyle;
    var parts = [], i = 0;
    
    // widthの登録
    parts[i++] = {
        name: 'width',
        
        get: function () {
            if (this._element.offsetWidth !== 0) {
                return getWidth(this._element, this._style);
            }
            
            var elm = this._element;
            var style = this._style;
            
            return module.swapShow(elm.style, function () {
                return getWidth(elm, style);
            });
        }
    };
    
    // heightの登録
    parts[i++] = {
        name: 'height',
        
        get: function () {
            if (this._element.offsetWidth !== 0) {
                return getHeight(this._element, this._style);
            }
            
            var elm = this._element;
            var style = this._style;
            
            return module.swapShow(elm.style, function () {
                return getHeight(elm, style);
            });
        }
    };
    
    for (i = parts.length; i--;) {
        Jeeel.Dom.Style.Hook.register(parts[i].name, parts[i].get);
    }

    // 念のためメモリリーク対策
    parts = null;
})();