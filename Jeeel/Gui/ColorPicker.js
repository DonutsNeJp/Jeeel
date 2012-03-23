Jeeel.directory.Jeeel.Gui.ColorPicker = {

    /**
     * 自身を文字列参照された場合の変換
     *
     * @return {String} 自身のディレクトリ
     * @private
     */
    toString: function () {
        return Jeeel.directory.Jeeel.Gui + 'ColorPicker/';
    }
};

/**
 * コンストラクタ
 * 
 * @class カラーピッカーを扱うクラス
 * @augments Jeeel.Gui.Abstract
 * @param {Element} [appendTarget] 追加場所(デフォルトはbody)
 */
Jeeel.Gui.ColorPicker = function (appendTarget) {
    Jeeel.Gui.Abstract.call(this);
    
    this._init(appendTarget);
};

/**
 * インスタンスを作成する
 * 
 * @param {Element} [appendTarget] 追加場所(デフォルトはbody)
 * @return {Jeeel.Gui.ColorPicker} 作成したインスタンス
 */
Jeeel.Gui.ColorPicker.create = function (appendTarget) {
    return new this(appendTarget);
};

/**
 * カラーピッカー全インスタンス共通のスタイルを定義する
 */
Jeeel.Gui.ColorPicker.initStyle = function () {
    if (arguments.callee.ignore) {
        return;
    }
    
    arguments.callee.ignore = true;
    
    Jeeel.Loader.preloadFile(Jeeel.directory.Jeeel.Gui.ColorPicker + 'hue.png');
    Jeeel.Loader.preloadFile(Jeeel.directory.Jeeel.Gui.ColorPicker + 'luminance.png');
    
    var className = this.CLASS.COLOR_PICKER;
    var style = 'div.' + className + ' {\n'
              + '  position: absolute;\n'
              + '  z-index: 10;\n'
              + '  width: auto;\n'
              + '  height: auto;\n'
              + '  border: 1px solid #B6BAC0;\n'
              + '  background-color: #F9FAFC;\n'
              + '  overflow: hidden;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.COLOR_PALLET + ' {\n'
              + '  position: absolute;\n'
              + '  border-left: 1px solid black;\n'
              + '  border-top: 1px solid black;\n'
              + '  border-right: 1px solid white;\n'
              + '  border-bottom: 1px solid white;\n'
              + '  padding: 0;\n'
              + '  margin: 0;\n'
              + '  cursor: pointer;\n'
              + '  overflow: hidden;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.COLOR_PALLET + ' div.' + this.CLASS.COLOR_INDICATOR + ' {\n'
              + '  background-color: transparent;\n'
              + '  border: 1px solid white;\n'
              + '  border-radius: 50%;\n'
              + '  -moz-border-border-radius: 50%;\n'
              + '  -webkit-border-radius: 50%;\n'
              + '  -o-border-radius: 50%;\n'
              + '  -ms-border-radius: 50%;\n'
              + '  position: absolute;\n'
              + '  left: 0px;\n'
              + '  top: 0px;\n'
              + '  overflow: hidden;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.LUMINANCE_BAR + ' {\n'
              + '  border-left: 1px solid black;\n'
              + '  border-top: 1px solid black;\n'
              + '  border-right: 1px solid white;\n'
              + '  border-bottom: 1px solid white;\n'
              + '  padding: 0;\n'
              + '  margin: 0;\n'
              + '  position: absolute;\n'
              + '  cursor: pointer;\n'
              + '  overflow: hidden;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.LUMINANCE_BAR + ' div.' + this.CLASS.LUMINANCE_BAR_BACKGROUND + ' {\n'
              + '  position: absolute;\n'
              + '  z-index: -1;\n'
              + '  left: 0px;\n'
              + '  top: 0px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.LUMINANCE_BAR + ' div.' + this.CLASS.LUMINANCE_INDICATOR + ' {\n'
              + '  background-color: transparent;\n'
              + '  border-top: 1px solid #888888;\n'
              + '  border-bottom: 1px solid #ffffff;\n'
              + '  position: absolute;\n'
              + '  height: 5px;\n'
              + '  left: 0px;\n'
              + '  top: 0px;\n'
              + '  overflow: hidden;\n'
              + '  z-index: 1;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.LUMINANCE_BAR + ' div.' + this.CLASS.LUMINANCE_INDICATOR + ' div {\n'
              + '  background-color: transparent;\n'
              + '  border-top: 1px solid #ffffff;\n'
              + '  border-bottom: 1px solid #888888;\n'
              + '  height: 3px;\n'
              + '  width: 100%;\n'
              + '  overflow: hidden;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.HEADER + ' {\n'
              + '  overflow: hidden;\n'
              + '  width: 100%;\n'
              + '  height: ' + this.STYLE.HEADER_HEIGHT + 'px;\n'
              + '  background-color: #DDDDDD;\n'
              + '  border-bottom: 1px solid #B6BAC0;\n'
              + '  font-family: Arial, sans-serif;\n'
              + '  white-space: nowrap;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.HEADER + ' span.' + this.CLASS.TITLE + ' {\n'
              + '  padding: 0;\n'
              + '  margin: 0;\n'
              + '  padding-top: 2px;\n'
              + '  height: ' + this.STYLE.HEADER_HEIGHT + 'px;\n'
              + '  width: 90%;\n'
              + '  display: inline-block;\n'
              + '  text-align: center;\n'
              + '  font-size: 10px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.HEADER + ' button.' + this.CLASS.CLOSE_BUTTON + ' {\n'
              + '  padding: 0;\n'
              + '  margin: 0;\n'
              + '  padding-left: 2px;\n'
              + '  padding-right: 2px;\n'
              + '  font-size: 10px;\n'
              + '  vertical-align: top;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.FOOTER + ' {\n'
              + '  position: absolute;\n'
              + '  overflow: hidden;\n'
              + '  height: ' + this.STYLE.FOOTER_HEIGHT + 'px;\n'
              + '  font-size: 0px;\n'
              + '  font-family: Arial, sans-serif;\n'
              + '  white-space: nowrap;\n'
              + '  padding: 4px 0 2px 2px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.FOOTER + ' input {\n'
              + '  font-size: 11px;\n'
              + '  vertical-align: middle;\n'
              + '  padding: 0;\n'
              + '  margin: 0;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.FOOTER + ' input.' + this.CLASS.COLOR_DISPLAY + ' {\n'
              + '  width: 30px;\n'
              + '  margin-right: 3px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.FOOTER + ' input.' + this.CLASS.COLOR_TEXT_DISPLAY + ' {\n'
              + '  width: 50px;\n'
              + '  margin-right: 3px;\n'
              + '  padding-left: 3px;\n'
              + '  border-top-width: 1px;\n'
              + '  border-right-width: 1px;\n'
              + '  border-bottom-width: 1px;\n'
              + '  border-left-width: 1px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.FOOTER + ' input.' + this.CLASS.OK_BUTTON + ' {\n'
              + '  margin: 0 3px 0 2px;\n'
              + '  padding-left: 2px;\n'
              + '  padding-right: 2px;\n'
              + '  font-size: 10px;\n'
              + '}\n'
              + 'div.' + className + ' div.' + this.CLASS.FOOTER + ' input.' + this.CLASS.CLOSE_BUTTON + ' {\n'
              + '  padding-left: 2px;\n'
              + '  padding-right: 2px;\n'
              + '  font-size: 10px;\n'
              + '}';

    this._styleTag = Jeeel.Loader.addStyle(style);
};

/**
 * スタイル定義に使う定数
 */
Jeeel.Gui.ColorPicker.STYLE = {
    COLOR_PICKER_PADDING: 5,
    BORDER_WIDTH: 1,
    LUMINANCE_BAR_WIDTH: 15,
    LUMINANCE_BAR_LEFT_MARGIN: 10,
    HEADER_HEIGHT: 18,
    FOOTER_HEIGHT: 24
};

/**
 * カラーピッカーのクラス名
 */
Jeeel.Gui.ColorPicker.CLASS = {
    COLOR_PICKER: 'jeeel-gui-color-picker',
    TABLE: 'jeeel-gui-color-picker-table',
    COLOR_PALLET: 'jeeel-gui-color-picker-color-pallet',
    LUMINANCE_BAR: 'jeeel-gui-color-picker-luminance-bar',
    LUMINANCE_BAR_BACKGROUND: 'jeeel-gui-color-picker-luminance-bar-background',
    LUMINANCE_BAR_FOREGROUND: 'jeeel-gui-color-picker-luminance-bar-foreground',
    COLOR_INDICATOR: 'jeeel-gui-color-picker-color-indicator',
    LUMINANCE_INDICATOR: 'jeeel-gui-color-picker-luminance-indicator',
    HEADER: 'jeeel-gui-color-picker-header',
    FOOTER: 'jeeel-gui-color-picker-footer',
    TITLE: 'jeeel-gui-color-picker-title',
    COLOR_DISPLAY: 'jeeel-gui-color-picker-color-display',
    COLOR_TEXT_DISPLAY: 'jeeel-gui-color-picker-color-text-display',
    OK_BUTTON: 'jeeel-gui-color-picker-ok-button',
    CLOSE_BUTTON: 'jeeel-gui-color-picker-close-button'
};

/**
 * カラーピッカーの作成個数
 * 
 * @type Integer
 */
Jeeel.Gui.ColorPicker.createLength = 0;

Jeeel.Gui.ColorPicker.prototype = {
    _target: null,
    _callback: null,
    _color: null,
    _size: {
        width: 150, 
        height: 150,
        grid: 1,
        gridie: 2
    },
    
    _colorPicker: null,
    
    _resizing: false,
    
    _items: null,
    
    /**
     * OKボタンを押した際に呼び出されるメソッドをセットする
     * 
     * @param {Function} callback void callback(Jeeel.Object.Color color, String colorText)
     * @param {Mixied} [thisArg] コールバック中のthisに相当する値(デフォルトはこのインスタンスになる)
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    setCallback: function (callback, thisArg) {
        this._resetTarget();
        
        this._callback = {func: callback, thisArg: thisArg};
        
        return this;
    },
    
    /**
     * このインスタンスを紐付けるターゲットをセットする(コールバックの設定はキャンセルされる)
     * 
     * @param {Element} commonTarget 対象のElement(他の引数を指定しない場合このElementが他の引数と共通になる)
     * @param {Element} [textTarget] Textの値を受け取り専用のElement<br />
     *                                nullを渡すと省略と同じ意味になり、<br />
     *                                falseを渡せばTextの値の受け取りが無くなる
     * @param {Element} [bgTarget] BGカラー受け取り専用のElement<br />
     *                              nullを渡すと省略と同じ意味になり、<br />
     *                              falseを渡せばBGカラーの値の受け取りが無くなる
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    setTarget: function (commonTarget, textTarget, bgTarget) {
      
        this._resetTarget();
      
        this._target = {
            click: commonTarget,
            text: Jeeel.Type.isEmpty(textTarget) && commonTarget || textTarget,
            bg: Jeeel.Type.isEmpty(bgTarget) && commonTarget || bgTarget
        };
        
        Jeeel.Dom.ElementOperator.create(commonTarget).addClick(this._toggle, this);
        
        this._callback = {
            func: function (color, colorText) {
                var rgb = color.toRgb();
                var hsl = color.toHsl();
                
                if (this._target.bg) {
                    this._target.bg.style.backgroundColor = rgb.toString();
                }
                
                if (this._target.text && 'value' in this._target.text) {
                    this._target.text.value = colorText;
                    
                    if (this._target.bg === this._target.text) {
                        var fontColor;

                        if (hsl.luminance < 0.6) {
                            fontColor = '#ffffff';
                        } else {
                            fontColor = '#000000';
                        }

                        this._target.text.style.color = fontColor;
                    }
                }
            },
            
            thisArg: this
        };
        
        return this;
    },
    
    /**
     * カラーテキストの編集を許可するかどうかを設定する(カラーテキストの編集を可能にすると選択した色ではない文字列が帰ってくる可能性がある)
     * 
     * @param {Boolean} editable
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    editableColorText: function (editable) {
        this._items.colorTextDisplay.readOnly = !editable;
        
        return this;
    },
    
    /**
     * カラーピッカーを表示する
     * 
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    show: function () {
        if (this._resizing) {
            return this;
        }
        
        this._showElement(this._colorPicker, 10);
        
        return this;
    },

    /**
     * カラーピッカーを非表示にする
     * 
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    hide: function () {
        if (this._resizing) {
            return this;
        }
      
        this._hideElement(this._colorPicker, 10);
        
        return this;
    },
    
    /**
     * 指定の位置にカラーピッカーを移動する
     * 
     * @param {Integer} x X座標
     * @param {Integer} y Y座標
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    move: function (x, y) {
        var sty = this._colorPicker.style;
        
        sty.top = y + 'px';
        sty.left = x + 'px';
        
        return this;
    },
    
    /**
     * カラーピッカーの表示非表示を切り替える
     * 
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    toggle: function () {
        return this._colorPicker.style.display === 'none' ? this.show() : this.hide();
    },
    
    /**
     * 指定したカラーに設定する
     *
     * @param {Jeeel.Object.Color} color カラー
     * @return {Jeeel.Gui.ColorPicker} 自インスタンス
     */
    setColor: function (color) {
        this._color = color;
        
        this._drawLuminanceBar();
        this._updateSelectedColorInfo();
        this._updateIndicator();
        
        return this;
    },

    /**
     * 選択したカラーを取得する
     *
     * @return {Jeeel.Object.Color} カラー
     */
    getColor: function () {
        return this._color;
    },
    
    /**
     * コンストラクタ
     * 
     * @constructor
     */
    constructor: Jeeel.Gui.ColorPicker,
    
    _toggle: function (ev, elm) {
        
        var rect = Jeeel.Dom.Element.create(elm).getRect();
        
        this.move(rect.endPoint.x + 10, rect.y);
        
        this.toggle();
    },
    
    _resetTarget: function () {
        if ( ! this._target) {
            return;
        }
        
        Jeeel.Dom.ElementOperator.create(this._target.click).removeClick(this._toggle);
        
        this._target = null;
    },
    
    _showElement: function (elm, rate) {
        elm = $ELM(elm);
        
        var size = elm.getSize();
        var scalingSpeed = {w: size.width * rate / 100, h: size.height * rate / 100};
        var s = {w: 0, h: 0};
        
        elm.setStyleList({
            width: '0px',
            height: '0px',
            display: ''
        });
        
        var self = this;
        
        this._resizing = true;

        (function () {
            
            s.w += scalingSpeed.w;
            s.h += scalingSpeed.h;
            
            if (s.w > size.width) {
                s.w = size.width;
            }
            
            if (s.h > size.height) {
                s.h = size.height;
            }
            
            elm.setStyleList({
                width: s.w + 'px',
                height: s.h + 'px'
            });
            
            if (s.w < size.width || s.h < size.height) {
                setTimeout(arguments.callee, 16);
            } else {
                self._resizing = false;
            }
        })();
    },
    
    _hideElement: function (elm, rate) {
        elm = $ELM(elm);
        
        var size = elm.getSize();
        var scalingSpeed = {w: size.width * rate / 100, h: size.height * rate / 100};
        var s = {w: size.width, h: size.height};
        
        var self = this;
        
        this._resizing = true;

        (function () {
            
            s.w -= scalingSpeed.w;
            s.h -= scalingSpeed.h;
            
            if (s.w < 0) {
                s.w = 0;
            }
            
            if (s.h < 0) {
                s.h = 0;
            }
            
            elm.setStyleList({
                width: s.w + 'px',
                height: s.h + 'px'
            });
            
            if (s.w > 0 || s.h > 0) {
                setTimeout(arguments.callee, 16);
            } else {
                elm.setStyleList({
                    display: 'none',
                    width: size.width + 'px',
                    height: size.height + 'px'
                });
                
                self._resizing = false;
            }
        })();
    },

    _selectColor: function (ev, elm) {
        this.hide();
        
        if (this._callback) {
            this._callback.func.call(this._callback.thisArg || this, this._color, this._items.colorTextDisplay.value);
        }
    },
    
    _selectButtonSwitch: function (e, elm) {
        if (elm === this._items.okButton) {
            this._selectColor(e, elm);
        } else  {
            this.hide();
        }
    },
    
    _mouseDownSwitch: function (e, elm) {
        if (elm === this._items.colorPallet) {
            this._palletMouseDown(e, elm);
        } else  {
            this._luminanceMouseDown(e, elm);
        }
    },
    
    _mouseMoveSwitch: function (e, elm) {
        if (elm === this._items.colorPallet) {
            this._palletMouseMove(e, elm);
        } else  {
            this._luminanceMouseMove(e, elm);
        }
    },
    
    _mouseUpSwitch: function (e, elm) {
        if (elm === this._items.colorPallet) {
            this._palletMouseCancel(e, elm);
        } else  {
            this._luminanceMouseCancel(e, elm);
        }
    },
    
    _palletMouseDown: function (ev, elm) {
        if (this._items.colorIndicatorEnableMove) {
            return;
        }
        
        this._items.colorIndicatorEnableMove = true;
        
        this._palletMouseMove(ev, elm);
    },
    
    _palletMouseMove: function (ev, elm) {
        ev.stop();
        
        if ( ! this._items.colorIndicatorEnableMove) {
            return;
        }
        
        var cindStyle = this._items.colorIndicator.style;
        var size = this._size;
        var p = ev.getRelativeMousePoint(this._items.colorPallet);
        var x = p.x - 2;
        var y = p.y - 2;
        
        if (x < 0) {
            x = 0;
        } else if (x > size.width) {
            x = size.width;
        }
        
        if (y < 0) {
            y = 0;
        } else if (y > size.height) {
            y = size.height;
        }
        
        cindStyle.left = x + 'px';
        cindStyle.top = y + 'px';
        
        var hsl = this._color.toHsl();
        var h = x * 359 / size.width;
        var s = 1 - y / size.height;
        
        this._color = Jeeel.Object.Color.createHsl(h, s, hsl.luminance);
        
        this._drawLuminanceBar();
        
        this._updateSelectedColorInfo();
    },
    
    _palletMouseCancel: function (ev, elm) {
        if (this._items.colorIndicatorEnableMove) {
            this._palletMouseMove(ev, elm);
            this._items.colorIndicatorEnableMove = false;
        }
    },
    
    _luminanceMouseDown: function (ev, elm) {
        if (this._items.luminanceIndicatorEnableMove) {
            return;
        }
        
        this._items.luminanceIndicatorEnableMove = true;
        
        this._luminanceMouseMove(ev, elm);
    },
    
    _luminanceMouseMove: function (ev, elm) {
        ev.stop();
        
        if ( ! this._items.luminanceIndicatorEnableMove) {
            return;
        }
        
        var lind = this._items.luminanceIndicator;
        var size = this._size;
        var p = ev.getRelativeMousePoint(this._items.luminanceBar);
        var y = p.y - 2;
        
        if (y < 0) {
            y = 0;
        } else if (y > size.height) {
            y = size.height;
        }
        
        lind.style.top = y + 'px';
        
        var hsl = this._color.toHsl();
        var l = 1 - y / size.height;
        
        this._color = Jeeel.Object.Color.createHsl(hsl.hue, hsl.saturation, l);
        
        this._updateSelectedColorInfo();
    },
    
    _luminanceMouseCancel: function (ev, elm) {
        this._items.luminanceIndicatorEnableMove = false;
    },
    
    _mouseCancel: function (ev, elm) {
      
        // カラーテキスト上でのイベントを許可
        if (ev.target.className === this.constructor.CLASS.COLOR_TEXT_DISPLAY) {
            return;
        }
        
        this._palletMouseCancel(ev, elm);
        this._luminanceMouseCancel(ev, elm);
        
        ev.stop();
    },
    
    _changeColorText: function (ev) {
        
        // 貼り付けイベントだった場合は遅延実行させる
        if (ev && ev.type === Jeeel.Dom.Event.Type.PASTE) {
            Jeeel.Deferred.next(this._changeColorText, this);
            return;
        }
        
        var key = ev && ev.getKeyCode();
        
        switch (key) {
            case Jeeel.Code.KeyCode.Up:
            case Jeeel.Code.KeyCode.Down:
            case Jeeel.Code.KeyCode.Left:
            case Jeeel.Code.KeyCode.Right:
            case Jeeel.Code.KeyCode.Home:
            case Jeeel.Code.KeyCode.End:
            case Jeeel.Code.KeyCode.Ctrl:
                return;
                break;
            
            default:
                break;
        }
        
        if (ev && ev.ctrlKey) {
            return;
        }
        
        var ctdText = this._items.colorTextDisplay.value;
        
        if ( ! ctdText.match(/^#[0-9A-F]{6}$/i)) {
            return;
        }
        
        var color = Jeeel.Object.Color.createRgbString(ctdText);
        
        this.setColor(color);
    },
    
    _updateSelectedColorInfo: function () {
        var cd = this._items.colorDisplay;
        var ctd = this._items.colorTextDisplay;
        var ctxt = this._color.toRgb().toString();
        
        cd.style.backgroundColor = ctxt;
        ctd.value = ctxt;
    },
    
    _hslToRgbCss: function (hsl) {
        var rgb = Jeeel.Object.Color.calculateRgb(hsl.h, hsl.s, hsl.l);
        
        rgb = [
            Jeeel.Number.limit(Math.round(rgb.red), 0, 255).toString(16),
            Jeeel.Number.limit(Math.round(rgb.green), 0, 255).toString(16),
            Jeeel.Number.limit(Math.round(rgb.blue), 0, 255).toString(16)
        ];

        for (var i = 3; i--;) {
            if (rgb[i].length < 2) {
                rgb[i] = '0' + rgb[i];
            }
        }
        
        return '#' + rgb.join('');
    },
    
    _updateIndicator: function () {
        var hsl = this._color.toHsl();

        var cindStyle = this._items.colorIndicator.style;
        var lindStyle = this._items.luminanceIndicator.style;
        var lumiStyle = this._items.luminanceBar.style;
        
        lindStyle.top = (parseInt(lumiStyle.height) * (1 - hsl.luminance)) + "px";
        
        cindStyle.left = (this._size.width * hsl.hue / 360) + "px";
        cindStyle.top  = (this._size.height * (1 - hsl.saturation)) + "px";
    },
    
    _drawPallet: function () {
        var el = this._items.colorPallet;
        var img = Jeeel.Document.createElement('img');
        
        img.src = Jeeel.directory.Jeeel.Gui.ColorPicker + 'hue.png';
        img.width = this._size.width;
        img.height = this._size.height;
        img.style.margin = "0px";
        img.style.padding = "0px";
        
        el.appendChild(img);
    },
    
    /**
     * 明度のバーを描画する
     */
    _drawLuminanceBar: function () {
        var el = this._items.luminanceBarBg;

        var hsl = this._color.toHsl();
        var col = {h: hsl.hue, s: 1, l: 0.5};
        
        // BG色を変える
        el.style.backgroundColor = this._hslToRgbCss(col);
    },
    
    _eventStop: function (e) {
        e.stop();
    },
    
    /**
     * 初期化を行う
     */
    _init: function (appendTarget) {
        var index = this.constructor.createLength;
        
        this.constructor.initStyle();

        var p = this._size;

        var colorPicker = Jeeel.Document.createElement('div');
        colorPicker.className = this.constructor.CLASS.COLOR_PICKER;
        colorPicker.id = this.constructor.CLASS.COLOR_PICKER + '-' + index;

        this._colorPicker = colorPicker;
        
        var colorPallet = Jeeel.Document.createElement('div');
        var luminanceBar = Jeeel.Document.createElement('div');
        var header = Jeeel.Document.createElement('div');
        var footer = Jeeel.Document.createElement('div');

        colorPallet.className = this.constructor.CLASS.COLOR_PALLET;
        luminanceBar.className = this.constructor.CLASS.LUMINANCE_BAR;
        header.className = this.constructor.CLASS.HEADER;
        footer.className = this.constructor.CLASS.FOOTER;
        
        this._color = Jeeel.Object.Color.createHsl(180, 0.5, 0.5);
        var borderBothWidth = this.constructor.STYLE.BORDER_WIDTH * 2;
        
        Jeeel.Dom.Element.create(colorPallet).setStyleList({
            width: p.width + 'px',
            height: p.height + 'px',
            top: '0px',
            left: '0px'
        });
        
        Jeeel.Dom.Element.create(luminanceBar).setStyleList({
            width: this.constructor.STYLE.LUMINANCE_BAR_WIDTH + 'px',
            height: p.height + 'px',
            top: '0px',
            left: p.width + this.constructor.STYLE.LUMINANCE_BAR_LEFT_MARGIN + 'px'
        });
        
        var footerWidth = p.width
                        + borderBothWidth
                        + this.constructor.STYLE.LUMINANCE_BAR_LEFT_MARGIN
                        + this.constructor.STYLE.LUMINANCE_BAR_WIDTH
                        + borderBothWidth;
        
        Jeeel.Dom.Element.create(footer).setStyleList({
            width: footerWidth + 'px',
            left: this.constructor.STYLE.COLOR_PICKER_PADDING + 'px',
            top: p.height + this.constructor.STYLE.COLOR_PICKER_PADDING * 2 + borderBothWidth + this.constructor.STYLE.HEADER_HEIGHT + 'px'
        });
        
        var pickerWidth = footerWidth
                        + this.constructor.STYLE.COLOR_PICKER_PADDING
                        + this.constructor.STYLE.COLOR_PICKER_PADDING;
        
        var pickerHeight = p.height
                         + borderBothWidth
                         + this.constructor.STYLE.HEADER_HEIGHT
                         + this.constructor.STYLE.FOOTER_HEIGHT
                         + this.constructor.STYLE.COLOR_PICKER_PADDING * 3;
                      
        Jeeel.Dom.Element.create(colorPicker).setStyleList({
            width: pickerWidth + 'px',
            height: pickerHeight + 'px'
        });
        
        this._items = {
            colorPallet: colorPallet,
            luminanceBar: luminanceBar,
            luminanceBarWrapper: new Jeeel.Dom.Element(luminanceBar)
        };
        
        var title = Jeeel.Document.createElement('span');
        var close = Jeeel.Document.createElement('button');
        
        title.innerHTML = 'Color Picker';
        title.className = this.constructor.CLASS.TITLE;
        close.innerHTML = '&#215;';
        close.className = this.constructor.CLASS.CLOSE_BUTTON;

        header.appendChild(title);
        header.appendChild(close);
        
        var colorDisplay = Jeeel.Document.createElement('input');
        var colorTextDisplay = Jeeel.Document.createElement('input');
        var okButton = Jeeel.Document.createElement('input');
        var closeButton = Jeeel.Document.createElement('input');
        
        colorDisplay.className = this.constructor.CLASS.COLOR_DISPLAY;
        colorTextDisplay.className = this.constructor.CLASS.COLOR_TEXT_DISPLAY;
        okButton.className = this.constructor.CLASS.OK_BUTTON;
        closeButton.className = this.constructor.CLASS.CLOSE_BUTTON;
        
        colorDisplay.type = colorTextDisplay.type = 'text';
        okButton.type = closeButton.type = 'button';
        
        colorDisplay.disabled = true;
        
        colorTextDisplay.maxLength = 7;
        
        var ctxt = this._color.toRgb().toString();
        colorDisplay.style.backgroundColor = ctxt;
        colorTextDisplay.value = ctxt;
        
        okButton.value = ' O K ';
        closeButton.value = 'Close';
        
        footer.appendChild(colorDisplay);
        footer.appendChild(colorTextDisplay);
        footer.appendChild(okButton);
        footer.appendChild(closeButton);
        
        this._items.okButton = okButton;
        this._items.colorDisplay = colorDisplay;
        this._items.colorTextDisplay = colorTextDisplay;
        
        var colorIndicator = Jeeel.Document.createElement('div');
        var luminanceIndicator = Jeeel.Document.createElement('div');
        var luminanceInnerIndicator = Jeeel.Document.createElement('div');
        var luminanceBarImg = Jeeel.Document.createElement('img');
        var luminanceBarBg = Jeeel.Document.createElement('div');
        
        colorIndicator.className = this.constructor.CLASS.COLOR_INDICATOR;
        luminanceIndicator.className = this.constructor.CLASS.LUMINANCE_INDICATOR;
        luminanceBarImg.className = this.constructor.CLASS.LUMINANCE_BAR_FOREGROUND;
        luminanceBarBg.className = this.constructor.CLASS.LUMINANCE_BAR_BACKGROUND;
        
        luminanceIndicator.appendChild(luminanceInnerIndicator);
        
        luminanceBarImg.src = Jeeel.directory.Jeeel.Gui.ColorPicker + 'luminance.png';
        luminanceBarImg.width = this.constructor.STYLE.LUMINANCE_BAR_WIDTH;
        luminanceBarImg.height = this._size.height;
        luminanceBarImg.style.margin = "0px";
        luminanceBarImg.style.padding = "0px";
        
        luminanceBar.appendChild(luminanceIndicator);
        luminanceBar.appendChild(luminanceBarImg);
        luminanceBar.appendChild(luminanceBarBg);
        
        Jeeel.Dom.Element.create(luminanceBarBg).setStyleList({
            width: this.constructor.STYLE.LUMINANCE_BAR_WIDTH + 'px',
            height: p.height + 'px'
        });
        
        var isIEQuirks = !!(Jeeel._doc.uniqueID && Jeeel._doc.compatMode == "BackCompat");
        
        Jeeel.Dom.Element.create(colorIndicator).setStyleList({
            width: isIEQuirks ? "5px" : "3px",
            height: isIEQuirks ? "5px" : "3px"
        });
        
        Jeeel.Dom.Element.create(luminanceIndicator).setStyleList({
            width: this.constructor.STYLE.LUMINANCE_BAR_WIDTH + 'px'
        });
        
        this._items.colorIndicator = colorIndicator;
        this._items.luminanceIndicator = luminanceIndicator;
        this._items.luminanceBarBg = luminanceBarBg;
        
        this._items.colorIndicatorEnableMove = false;
        this._items.luminanceIndicatorEnableMove = false;
        
        Jeeel.Dom.ElementOperator.create(colorTextDisplay)
             .addEvent(Jeeel.Dom.Event.Type.PASTE, this._changeColorText, this)
             .addEvent(Jeeel.Dom.Event.Type.KEY_UP, this._changeColorText, this);
        
        Jeeel.Dom.ElementOperator.create(colorPicker)
             .addEvent(Jeeel.Dom.Event.Type.CLICK, this._eventStop, this)
             .addEvent(Jeeel.Dom.Event.Type.MOUSE_MOVE, this._mouseCancel, this);

        var body = Jeeel.Document.createElement('div');
        
        Jeeel.Dom.Element.create(body).setStyleList({
            width: p.width + borderBothWidth + this.constructor.STYLE.LUMINANCE_BAR_LEFT_MARGIN + this.constructor.STYLE.LUMINANCE_BAR_WIDTH + 'px',
            height: p.height + 'px',
            left: this.constructor.STYLE.COLOR_PICKER_PADDING + this.constructor.STYLE.BORDER_WIDTH + 'px',
            top: this.constructor.STYLE.COLOR_PICKER_PADDING + this.constructor.STYLE.BORDER_WIDTH + this.constructor.STYLE.HEADER_HEIGHT + 'px',
            position: 'absolute',
            overflow: 'hidden',
            padding: '0',
            margin: '0'
        });

        body.appendChild(colorPallet);
        body.appendChild(luminanceBar);
        
        colorPicker.appendChild(header);
        colorPicker.appendChild(body);
        colorPicker.appendChild(footer);
        
        Jeeel.Dom.ElementOperator.create([colorPallet, luminanceBar])
             .delegate(Jeeel.Dom.Event.Type.MOUSE_DOWN, this._mouseDownSwitch, this)
             .delegate(Jeeel.Dom.Event.Type.MOUSE_MOVE, this._mouseMoveSwitch, this)
             .delegate(Jeeel.Dom.Event.Type.MOUSE_UP, this._mouseUpSwitch, this);
        
        Jeeel.Dom.ElementOperator.create([okButton, closeButton, close])
             .delegate(Jeeel.Dom.Event.Type.CLICK, this._selectButtonSwitch, this);
        
        Jeeel.Function.create(this._initFinish).bind(this).delay(15)(appendTarget);

        this.constructor.createLength++;
    },
    
    _initFinish: function (appendTarget) {
        Jeeel.Dom.Element.create(this._colorPicker).hide().setBackgroundIframe();

        this._drawPallet();
        this._drawLuminanceBar();
        this._updateIndicator();

        if (appendTarget) {
            Jeeel.Dom.Element.create(appendTarget).appendChild(this._colorPicker);
        } else {
            Jeeel.Document.appendToBody(this._colorPicker);
        }

        this._items.colorPallet.appendChild(this._items.colorIndicator);
        
        this._styleTag = this.constructor._styleTag;
    }
};

Jeeel.Class.extend(Jeeel.Gui.ColorPicker, Jeeel.Gui.Abstract);
