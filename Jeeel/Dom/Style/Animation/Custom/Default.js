/**
 * カスタムアニメーションの初期登録を行う
 */
(function () {
  
    if ( ! Jeeel._elm) {
        return;
    }
    
    var displayParts = {
        display: [
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
        ],
        
        width: [
            'width', 
            'marginLeft', 
            'marginRight', 
            'paddingLeft', 
            'paddingRight'
        ],
        
        height: [
            'height', 
            'marginTop', 
            'marginBottom', 
            'paddingTop', 
            'paddingBottom'
        ]
    };
    
    var parts = [], i = 0;
    
    // widthの登録
    parts[i++] = {
        name: 'width',
        
        get: function (value) {
            if ( ! (value === 'show' || value === 'hide' || value === 'toggle')) {
                return {width: value};
            }
            
            var res = {};
            
            for (var i = displayParts.width.length; i--;) {
                res[displayParts.width[i]] = value;
            }
            
            return res;
        }
    };
    
    // heightの登録
    parts[i++] = {
        name: 'height',
        
        get: function (value) {
            if ( ! (value === 'show' || value === 'hide' || value === 'toggle')) {
                return {width: value};
            }
            
            var res = {};
            
            for (var i = displayParts.height.length; i--;) {
                res[displayParts.height[i]] = value;
            }
            
            return res;
        }
    };
    
    // displayの登録
    parts[i++] = {
        name: 'display',
        
        get: function (value) {
            if ( ! (value === 'show' || value === 'hide' || value === 'toggle')) {
                return {display: value};
            }
            
            var res = {};
            
            for (var i = displayParts.display.length; i--;) {
                res[displayParts.display[i]] = value;
            }
            
            return res;
        }
    };
    
    // background-positionの登録
    parts[i++] = {
        name: 'backgroundPosition',
        
        get: function (value) {
            var pos = value.split(/\s+/);
            var res = {
                backgroundPositionX: pos[0],
                backgroundPositionY: pos[1]
            };

            return res;
        }
    };
    
    // transformの登録
    parts[i++] = {
        name: 'transform',
        
        get: function (value) {
            var trs = value.replace(/,\s+/, ',').split(/\s+/);
            var reg = /^([a-zA-Z\-]+)\(([^\)]+)\)$/i;
            var res = {};
            
            for (var i = trs.length; i--;) {
                var matches = trs[i].match(reg);
                
                if (matches) {
                    res[matches[1]] = matches[2];
                }
            }
            
            return res;
        }
    };
    
    for (i = parts.length; i--;) {
        Jeeel.Dom.Style.Animation.Custom.register(parts[i].name, parts[i].get);
    }

    // 念のためメモリリーク対策
    parts = null;
})();