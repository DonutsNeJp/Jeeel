/**
 * フックの初期登録を行う
 */
(function () {
    
    if ( ! Jeeel._elm) {
        return;
    }
    
    var displayParts = [
        'height', 
        'width', 
        'opacity', 
        'marginTop', 
        'marginBottom', 
        'marginLeft', 
        'marginRight', 
        'paddingTop', 
        'paddingBottom', 
        'paddingLeft', 
        'paddingRight'
    ];
    
    var parts = [], i = 0;
    
    // showの登録
    parts[i++] = {
        name: 'show',
        
        get: function (key, defaultPrm, deltaPrm, endPrm) {
            if ( ! Jeeel.Type.inArray(key, displayParts, true)) {
                return null;
            }
            
            var showDisp = this._style._getShowedDisplay();
            var nowDisp  = this._style.getStyle('display');
            var delta    = {unit: 'px'};
            
            if (nowDisp !== 'none') {
                return null;
            }
            
            if (key === 'opacity') {
                delta.unit = 0;
            }

            delta.value = defaultPrm;
            
            /**
             * @ignore
             */
            var res = {
                init: {},
                
                delta: {},
                
                end: {}
            };
            
            res.init[key]  = '0' + (key === 'opacity' ? '' : 'px');
            res.init.display = showDisp;
            res.delta[key] = delta;
            res.end[key]   = this._style.getStyle(key);
            
            return res;
        }
    };
    
    // hideの登録
    parts[i++] = {
        name: 'hide',
        
        get: function (key, defaultPrm, deltaPrm, endPrm) {
            if ( ! Jeeel.Type.inArray(key, displayParts, true)) {
                return null;
            }
            
            var nowDisp  = this._style.getStyle('display');
            var delta    = {unit: 'px'};
            
            if (nowDisp === 'none') {
                return null;
            }
            
            if (key === 'opacity') {
                delta.unit = 0;
            }

            delta.value = -defaultPrm;
            
            /**
             * @ignore
             */
            var res = {
                init: {},
                
                delta: {},
                
                end: {
                    display: 'none'
                }
            };
            
            res.delta[key] = delta;
            res.end[key]   = this._style.getStyle(key);
            
            return res;
        }
    };
    
    // toggleの登録
    parts[i++] = {
        name: 'toggle',
        
        get: function (key, defaultPrm, deltaPrm, endPrm) {
            if ( ! Jeeel.Type.inArray(key, displayParts, true)) {
                return null;
            }
            
            var nowDisp  = this._style.getStyle('display');
            
            return nowDisp === 'none' ? this.show(key, defaultPrm, deltaPrm, endPrm) : this.hide(key, defaultPrm, deltaPrm, endPrm);
        }
    };
    
    for (i = parts.length; i--;) {
        Jeeel.Dom.Style.Animation.Hook.register(parts[i].name, parts[i].get);
    }

    // 念のためメモリリーク対策
    parts = null;
})();