/**
 * バンドラーの初期登録を行う
 */
(function () {
    
    if ( ! Jeeel._elm) {
        return;
    }
    
    var parts = [], i = 0;
    
    // background-positionの登録
    parts[i++] = function (styles) {
        var cnt = !!(styles['background-position-x'] || styles['backgroundPositionX'])
                + !!(styles['background-position-y'] || styles['backgroundPositionY']);
        
        if (cnt < 2) {
            return styles;
        }
        
        styles.backgroundPosition = (styles['background-position-x'] || styles['backgroundPositionX']) + ' '
                                  + (styles['background-position-y'] || styles['backgroundPositionY']);
                                
        delete styles['background-position-x'];
        delete styles['backgroundPositionX'];
        delete styles['background-position-y'];
        delete styles['backgroundPositionY'];
        
        return styles;
    };
    
    // transformの登録
    parts[i++] = function (styles, customStyle) {
        var list = [
            'rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d', 
            'translate', 'translateX', 'translateY', 'translateZ', 'translate3d', 
            'scale', 'scaleX', 'scaleY', 'scaleZ', 'scale3d',
            'skew', 'skewX', 'skewY',
            'matrix', 'matrix3d'
        ];
        
        var res = [];
        var exists = [];
        
        for (var i = list.length; i--;) {
            if (styles[list[i]]) {
                res.push(list[i] + '(' + styles[list[i]] + ')');
                exists.push(list[i]);
                delete styles[list[i]];
            }
        }

        if (res.length === 0) {
            return styles;
        }
        
        var trs = customStyle.transform();
        
        if (trs === 'none') {
            trs = '';
        } else {
            for (var i = exists.length; i--;) {
                var reg = new RegExp(exists[i] + '\\([^)]+\\)');
                trs = trs.replace(reg, '');
            }
        }
        
        styles.transform = trs + res.join(' ');

        return styles;
    };
    
    for (i = parts.length; i--;) {
        Jeeel.Dom.Style.Bundler.register(parts[i]);
    }

    // 念のためメモリリーク対策
    parts = null;
})();