/**
 * カスタムスタイルの初期登録を行う
 */
(function () {
    
    if ( ! Jeeel._elm) {
        return;
    }
    
    var style = Jeeel._elm.style;
    var parts = [], i = 0, part, name, get, set, filter;
    
    // floatの登録
    parts[i] = {name: 'float'};
    
    if ('float' in style) {
        name = 'float';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style['float'] || this._computedStyle['float'] || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (floatStyle) {
            this._style['float'] = floatStyle;
        };
        
        filter = null;
    } else if ('cssFloat' in style) {
        name = 'float';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.cssFloat || this._computedStyle.cssFloat || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (floatStyle) {
            this._style.cssFloat = floatStyle;
        };
        
        filter = null;
    } else if ('styleFloat' in style) {
        name = 'float';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.styleFloat || this._computedStyle.styleFloat || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (floatStyle) {
            this._style.styleFloat = floatStyle;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'none';
        };
        
        /**
         * @ignore
         */
        set = function (floatStyle) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    // opacityの登録
    parts[i] = {name: 'opacity'};
    
    if ('opacity' in style) {
        name = 'opacity';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.opacity || this._computedStyle.opacity || '1.0';
        };
        
        /**
         * @ignore
         */
        set = function (opacity) {
            this._style.opacity = opacity;
        };
        
        filter = null;
    } else if ('MozOpacity' in style) {
        name = '-moz-opacity';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozOpacity || this._computedStyle.MozOpacity || '1.0';
        };
        
        /**
         * @ignore
         */
        set = function (opacity) {
            this._style.MozOpacity = opacity;
        };
        
        filter = null;
    } else if ('filter' in style) {
        name = 'filter';
        
        /**
         * @ignore
         */
        get = function () {
            var match = (this._style.filter || this._computedStyle.filter).match(/(?:progid:DXImageTransform\.Microsoft\.)?Alpha\(.*opacity=(-?[0-9.]+).*\)/i);
            return '' + ((match && match[1] || 100) / 100);
        };
        
        /**
         * @ignore
         */
        set = function (opacity) {

            var css = this.opacity(opacity, true);
            
            this._style.cssText += ';' + css;
        };
        
        /**
         * @ignore
         */
        filter = function (opacity) {
            opacity = opacity * 100;

            var hack = '';
            
            if ( ! this._style.zoom) {
                hack = '; zoom: 1';
            }
            
            var filter = this._style.filter || this._computedStyle.filter;

            if ( ! filter) {
                filter = 'alpha(opacity=' + opacity + ')';
            } else if ( ! filter.match(/(?:progid:DXImageTransform\.Microsoft\.)?Alpha\(/i)) {
                filter += ' alpha(opacity=' + opacity + ')';
            } else {
                filter = filter.replace(/(?:progid:DXImageTransform\.Microsoft\.)?Alpha\(.*opacity=(-?[0-9.]+).*\)/i, 'alpha(opacity=' + opacity + ')');
            }
            
            return filter + hack;
        };
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 1.0;
        };
        
        /**
         * @ignore
         */
        set = function (opacity) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    // background-position-xの登録
    parts[i] = {name: 'backgroundPositionX'};
    
    if ('backgroundPositionX' in style) {
        name = 'background-position-x';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.backgroundPositionX || this._computedStyle.backgroundPositionX || '0%';
        };
        
        /**
         * @ignore
         */
        set = function (position) {
            this._style.backgroundPositionX = position;
        };
        
        filter = null;
    } else if ('backgroundPosition' in style) {
        name = 'backgroundPosition';
        
        /**
         * @ignore
         */
        get = function () {
            var pos = (this._style.backgroundPosition || this._computedStyle.backgroundPosition).split(' ');
            
            if (pos.length > 1) {
                return pos[0];
            }
            
            return '0%';
        };
        
        /**
         * @ignore
         */
        set = function (position) {
            this._style.backgroundPosition = this.backgroundPositionX(position, true);
        };
        
        /**
         * @ignore
         */
        filter = function (position) {
            var pos = (this._style.backgroundPosition || this._computedStyle.backgroundPosition).split(' ');
            
            if (pos.length <= 1) {
                pos = [
                    position,
                    '0%'
                ];
            } else {
                pos[0] = position;
            }
            
            return position.join(' ');
        };
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return '0%';
        };
        
        /**
         * @ignore
         */
        set = function (position) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // background-position-yの登録
    parts[i] = {name: 'backgroundPositionY'};
    
    if ('backgroundPositionY' in style) {
        name = 'background-position-y';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.backgroundPositionY || this._computedStyle.backgroundPositionY || '0%';
        };
        
        /**
         * @ignore
         */
        set = function (position) {
            this._style.backgroundPositionY = position;
        };
        
        filter = null;
    } else if ('backgroundPosition' in style) {
        name = 'backgroundPosition';
        
        /**
         * @ignore
         */
        get = function () {
            var pos = (this._style.backgroundPosition || this._computedStyle.backgroundPosition).split(' ');
            
            if (pos.length > 1) {
                return pos[1];
            }
            
            return '0%';
        };
        
        /**
         * @ignore
         */
        set = function (position) {
            this._style.backgroundPosition = this.backgroundPositionY(position, true);
        };
        
        /**
         * @ignore
         */
        filter = function (position) {
            var pos = (this._style.backgroundPosition || this._computedStyle.backgroundPosition).split(' ');
            
            if (pos.length <= 1) {
                pos = [
                    '0%',
                    position
                ];
            } else {
                pos[1] = position;
            }
            
            return position.join(' ');
        };
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return '0%';
        };
        
        /**
         * @ignore
         */
        set = function (position) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // perspectiveの登録
    parts[i] = {name: 'perspective'};
    
    if ('perspective' in style) {
        name = 'perspective';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.perspective || this._computedStyle.perspective || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (perspective) {
            this._style.perspective = perspective;
        };
        
        filter = null;
    } else if ('MozPerspective' in style) {
        name = '-moz-perspective';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozPerspective || this._computedStyle.MozPerspective || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (perspective) {
            this._style.MozPerspective = perspective;
        };
        
        filter = null;
    } else if ('WebkitPerspective' in style) {
        name = '-webkit-perspective';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitPerspective || this._computedStyle.WebkitPerspective || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (perspective) {
            this._style.WebkitPerspective = perspective;
        };
        
        filter = null;
    } else if ('MsPerspective' in style) {
        name = '-ms-perspective';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsPerspective || this._computedStyle.MsPerspective || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (perspective) {
            this._style.MsPerspective = perspective;
        };
        
        filter = null;
    } else if ('OPerspective' in style) {
        name = '-o-perspective';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OPerspective || this._computedStyle.OPerspective || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (perspective) {
            this._style.OPerspective = perspective;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'none';
        };
        
        /**
         * @ignore
         */
        set = function (perspective) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // backface-visibilityの登録
    parts[i] = {name: 'backfaceVisibility'};
    
    if ('backfaceVisibility' in style) {
        name = 'backface-visibility';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.backfaceVisibility || this._computedStyle.backfaceVisibility || 'visible';
        };
        
        /**
         * @ignore
         */
        set = function (backfaceVisibility) {
            this._style.backfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('MozBackfaceVisibility' in style) {
        name = '-moz-backface-visibility';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozBackfaceVisibility || this._computedStyle.MozBackfaceVisibility || 'visible';
        };
        
        /**
         * @ignore
         */
        set = function (backfaceVisibility) {
            this._style.MozBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('WebkitBackfaceVisibility' in style) {
        name = '-webkit-backface-visibility';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitBackfaceVisibility || this._computedStyle.WebkitBackfaceVisibility || 'visible';
        };
        
        /**
         * @ignore
         */
        set = function (backfaceVisibility) {
            this._style.WebkitBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('MsBackfaceVisibility' in style) {
        name = '-ms-backface-visibility';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsBackfaceVisibility || this._computedStyle.MsBackfaceVisibility || 'visible';
        };
        
        /**
         * @ignore
         */
        set = function (backfaceVisibility) {
            this._style.MsBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('OBackfaceVisibility' in style) {
        name = '-o-backface-visibility';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OBackfaceVisibility || this._computedStyle.OBackfaceVisibility || 'visible';
        };
        
        /**
         * @ignore
         */
        set = function (backfaceVisibility) {
            this._style.OBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'visible';
        };
        
        /**
         * @ignore
         */
        set = function (backfaceVisibility) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // transform-originの登録
    parts[i] = {name: 'transformOrigin'};
    
    if ('transformOrigin' in style) {
        name = 'transform-origin';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transformOrigin || this._computedStyle.transformOrigin || '50% 50% 0';
        };
        
        /**
         * @ignore
         */
        set = function (transformOrigin) {
            this._style.transformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('MozTransformOrigin' in style) {
        name = '-moz-transform-origin';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransformOrigin || this._computedStyle.MozTransformOrigin || '50% 50% 0';
        };
        
        /**
         * @ignore
         */
        set = function (transformOrigin) {
            this._style.MozTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('WebkitTransformOrigin' in style) {
        name = '-webkit-transform-origin';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransformOrigin || this._computedStyle.WebkitTransformOrigin || '50% 50% 0';
        };
        
        /**
         * @ignore
         */
        set = function (transformOrigin) {
            this._style.WebkitTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('MsTransformOrigin' in style) {
        name = '-ms-transform-origin';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransformOrigin || this._computedStyle.MsTransformOrigin || '50% 50% 0';
        };
        
        /**
         * @ignore
         */
        set = function (transformOrigin) {
            this._style.MsTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('OTransformOrigin' in style) {
        name = '-o-transform-origin';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransformOrigin || this._computedStyle.OTransformOrigin || '50% 50% 0';
        };
        
        /**
         * @ignore
         */
        set = function (transformOrigin) {
            this._style.OTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return '50% 50% 0';
        };
        
        /**
         * @ignore
         */
        set = function (transformOrigin) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // transform-styleの登録
    parts[i] = {name: 'transformStyle'};
    
    if ('transformStyle' in style) {
        name = 'transform-style';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transformStyle || this._computedStyle.transformStyle || 'flat';
        };
        
        /**
         * @ignore
         */
        set = function (transformStyle) {
            this._style.transformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('MozTransformStyle' in style) {
        name = '-moz-transform-style';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransformStyle || this._computedStyle.MozTransformStyle || 'flat';
        };
        
        /**
         * @ignore
         */
        set = function (transformStyle) {
            this._style.MozTransformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('WebkitTransformStyle' in style) {
        name = '-webkit-transform-style';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransformStyle || this._computedStyle.WebkitTransformStyle || 'flat';
        };
        
        /**
         * @ignore
         */
        set = function (transformStyle) {
            this._style.WebkitTransformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('MsTransformStyle' in style) {
        name = '-ms-transform-style';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransformStyle || this._computedStyle.MsTransformStyle || 'flat';
        };
        
        /**
         * @ignore
         */
        set = function (transformStyle) {
            this._style.MsTransformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('OTransformStyle' in style) {
        name = '-o-transform-style';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransformStyle || this._computedStyle.OTransformStyle || 'flat';
        };
        
        /**
         * @ignore
         */
        set = function (transformStyle) {
            this._style.OTransformStyle = transformStyle;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'flat';
        };
        
        /**
         * @ignore
         */
        set = function (transformStyle) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    

    // transformの登録
    parts[i] = {name: 'transform'};
    
    if ('transform' in style) {
        name = 'transform';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transform || this._computedStyle.transform || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (transform) {
            this._style.transform = transform;
        };
        
        filter = null;
    } else if ('MozTransform' in style) {
        name = '-moz-transform';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransform || this._computedStyle.MozTransform || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (transform) {
            this._style.MozTransform = transform;
        };
        
        filter = null;
    } else if ('WebkitTransform' in style) {
        name = '-webkit-transform';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransform || this._computedStyle.WebkitTransform || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (transform) {
            this._style.WebkitTransform = transform;
        };
        
        filter = null;
    } else if ('MsTransform' in style) {
        name = '-ms-transform';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransform || this._computedStyle.MsTransform || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (transform) {
            this._style.MsTransform = transform;
        };
        
        filter = null;
    } else if ('OTransform' in style) {
        name = '-o-transform';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransform || this._computedStyle.OTransform || 'none';
        };
        
        /**
         * @ignore
         */
        set = function (transform) {
            this._style.OTransform = transform;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'none';
        };
        
        /**
         * @ignore
         */
        set = function (transform) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // rotateの登録
    parts[i] = {name: 'rotate'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/rotate\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    /**
     * @ignore
     */
    set = function (rotate) {
        this.transform(this.rotate(rotate, true));
    };
    
    /**
     * @ignore
     */
    filter = function (rotate) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'rotate(' + rotate + ')';
        } else if (trs.indexOf('rotate(') < 0) {
            trs += ' rotate(' + rotate + ')';
        } else {
            trs = trs.replace(/rotate\(([^\)]+)\)/i, 'rotate(' + rotate + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // rotateXの登録
    parts[i] = {name: 'rotateX'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/rotateX\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    /**
     * @ignore
     */
    set = function (rotateX) {
        this.transform(this.rotateX(rotateX, true));
    };
    
    /**
     * @ignore
     */
    filter = function (rotateX) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'rotateX(' + rotateX + ')';
        } else if (trs.indexOf('rotateX(') < 0) {
            trs += ' rotateX(' + rotateX + ')';
        } else {
            trs = trs.replace(/rotateX\(([^\)]+)\)/i, 'rotateX(' + rotateX + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // rotateYの登録
    parts[i] = {name: 'rotateY'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/rotateY\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    /**
     * @ignore
     */
    set = function (rotateY) {
        this.transform(this.rotateY(rotateY, true));
    };
    
    /**
     * @ignore
     */
    filter = function (rotateY) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'rotateY(' + rotateY + ')';
        } else if (trs.indexOf('rotateY(') < 0) {
            trs += ' rotateY(' + rotateY + ')';
        } else {
            trs = trs.replace(/rotateY\(([^\)]+)\)/i, 'rotateY(' + rotateY + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // rotateZの登録
    parts[i] = {name: 'rotateZ'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/rotateZ\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    /**
     * @ignore
     */
    set = function (rotateZ) {
        this.transform(this.rotateZ(rotateZ, true));
    };
    
    /**
     * @ignore
     */
    filter = function (rotateZ) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'rotateZ(' + rotateZ + ')';
        } else if (trs.indexOf('rotateZ(') < 0) {
            trs += ' rotateZ(' + rotateZ + ')';
        } else {
            trs = trs.replace(/rotateZ\(([^\)]+)\)/i, 'rotateZ(' + rotateZ + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // rotate3dの登録
    parts[i] = {name: 'rotate3d'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/rotate3d\(([^\)]+)\)/i);
        return match && match[1] || '0, 0, 0, 0deg';
    };
    
    /**
     * @ignore
     */
    set = function (rotate3d) {
        this.transform(this.rotate3d(rotate3d, true));
    };
    
    /**
     * @ignore
     */
    filter = function (rotate3d) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'rotate3d(' + rotate3d + ')';
        } else if (trs.indexOf('rotate3d(') < 0) {
            trs += ' rotate3d(' + rotate3d + ')';
        } else {
            trs = trs.replace(/rotate3d\(([^\)]+)\)/i, 'rotate3d(' + rotate3d + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // translateの登録
    parts[i] = {name: 'translate'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/translate\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    /**
     * @ignore
     */
    set = function (translate) {
        this.transform(this.translate(translate, true));
    };
    
    /**
     * @ignore
     */
    filter = function (translate) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'translate(' + translate + ')';
        } else if (trs.indexOf('translate(') < 0) {
            trs += ' translate(' + translate + ')';
        } else {
            trs = trs.replace(/translate\([^\)]+\)/i, 'translate(' + translate + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // translateXの登録
    parts[i] = {name: 'translateX'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/translateX\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    /**
     * @ignore
     */
    set = function (translateX) {
        this.transform(this.translateX(translateX, true));
    };
    
    /**
     * @ignore
     */
    filter = function (translateX) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'translateX(' + translateX + ')';
        } else if (trs.indexOf('translateX(') < 0) {
            trs += ' translateX(' + translateX + ')';
        } else {
            trs = trs.replace(/translateX\([^\)]+\)/i, 'translateX(' + translateX + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // translateYの登録
    parts[i] = {name: 'translateY'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/translateY\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    /**
     * @ignore
     */
    set = function (translateY) {
        this.transform(this.translateY(translateY, true));
    };
    
    /**
     * @ignore
     */
    filter = function (translateY) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'translateY(' + translateY + ')';
        } else if (trs.indexOf('translateY(') < 0) {
            trs += ' translateY(' + translateY + ')';
        } else {
            trs = trs.replace(/translateY\([^\)]+\)/i, 'translateY(' + translateY + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // translateZの登録
    parts[i] = {name: 'translateZ'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/translateZ\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    /**
     * @ignore
     */
    set = function (translateZ) {
        this.transform(this.translateZ(translateZ, true));
    };
    
    /**
     * @ignore
     */
    filter = function (translateZ) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'translateZ(' + translateZ + ')';
        } else if (trs.indexOf('translateZ(') < 0) {
            trs += ' translateZ(' + translateZ + ')';
        } else {
            trs = trs.replace(/translateZ\([^\)]+\)/i, 'translateZ(' + translateZ + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // translate3dの登録
    parts[i] = {name: 'translate3d'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/translate3d\(([^\)]+)\)/i);
        return match && match[1] || '0px, 0px, 0px';
    };
    
    /**
     * @ignore
     */
    set = function (translate3d) {
        this.transform(this.translate3d(translate3d, true));
    };
    
    /**
     * @ignore
     */
    filter = function (translate3d) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'translate3d(' + translate3d + ')';
        } else if (trs.indexOf('translate3d(') < 0) {
            trs += ' translate3d(' + translate3d + ')';
        } else {
            trs = trs.replace(/translate3d\([^\)]+\)/i, 'translate3d(' + translate3d + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // scaleの登録
    parts[i] = {name: 'scale'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/scale\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    /**
     * @ignore
     */
    set = function (scale) {
        this.transform(this.scale(scale, true));
    };
    
    /**
     * @ignore
     */
    filter = function (scale) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'scale(' + scale + ')';
        } else if (trs.indexOf('scale(') < 0) {
            trs += ' scale(' + scale + ')';
        } else {
            trs = trs.replace(/scale\([^\)]+\)/i, 'scale(' + scale + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // scaleXの登録
    parts[i] = {name: 'scaleX'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/scaleX\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    /**
     * @ignore
     */
    set = function (scaleX) {
        this.transform(this.scaleX(scaleX, true));
    };
    
    /**
     * @ignore
     */
    filter = function (scaleX) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'scaleX(' + scaleX + ')';
        } else if (trs.indexOf('scaleX(') < 0) {
            trs += ' scaleX(' + scaleX + ')';
        } else {
            trs = trs.replace(/scaleX\([^\)]+\)/i, 'scaleX(' + scaleX + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // scaleYの登録
    parts[i] = {name: 'scaleY'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/scaleY\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    /**
     * @ignore
     */
    set = function (scaleY) {
        this.transform(this.scaleY(scaleY, true));
    };
    
    /**
     * @ignore
     */
    filter = function (scaleY) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'scaleY(' + scaleY + ')';
        } else if (trs.indexOf('scaleY(') < 0) {
            trs += ' scaleY(' + scaleY + ')';
        } else {
            trs = trs.replace(/scaleY\([^\)]+\)/i, 'scaleY(' + scaleY + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // scaleZの登録
    parts[i] = {name: 'scaleZ'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/scaleZ\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    /**
     * @ignore
     */
    set = function (scaleZ) {
        this.transform(this.scaleZ(scaleZ, true));
    };
    
    /**
     * @ignore
     */
    filter = function (scaleZ) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'scaleZ(' + scaleZ + ')';
        } else if (trs.indexOf('scaleZ(') < 0) {
            trs += ' scaleZ(' + scaleZ + ')';
        } else {
            trs = trs.replace(/scaleZ\([^\)]+\)/i, 'scaleZ(' + scaleZ + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // scale3dの登録
    parts[i] = {name: 'scale3d'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/scale3d\(([^\)]+)\)/i);
        return match && match[1] || '1, 1, 1';
    };
    
    /**
     * @ignore
     */
    set = function (scale3d) {
        this.transform(this.scale3d(scale3d, true));
    };
    
    /**
     * @ignore
     */
    filter = function (scale3d) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'scale3d(' + scale3d + ')';
        } else if (trs.indexOf('scale3d(') < 0) {
            trs += ' scale3d(' + scale3d + ')';
        } else {
            trs = trs.replace(/scale3d\([^\)]+\)/i, 'scale3d(' + scale3d + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // skewの登録
    parts[i] = {name: 'skew'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/skew\(([^\)]+)\)/i);
        return match && match[1] || '0deg, 0deg';
    };
    
    /**
     * @ignore
     */
    set = function (skew) {
        this.transform(this.skew(skew, true));
    };
    
    /**
     * @ignore
     */
    filter = function (skew) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'skew(' + skew + ')';
        } else if (trs.indexOf('skew(') < 0) {
            trs += ' skew(' + skew + ')';
        } else {
            trs = trs.replace(/skew\([^\)]+\)/i, 'skew(' + skew + ')');
        }
        
        this.transform(trs);
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // skewXの登録
    parts[i] = {name: 'skewX'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/skewX\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    /**
     * @ignore
     */
    set = function (skewX) {
        this.transform(this.skewX(skewX, true));
    };
    
    /**
     * @ignore
     */
    filter = function (skewX) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'skewX(' + skewX + ')';
        } else if (trs.indexOf('skewX(') < 0) {
            trs += ' skewX(' + skewX + ')';
        } else {
            trs = trs.replace(/skewX\([^\)]+\)/i, 'skewX(' + skewX + ')');
        }
        
        this.transform(trs);
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // skewYの登録
    parts[i] = {name: 'skewY'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/skewY\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    /**
     * @ignore
     */
    set = function (skewY) {
        this.transform(this.skewY(skewY, true));
    };
    
    /**
     * @ignore
     */
    filter = function (skewY) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'skewY(' + skewY + ')';
        } else if (trs.indexOf('skewY(') < 0) {
            trs += ' skewY(' + skewY + ')';
        } else {
            trs = trs.replace(/skewY\([^\)]+\)/i, 'skewY(' + skewY + ')');
        }
        
        this.transform(trs);
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // matrixの登録
    parts[i] = {name: 'matrix'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/matrix\(([^\)]+)\)/i);
        return match && match[1] || '1, 0, 0, 1, 0, 0';
    };
    
    /**
     * @ignore
     */
    set = function (matrix) {
        this.transform(this.matrix(matrix, true));
    };
    
    /**
     * @ignore
     */
    filter = function (matrix) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'matrix(' + matrix + ')';
        } else if (trs.indexOf('matrix(') < 0) {
            trs += ' matrix(' + matrix + ')';
        } else {
            trs = trs.replace(/matrix\(([^\)]+)\)/i, 'matrix(' + matrix + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // matrix3dの登録
    parts[i] = {name: 'matrix3d'};
    
    /**
     * @ignore
     */
    get = function () {
        var match = this.transform().match(/matrix3d\(([^\)]+)\)/i);
        return match && match[1] || '1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1';
    };
    
    /**
     * @ignore
     */
    set = function (matrix3d) {
        this.transform(this.matrix3d(matrix3d, true));
    };
    
    /**
     * @ignore
     */
    filter = function (matrix3d) {
        var trs = this.transform();
        
        if ( ! trs || trs === 'none') {
            trs = 'matrix3d(' + matrix3d + ')';
        } else if (trs.indexOf('matrix3d(') < 0) {
            trs += ' matrix3d(' + matrix3d + ')';
        } else {
            trs = trs.replace(/matrix3d\(([^\)]+)\)/i, 'matrix3d(' + matrix3d + ')');
        }
        
        return trs;
    };
    
    parts[i].originName = name || 'transform';
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    

    // transitionの登録
    parts[i] = {name: 'transition'};
    
    if ('transition' in style) {
        name = 'transition';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transition || this._computedStyle.transition || 'all 0 ease 0';
        };
        
        /**
         * @ignore
         */
        set = function (transition) {
            this._style.transition = transition;
        };
        
        filter = null;
    } else if ('MozTransition' in style) {
        name = '-moz-transition';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransition || this._computedStyle.MozTransition || 'all 0 ease 0';
        };
        
        /**
         * @ignore
         */
        set = function (transition) {
            this._style.MozTransition = transition;
        };
        
        filter = null;
    } else if ('WebkitTransition' in style) {
        name = '-webkit-transition';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransition || this._computedStyle.WebkitTransition || 'all 0 ease 0';
        };
        
        /**
         * @ignore
         */
        set = function (transition) {
            this._style.WebkitTransition = transition;
        };
        
        filter = null;
    } else if ('MsTransition' in style) {
        name = '-ms-transition';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransition || this._computedStyle.MsTransition || 'all 0 ease 0';
        };
        
        /**
         * @ignore
         */
        set = function (transition) {
            this._style.MsTransition = transition;
        };
        
        filter = null;
    } else if ('OTransition' in style) {
        name = '-o-transition';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransition || this._computedStyle.OTransition || 'all 0 ease 0';
        };
        
        /**
         * @ignore
         */
        set = function (transition) {
            this._style.OTransition = transition;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'all 0 ease 0';
        };
        
        /**
         * @ignore
         */
        set = function (transition) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // transition-propertyの登録
    parts[i] = {name: 'transitionProperty'};
    
    if ('transitionProperty' in style) {
        name = 'transition-property';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transitionProperty || this._computedStyle.transitionProperty || 'all';
        };
        
        /**
         * @ignore
         */
        set = function (transitionProperty) {
            this._style.transitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('MozTransitionProperty' in style) {
        name = '-moz-transition-property';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransitionProperty || this._computedStyle.MozTransitionProperty || 'all';
        };
        
        /**
         * @ignore
         */
        set = function (transitionProperty) {
            this._style.MozTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('WebkitTransitionProperty' in style) {
        name = '-webkit-transition-property';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransitionProperty || this._computedStyle.WebkitTransitionProperty || 'all';
        };
        
        /**
         * @ignore
         */
        set = function (transitionProperty) {
            this._style.WebkitTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('MsTransitionProperty' in style) {
        name = '-ms-transition-property';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransitionProperty || this._computedStyle.MsTransitionProperty || 'all';
        };
        
        /**
         * @ignore
         */
        set = function (transitionProperty) {
            this._style.MsTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('OTransitionProperty' in style) {
        name = '-o-transition-property';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransitionProperty || this._computedStyle.OTransitionProperty || 'all';
        };
        
        /**
         * @ignore
         */
        set = function (transitionProperty) {
            this._style.OTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'all';
        };
        
        /**
         * @ignore
         */
        set = function (transitionProperty) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // transition-durationの登録
    parts[i] = {name: 'transitionDuration'};
    
    if ('transitionDuration' in style) {
        name = 'transition-duration';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transitionDuration || this._computedStyle.transitionDuration || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDuration) {
            this._style.transitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('MozTransitionDuration' in style) {
        name = '-moz-transition-duration';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransitionDuration || this._computedStyle.MozTransitionDuration || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDuration) {
            this._style.MozTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('WebkitTransitionDuration' in style) {
        name = '-webkit-transition-duration';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransitionDuration || this._computedStyle.WebkitTransitionDuration || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDuration) {
            this._style.WebkitTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('MsTransitionDuration' in style) {
        name = '-ms-transition-duration';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransitionDuration || this._computedStyle.MsTransitionDuration || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDuration) {
            this._style.MsTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('OTransitionDuration' in style) {
        name = '-o-transition-duration';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransitionDuration || this._computedStyle.OTransitionDuration || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDuration) {
            this._style.OTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDuration) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // transition-timing-functionの登録
    parts[i] = {name: 'transitionTimingFunction'};
    
    if ('transitionTimingFunction' in style) {
        name = 'transition-timing-function';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transitionTimingFunction || this._computedStyle.transitionTimingFunction || 'ease';
        };
        
        /**
         * @ignore
         */
        set = function (transitionTimingFunction) {
            this._style.transitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('MozTransitionTimingFunction' in style) {
        name = '-moz-transition-timing-function';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransitionTimingFunction || this._computedStyle.MozTransitionTimingFunction || 'ease';
        };
        
        /**
         * @ignore
         */
        set = function (transitionTimingFunction) {
            this._style.MozTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('WebkitTransitionTimingFunction' in style) {
        name = '-webkit-transition-timing-function';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransitionTimingFunction || this._computedStyle.WebkitTransitionTimingFunction || 'ease';
        };
        
        /**
         * @ignore
         */
        set = function (transitionTimingFunction) {
            this._style.WebkitTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('MsTransitionTimingFunction' in style) {
        name = '-ms-transition-timing-function';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransitionTimingFunction || this._computedStyle.MsTransitionTimingFunction || 'ease';
        };
        
        /**
         * @ignore
         */
        set = function (transitionTimingFunction) {
            this._style.MsTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('OTransitionTimingFunction' in style) {
        name = '-o-transition-timing-function';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransitionTimingFunction || this._computedStyle.OTransitionTimingFunction || 'ease';
        };
        
        /**
         * @ignore
         */
        set = function (transitionTimingFunction) {
            this._style.OTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return 'ease';
        };
        
        /**
         * @ignore
         */
        set = function (transitionTimingFunction) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    
    // transition-delayの登録
    parts[i] = {name: 'transitionDelay'};
    
    if ('transitionDelay' in style) {
        name = 'transition-delay';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.transitionDelay || this._computedStyle.transitionDelay || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDelay) {
            this._style.transitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('MozTransitionDelay' in style) {
        name = '-moz-transition-delay';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MozTransitionDelay || this._computedStyle.MozTransitionDelay || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDelay) {
            this._style.MozTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('WebkitTransitionDelay' in style) {
        name = '-webkit-transition-delay';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.WebkitTransitionDelay || this._computedStyle.WebkitTransitionDelay || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDelay) {
            this._style.WebkitTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('MsTransitionDelay' in style) {
        name = '-ms-transition-delay';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.MsTransitionDelay || this._computedStyle.MsTransitionDelay || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDelay) {
            this._style.MsTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('OTransitionDelay' in style) {
        name = '-o-transition-delay';
        
        /**
         * @ignore
         */
        get = function () {
            return this._style.OTransitionDelay || this._computedStyle.OTransitionDelay || '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDelay) {
            this._style.OTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else {
        name = null;
        
        /**
         * @ignore
         */
        get = function () {
            return '0';
        };
        
        /**
         * @ignore
         */
        set = function (transitionDelay) {};
        
        filter = null;
    }
    
    parts[i].originName = name;
    parts[i].get = get;
    parts[i].set = set;
    parts[i].filter = filter;
    
    i++;
    
    for (i = parts.length; i--;) {
        part = Jeeel.Dom.Style.Custom.createPart(parts[i].name, parts[i].get, parts[i].set, parts[i].originName, parts[i].filter);
        
        Jeeel.Dom.Style.Custom.register(part);
    }

    // 念のためメモリリーク対策
    style = parts = part = name = get = set = filter = null;
})();