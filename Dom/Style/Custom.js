Jeeel.directory.Jeeel.Dom.Style.Custom = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Dom.Style + 'Custom/';
    }
};

Jeeel.Dom.Style.Custom = {
    opacity: {
        get: function (style) {
            if (Jeeel.Type.isSet(style.MozOpacity)) {
                return +(style.MozOpacity || 1.0);
            } else if (Jeeel.Type.isSet(style.opacity)) {
                return +(style.opacity || 1.0);
            } else if (Jeeel.Type.isSet(style.filter)) {
                return (style.filter.replace(/.*alpha\(.*opacity=([0-9]+).*\).*/, '$1') || 100) / 100;
            }

            return 1.0;
        },

        set: function (style, opacity) {
            if (Jeeel.Type.isSet(style.MozOpacity)) {
                style.MozOpacity = opacity;
            } else if (Jeeel.Type.isSet(style.opacity)) {
                style.opacity = opacity;
            } else if (Jeeel.Type.isSet(style.filter)) {
                style.zoom   = (style.zoom || 1);
                style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
            }
        }
    },
    
    transform: {
        get: function (style) {
            if (Jeeel.Type.isSet(style['-mozTransform'])) {
                return style['-mozTransform'] || 'none';
            } else if (Jeeel.Type.isSet(style['-webkitTransform'])) {
                return style['-webkitTransform'] || 'none';
            } else if (Jeeel.Type.isSet(style['-msTransform'])) {
                return style['-msTransform'] || 'none';
            } else if (Jeeel.Type.isSet(style['-oTransform'])) {
                return style['-oTransform'] || 'none';
            } else if (Jeeel.Type.isSet(style.transform)) {
                return style.transform || 'none';
            }

            return 'none';
        },

        set: function (style, transform) {
            if (Jeeel.Type.isSet(style['-mozTransform'])) {
                style['-mozTransform'] = transform;
            } else if (Jeeel.Type.isSet(style['-webkitTransform'])) {
                style['-webkitTransform'] = transform;
            } else if (Jeeel.Type.isSet(style['-msTransform'])) {
                style['-msTransform'] = transform;
            } else if (Jeeel.Type.isSet(style['-oTransform'])) {
                style['-oTransform'] = transform;
            } else if (Jeeel.Type.isSet(style.transform)) {
                style.transform = transform;
            }
        }
    },
    
    rotate: {
        get: function (style) {
            if (Jeeel.Type.isSet(style.MozOpacity)) {
                return +(style.MozOpacity || 1.0);
            } else if (Jeeel.Type.isSet(style.opacity)) {
                return +(style.opacity || 1.0);
            } else if (Jeeel.Type.isSet(style.filter)) {
                return (style.filter.replace(/.*alpha\(.*opacity=([0-9]+).*\).*/, '$1') || 100) / 100;
            }

            return 1.0;
        },

        set: function (style, opacity) {
            if (Jeeel.Type.isSet(style.MozOpacity)) {
                style.MozOpacity = opacity;
            } else if (Jeeel.Type.isSet(style.opacity)) {
                style.opacity = opacity;
            } else if (Jeeel.Type.isSet(style.filter)) {
                style.zoom   = (style.zoom || 1);
                style.filter = 'alpha(opacity=' + (opacity * 100) + ')';
            }
        }
    }
};

Jeeel.file.Jeeel.Dom.Style.Custom = ['Animation'];

Jeeel._autoImports(Jeeel.directory.Jeeel.Dom.Style.Custom, Jeeel.file.Jeeel.Dom.Style.Custom);