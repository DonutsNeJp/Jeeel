/**
 * カスタムスタイルの初期登録を行う
 */
(function () {
    
    if ( ! Jeeel._elm) {
        return;
    }
    
    var style = Jeeel._elm.style;
    var parts = [], i = 0, part, name, get, set, filter;
    
    // opacityの登録
    parts[i] = {name: 'opacity'};
    
    if ('MozOpacity' in style) {
        name = '-moz-opacity';
        
        get = function () {
            return this._style.MozOpacity || '1.0';
        };
        
        set = function (opacity) {
            this._style.MozOpacity = opacity;
        };
        
        filter = null;
    } else if ('opacity' in style) {
        name = 'opacity';
        
        get = function () {
            return this._style.opacity || '1.0';
        };
        
        set = function (opacity) {
            this._style.opacity = opacity;
        };
        
        filter = null;
    } else if ('filter' in style) {
        name = 'filter';
        
        get = function () {
            var match = this._style.filter.match(/alpha\(.*opacity=(-?[0-9.]+).*\)/i);
            return '' + ((match && match[1] || 100) / 100);
        };
        
        set = function (opacity) {

            var css = this.opacity(opacity, true);
            
            this._style.cssText += ';' + css;
        };
        
        filter = function (opacity) {
            opacity = opacity * 100;

            var hack = '';
            
            if ( ! this._style.zoom) {
                hack = '; zoom: 1';
            }
            
            var filter = this._style.filter;

            if ( ! filter) {
                filter = 'alpha(opacity=' + opacity + ')';
            } else if (filter.indexOf('alpha(') < 0) {
                filter += ' alpha(opacity=' + opacity + ')';
            } else {
                filter = filter.replace(/alpha\(.*opacity=(-?[0-9.]+).*\)/i, 'alpha(opacity=' + opacity + ')');
            }
            
            return filter + hack;
        };
    } else {
        name = null;
        
        get = function () {
            return 1.0;
        };
        
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
        
        get = function () {
            return this._style.backgroundPositionX || '0%';
        };
        
        set = function (position) {
            this._style.backgroundPositionX = position;
        };
        
        filter = null;
    } else if ('backgroundPosition' in style) {
        name = 'backgroundPosition';
        
        get = function () {
            var pos = this._style.backgroundPosition.split(' ');
            
            if (pos.length > 1) {
                return pos[0];
            }
            
            return '0%';
        };
        
        set = function (position) {
            this._style.backgroundPosition = this.backgroundPositionX(position, true);
        };
        
        filter = function (position) {
            var pos = this._style.backgroundPosition.split(' ');
            
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
        
        get = function () {
            return '0%';
        };
        
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
        
        get = function () {
            return this._style.backgroundPositionY || '0%';
        };
        
        set = function (position) {
            this._style.backgroundPositionY = position;
        };
        
        filter = null;
    } else if ('backgroundPosition' in style) {
        name = 'backgroundPosition';
        
        get = function () {
            var pos = this._style.backgroundPosition.split(' ');
            
            if (pos.length > 1) {
                return pos[1];
            }
            
            return '0%';
        };
        
        set = function (position) {
            this._style.backgroundPosition = this.backgroundPositionY(position, true);
        };
        
        filter = function (position) {
            var pos = this._style.backgroundPosition.split(' ');
            
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
        
        get = function () {
            return '0%';
        };
        
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
    
    if ('MozPerspective' in style) {
        name = '-moz-perspective';
        
        get = function () {
            return this._style.MozPerspective || 'none';
        };
        
        set = function (perspective) {
            this._style.MozPerspective = perspective;
        };
        
        filter = null;
    } else if ('WebkitPerspective' in style) {
        name = '-webkit-perspective';
        
        get = function () {
            return this._style.WebkitPerspective || 'none';
        };
        
        set = function (perspective) {
            this._style.WebkitPerspective = perspective;
        };
        
        filter = null;
    } else if ('MsPerspective' in style) {
        name = '-ms-perspective';
        
        get = function () {
            return this._style.MsPerspective || 'none';
        };
        
        set = function (perspective) {
            this._style.MsPerspective = perspective;
        };
        
        filter = null;
    } else if ('OPerspective' in style) {
        name = '-o-perspective';
        
        get = function () {
            return this._style.OPerspective || 'none';
        };
        
        set = function (perspective) {
            this._style.OPerspective = perspective;
        };
        
        filter = null;
    } else if ('perspective' in style) {
        name = 'perspective';
        
        get = function () {
            return this._style.perspective || 'none';
        };
        
        set = function (perspective) {
            this._style.perspective = perspective;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return 'none';
        };
        
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
    
    if ('MozBackfaceVisibility' in style) {
        name = '-moz-backface-visibility';
        
        get = function () {
            return this._style.MozBackfaceVisibility || 'visible';
        };
        
        set = function (backfaceVisibility) {
            this._style.MozBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('WebkitBackfaceVisibility' in style) {
        name = '-webkit-backface-visibility';
        
        get = function () {
            return this._style.WebkitBackfaceVisibility || 'visible';
        };
        
        set = function (backfaceVisibility) {
            this._style.WebkitBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('MsBackfaceVisibility' in style) {
        name = '-ms-backface-visibility';
        
        get = function () {
            return this._style.MsBackfaceVisibility || 'visible';
        };
        
        set = function (backfaceVisibility) {
            this._style.MsBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('OBackfaceVisibility' in style) {
        name = '-o-backface-visibility';
        
        get = function () {
            return this._style.OBackfaceVisibility || 'visible';
        };
        
        set = function (backfaceVisibility) {
            this._style.OBackfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else if ('backfaceVisibility' in style) {
        name = 'backface-visibility';
        
        get = function () {
            return this._style.backfaceVisibility || 'visible';
        };
        
        set = function (backfaceVisibility) {
            this._style.backfaceVisibility = backfaceVisibility;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return 'visible';
        };
        
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
    
    if ('MozTransformOrigin' in style) {
        name = '-moz-transform-origin';
        
        get = function () {
            return this._style.MozTransformOrigin || '50% 50% 0';
        };
        
        set = function (transformOrigin) {
            this._style.MozTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('WebkitTransformOrigin' in style) {
        name = '-webkit-transform-origin';
        
        get = function () {
            return this._style.WebkitTransformOrigin || '50% 50% 0';
        };
        
        set = function (transformOrigin) {
            this._style.WebkitTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('MsTransformOrigin' in style) {
        name = '-ms-transform-origin';
        
        get = function () {
            return this._style.MsTransformOrigin || '50% 50% 0';
        };
        
        set = function (transformOrigin) {
            this._style.MsTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('OTransformOrigin' in style) {
        name = '-o-transform-origin';
        
        get = function () {
            return this._style.OTransformOrigin || '50% 50% 0';
        };
        
        set = function (transformOrigin) {
            this._style.OTransformOrigin = transformOrigin;
        };
        
        filter = null;
    } else if ('transformOrigin' in style) {
        name = 'transform-origin';
        
        get = function () {
            return this._style.transformOrigin || '50% 50% 0';
        };
        
        set = function (transformOrigin) {
            this._style.transformOrigin = transformOrigin;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return '50% 50% 0';
        };
        
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
    
    if ('MozTransformStyle' in style) {
        name = '-moz-transform-style';
        
        get = function () {
            return this._style.MozTransformStyle || 'flat';
        };
        
        set = function (transformStyle) {
            this._style.MozTransformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('WebkitTransformStyle' in style) {
        name = '-webkit-transform-style';
        
        get = function () {
            return this._style.WebkitTransformStyle || 'flat';
        };
        
        set = function (transformStyle) {
            this._style.WebkitTransformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('MsTransformStyle' in style) {
        name = '-ms-transform-style';
        
        get = function () {
            return this._style.MsTransformStyle || 'flat';
        };
        
        set = function (transformStyle) {
            this._style.MsTransformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('OTransformStyle' in style) {
        name = '-o-transform-style';
        
        get = function () {
            return this._style.OTransformStyle || 'flat';
        };
        
        set = function (transformStyle) {
            this._style.OTransformStyle = transformStyle;
        };
        
        filter = null;
    } else if ('transformStyle' in style) {
        name = 'transform-style';
        
        get = function () {
            return this._style.transformStyle || 'flat';
        };
        
        set = function (transformStyle) {
            this._style.transformStyle = transformStyle;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return 'flat';
        };
        
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
    
    if ('MozTransform' in style) {
        name = '-moz-transform';
        
        get = function () {
            return this._style.MozTransform || 'none';
        };
        
        set = function (transform) {
            this._style.MozTransform = transform;
        };
        
        filter = null;
    } else if ('WebkitTransform' in style) {
        name = '-webkit-transform';
        
        get = function () {
            return this._style.WebkitTransform || 'none';
        };
        
        set = function (transform) {
            this._style.WebkitTransform = transform;
        };
        
        filter = null;
    } else if ('MsTransform' in style) {
        name = '-ms-transform';
        
        get = function () {
            return this._style.MsTransform || 'none';
        };
        
        set = function (transform) {
            this._style.MsTransform = transform;
        };
        
        filter = null;
    } else if ('OTransform' in style) {
        name = '-o-transform';
        
        get = function () {
            return this._style.OTransform || 'none';
        };
        
        set = function (transform) {
            this._style.OTransform = transform;
        };
        
        filter = null;
    } else if ('transform' in style) {
        name = 'transform';
        
        get = function () {
            return this._style.transform || 'none';
        };
        
        set = function (transform) {
            this._style.transform = transform;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return 'none';
        };
        
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
    
    get = function () {
        var match = this.transform().match(/rotate\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    set = function (rotate) {
        this.transform(this.rotate(rotate, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/rotateX\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    set = function (rotateX) {
        this.transform(this.rotateX(rotateX, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/rotateY\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    set = function (rotateY) {
        this.transform(this.rotateY(rotateY, true));
    };
    
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
    
    
    // rotateYの登録
    parts[i] = {name: 'rotateZ'};
    
    get = function () {
        var match = this.transform().match(/rotateZ\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    set = function (rotateZ) {
        this.transform(this.rotateZ(rotateZ, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/rotate3d\(([^\)]+)\)/i);
        return match && match[1] || '0, 0, 0, 0deg';
    };
    
    set = function (rotate3d) {
        this.transform(this.rotate3d(rotate3d, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/translate\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    set = function (translate) {
        this.transform(this.translate(translate, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/translateX\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    set = function (translateX) {
        this.transform(this.translateX(translateX, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/translateY\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    set = function (translateY) {
        this.transform(this.translateY(translateY, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/translateZ\(([^\)]+)\)/i);
        return match && match[1] || '0px';
    };
    
    set = function (translateZ) {
        this.transform(this.translateZ(translateZ, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/translate3d\(([^\)]+)\)/i);
        return match && match[1] || '0px, 0px, 0px';
    };
    
    set = function (translate3d) {
        this.transform(this.translate3d(translate3d, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/scale\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    set = function (scale) {
        this.transform(this.scale(scale, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/scaleX\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    set = function (scaleX) {
        this.transform(this.scaleX(scaleX, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/scaleY\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    set = function (scaleY) {
        this.transform(this.scaleY(scaleY, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/scaleZ\(([^\)]+)\)/i);
        return match && match[1] || '1';
    };
    
    set = function (scaleZ) {
        this.transform(this.scaleZ(scaleZ, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/scale3d\(([^\)]+)\)/i);
        return match && match[1] || '1, 1, 1';
    };
    
    set = function (scale3d) {
        this.transform(this.scale3d(scale3d, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/skew\(([^\)]+)\)/i);
        return match && match[1] || '0deg, 0deg';
    };
    
    set = function (skew) {
        this.transform(this.skew(skew, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/skewX\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    set = function (skewX) {
        this.transform(this.skewX(skewX, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/skewY\(([^\)]+)\)/i);
        return match && match[1] || '0deg';
    };
    
    set = function (skewY) {
        this.transform(this.skewY(skewY, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/matrix\(([^\)]+)\)/i);
        return match && match[1] || '1, 0, 0, 1, 0, 0';
    };
    
    set = function (matrix) {
        this.transform(this.matrix(matrix, true));
    };
    
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
    
    get = function () {
        var match = this.transform().match(/matrix3d\(([^\)]+)\)/i);
        return match && match[1] || '1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1';
    };
    
    set = function (matrix3d) {
        this.transform(this.matrix3d(matrix3d, true));
    };
    
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
    
    if ('MozTransition' in style) {
        name = '-moz-transition';
        
        get = function () {
            return this._style.MozTransition || 'all 0 ease 0';
        };
        
        set = function (transition) {
            this._style.MozTransition = transition;
        };
        
        filter = null;
    } else if ('WebkitTransition' in style) {
        name = '-webkit-transition';
        
        get = function () {
            return this._style.WebkitTransition || 'all 0 ease 0';
        };
        
        set = function (transition) {
            this._style.WebkitTransition = transition;
        };
        
        filter = null;
    } else if ('MsTransition' in style) {
        name = '-ms-transition';
        
        get = function () {
            return this._style.MsTransition || 'all 0 ease 0';
        };
        
        set = function (transition) {
            this._style.MsTransition = transition;
        };
        
        filter = null;
    } else if ('OTransition' in style) {
        name = '-o-transition';
        
        get = function () {
            return this._style.OTransition || 'all 0 ease 0';
        };
        
        set = function (transition) {
            this._style.OTransition = transition;
        };
        
        filter = null;
    } else if ('transition' in style) {
        name = 'transition';
        
        get = function () {
            return this._style.transition || 'all 0 ease 0';
        };
        
        set = function (transition) {
            this._style.transition = transition;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return 'all 0 ease 0';
        };
        
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
    
    if ('MozTransitionProperty' in style) {
        name = '-moz-transition-property';
        
        get = function () {
            return this._style.MozTransitionProperty || 'all';
        };
        
        set = function (transitionProperty) {
            this._style.MozTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('WebkitTransitionProperty' in style) {
        name = '-webkit-transition-property';
        
        get = function () {
            return this._style.WebkitTransitionProperty || 'all';
        };
        
        set = function (transitionProperty) {
            this._style.WebkitTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('MsTransitionProperty' in style) {
        name = '-ms-transition-property';
        
        get = function () {
            return this._style.MsTransitionProperty || 'all';
        };
        
        set = function (transitionProperty) {
            this._style.MsTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('OTransitionProperty' in style) {
        name = '-o-transition-property';
        
        get = function () {
            return this._style.OTransitionProperty || 'all';
        };
        
        set = function (transitionProperty) {
            this._style.OTransitionProperty = transitionProperty;
        };
        
        filter = null;
    } else if ('transitionProperty' in style) {
        name = 'transition-property';
        
        get = function () {
            return this._style.transitionProperty || 'all';
        };
        
        set = function (transitionProperty) {
            this._style.transitionProperty = transitionProperty;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return 'all';
        };
        
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
    
    if ('MozTransitionDuration' in style) {
        name = '-moz-transition-duration';
        
        get = function () {
            return this._style.MozTransitionDuration || '0';
        };
        
        set = function (transitionDuration) {
            this._style.MozTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('WebkitTransitionDuration' in style) {
        name = '-webkit-transition-duration';
        
        get = function () {
            return this._style.WebkitTransitionDuration || '0';
        };
        
        set = function (transitionDuration) {
            this._style.WebkitTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('MsTransitionDuration' in style) {
        name = '-ms-transition-duration';
        
        get = function () {
            return this._style.MsTransitionDuration || '0';
        };
        
        set = function (transitionDuration) {
            this._style.MsTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('OTransitionDuration' in style) {
        name = '-o-transition-duration';
        
        get = function () {
            return this._style.OTransitionDuration || '0';
        };
        
        set = function (transitionDuration) {
            this._style.OTransitionDuration = transitionDuration;
        };
        
        filter = null;
    } else if ('transitionDuration' in style) {
        name = 'transition-duration';
        
        get = function () {
            return this._style.transitionDuration || '0';
        };
        
        set = function (transitionDuration) {
            this._style.transitionDuration = transitionDuration;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return '0';
        };
        
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
    
    if ('MozTransitionTimingFunction' in style) {
        name = '-moz-transition-timing-function';
        
        get = function () {
            return this._style.MozTransitionTimingFunction || 'ease';
        };
        
        set = function (transitionTimingFunction) {
            this._style.MozTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('WebkitTransitionTimingFunction' in style) {
        name = '-webkit-transition-timing-function';
        
        get = function () {
            return this._style.WebkitTransitionTimingFunction || 'ease';
        };
        
        set = function (transitionTimingFunction) {
            this._style.WebkitTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('MsTransitionTimingFunction' in style) {
        name = '-ms-transition-timing-function';
        
        get = function () {
            return this._style.MsTransitionTimingFunction || 'ease';
        };
        
        set = function (transitionTimingFunction) {
            this._style.MsTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('OTransitionTimingFunction' in style) {
        name = '-o-transition-timing-function';
        
        get = function () {
            return this._style.OTransitionTimingFunction || 'ease';
        };
        
        set = function (transitionTimingFunction) {
            this._style.OTransitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else if ('transitionTimingFunction' in style) {
        name = 'transition-timing-function';
        
        get = function () {
            return this._style.transitionTimingFunction || 'ease';
        };
        
        set = function (transitionTimingFunction) {
            this._style.transitionTimingFunction = transitionTimingFunction;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return 'ease';
        };
        
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
    
    if ('MozTransitionDelay' in style) {
        name = '-moz-transition-delay';
        
        get = function () {
            return this._style.MozTransitionDelay || '0';
        };
        
        set = function (transitionDelay) {
            this._style.MozTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('WebkitTransitionDelay' in style) {
        name = '-webkit-transition-delay';
        
        get = function () {
            return this._style.WebkitTransitionDelay || '0';
        };
        
        set = function (transitionDelay) {
            this._style.WebkitTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('MsTransitionDelay' in style) {
        name = '-ms-transition-delay';
        
        get = function () {
            return this._style.MsTransitionDelay || '0';
        };
        
        set = function (transitionDelay) {
            this._style.MsTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('OTransitionDelay' in style) {
        name = '-o-transition-delay';
        
        get = function () {
            return this._style.OTransitionDelay || '0';
        };
        
        set = function (transitionDelay) {
            this._style.OTransitionDelay = transitionDelay;
        };
        
        filter = null;
    } else if ('transitionDelay' in style) {
        name = 'transition-delay';
        
        get = function () {
            return this._style.transitionDelay || '0';
        };
        
        set = function (transitionDelay) {
            this._style.transitionDelay = transitionDelay;
        };
        
        filter = null;
    } else {
        name = null;
        
        get = function () {
            return '0';
        };
        
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