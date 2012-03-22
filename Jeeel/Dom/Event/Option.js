
/**
 * コンストラクタ
 * 
 * @class イベントの作成時のパラメータを管理するクラス
 */
Jeeel.Dom.Event.Option = function () {
    this._touches = [];
    this._targetTouches = [];
    this._changedTouches = [];
};

/**
 * インスタンスの作成を行う
 * 
 * @return {Jeeel.Dom.Event.Option} 作成したインスタンス
 */
Jeeel.Dom.Event.Option.create = function () {
    return new this();
};

Jeeel.Dom.Event.Option.prototype = {
    _canBubble: true,
    _cancelable: true, 
    _viewArg: null, 
    _ctrlKeyArg: false, 
    _altKeyArg: false, 
    _shiftKeyArg: false, 
    _metaKeyArg: false, 
    _keyCodeArg: 0, 
    _charCodeArg: 0,
    _detail: 1,
    _screenX: 0,
    _screenY: 0,
    _clientX: 0,
    _clientY: 0,
    _button: 0,
    _relatedTarget: null,
    _touches: [],
    _targetTouches: [],
    _changedTouches: [],
    _scale: 1.0,
    _rotation: 0,
    _dataTransfer: null,
    
    setCanBubble: function (canBubble) {
        this._canBubble = !!canBubble;
        
        return this;
    },
    
    setCancelable: function (cancelable) {
        this._cancelable = !!cancelable;
        
        return this;
    },
    
    setViewArg: function (viewArg) {
        this._viewArg = viewArg;
        
        return this;
    },
    
    setCtrlKeyArg: function (ctrlKeyArg) {
        this._ctrlKeyArg = !!ctrlKeyArg;
        
        return this;
    },
    
    setAltKeyArg: function (altKeyArg) {
        this._altKeyArg = !!altKeyArg;
        
        return this;
    },
    
    setShiftKeyArg: function (shiftKeyArg) {
        this._shiftKeyArg = !!shiftKeyArg;
        
        return this;
    },
    
    setMetaKeyArg: function (metaKeyArg) {
        this._metaKeyArg = !!metaKeyArg;
        
        return this;
    },
    
    setKeyCodeArg: function (keyCodeArg) {
        this._keyCodeArg = +keyCodeArg;
        
        return this;
    },
    
    setCharCodeArg: function (charCodeArg) {
        this._charCodeArg = +charCodeArg;
        
        return this;
    },
    
    setDetail: function (detail) {
        this._detail = +detail;
        
        return this;
    },
    
    setScreen: function (x, y) {
        this._screenX = +x;
        this._screenY = +y;
        
        return this;
    },
    
    setClient: function (x, y) {
        this._clientX = +x;
        this._clientY = +y;
        
        return this;
    },
    
    setButton: function (button) {
        this._button = +button;
        
        return this;
    },
    
    setRelatedTarget: function (relatedTarget) {
        this._relatedTarget = relatedTarget;
        
        return this;
    },
    
    setTouches: function (touches) {
        this._touches = touches;
        
        return this;
    },
    
    setTargetTouches: function (targetTouches) {
        this._targetTouches = targetTouches;
        
        return this;
    },
    
    setChangedTouches: function (changedTouches) {
        this._changedTouches = changedTouches;
        
        return this;
    },
    
    setScale: function (scale) {
        this._scale = +scale;

        return this;
    },
    
    setRotation: function (rotation) {
        this._rotation = +rotation;
        
        return this;
    },
    
    setDataTransfer: function (dataTransfer) {
        this._dataTransfer = dataTransfer;
        
        return this;
    },
    
    getEventOption: function (type) {
        return [
            type,
            this._canBubble,
            this._cancelable
        ];
    },
    
    getMouseEventOption: function (type, view) {
        return [
            type,
            this._canBubble,
            this._cancelable,
            this._viewArg || view,
            this._detail,
            this._screenX,
            this._screenY,
            this._clientX,
            this._clientY,
            this._ctrlKeyArg,
            this._altKeyArg,
            this._shiftKeyArg,
            this._metaKeyArg,
            this._button,
            this._relatedTarget
        ];
    },
    
    getDragEventOption: function (type, view) {
        return [
            type,
            this._canBubble,
            this._cancelable,
            this._viewArg || view,
            this._detail,
            this._screenX,
            this._screenY,
            this._clientX,
            this._clientY,
            this._ctrlKeyArg,
            this._altKeyArg,
            this._shiftKeyArg,
            this._metaKeyArg,
            this._button,
            this._relatedTarget,
            this._dataTransfer
        ];
    },
    
    getKeyboardEventOption: function (type, view) {
        return [
            type,
            this._canBubble,
            this._cancelable,
            this._viewArg || view,
            this._ctrlKeyArg,
            this._altKeyArg,
            this._shiftKeyArg,
            this._metaKeyArg,
            this._keyCodeArg,
            this._charCodeArg
        ];
    },
    
    getTouchEventOption: function (type, view) {
        return [
            type,
            this._canBubble,
            this._cancelable,
            this._viewArg || view,
            this._detail,
            this._screenX,
            this._screenY,
            this._clientX,
            this._clientY,
            this._ctrlKeyArg,
            this._altKeyArg,
            this._shiftKeyArg,
            this._metaKeyArg,
            this._touches,
            this._targetTouches,
            this._changedTouches,
            this._scale,
            this._rotation
        ];
    },
    
    getUIEventOption: function (type, view) {
        return [
            type,
            this._canBubble,
            this._cancelable,
            this._viewArg || view,
            this._detail
        ];
    },
    
    initEvent: function (event, type) {
        if (event.initEvent) {
            event.initEvent.apply(event, this.getEventOption(type));
            return event;
        }
        
        event.type = type;
        event.cancelBubble = this._canBubble;
        
        return event;
    },
    
    initMouseEvent: function (event, type, view) {
        if (event.initMouseEvent) {
            event.initMouseEvent.apply(event, this.getMouseEventOption(type, view));
            return event;
        }
        
        this.initEvent(event, type);
        
        event.screenX = this._screenX;
        event.screenY = this._screenY;
        event.clientX = this._clientX;
        event.clientY = this._clientY;
        event.ctrlKey = this._ctrlKeyArg;
        event.altKey = this._altKeyArg;
        event.shiftKey = this._shiftKeyArg;
        event.metaKey = this._metaKeyArg;
        event.button = this._button;
        event.relatedTarget = this._relatedTarget;
        
        return event;
    },
    
    initDragEvent: function (event, type, view) {
        if (event.initDragEvent) {
            event.initDragEvent.apply(event, this.getDragEventOption(type, view));
            return event;
        } else if (event.initMouseEvent) {
            event.initMouseEvent.apply(event, this.getDragEventOption(type, view));
            return event;
        }
        
        this.initEvent(event, type);
        
        event.screenX = this._screenX;
        event.screenY = this._screenY;
        event.clientX = this._clientX;
        event.clientY = this._clientY;
        event.ctrlKey = this._ctrlKeyArg;
        event.altKey = this._altKeyArg;
        event.shiftKey = this._shiftKeyArg;
        event.metaKey = this._metaKeyArg;
        event.button = this._button;
        event.relatedTarget = this._relatedTarget;
        event.dataTransfer = this._dataTransfer;
        
        return event;
    },
    
    initKeyboardEvent: function (event, type, view) {
        if (event.initKeyboardEvent) {
            event.initKeyboardEvent.apply(event, this.getKeyboardEventOption(type, view));
            return event;
        }
        
        this.initEvent(event, type);
        
        event.ctrlKey = this._ctrlKeyArg;
        event.altKey = this._altKeyArg;
        event.shiftKey = this._shiftKeyArg;
        event.metaKey = this._metaKeyArg;
        event.keyCode = this._keyCodeArg;
        event.charCode = this._charCodeArg;
        
        return event;
    },
    
    initTouchEvent: function (event, type, view) {
        if (event.initTouchEvent) {
            event.initTouchEvent.apply(event, this.getTouchEventOption(type, view));
            return event;
        }
        
        this.initEvent(event, type);
        
        event.screenX = this._screenX;
        event.screenY = this._screenY;
        event.clientX = this._clientX;
        event.clientY = this._clientY;
        event.ctrlKey = this._ctrlKeyArg;
        event.altKey = this._altKeyArg;
        event.shiftKey = this._shiftKeyArg;
        event.metaKey = this._metaKeyArg;
        event.touches = this._touches;
        event.targetTouches = this._targetTouches;
        event.changedTouches = this._changedTouches;
        event.scale = this._scale;
        event.rotation = this._rotation;
        
        return event;
    },
    
    initUIEvent: function (event, type, view) {
        if (event.initUIEvent) {
            event.initUIEvent.apply(event, this.getUIEventOption(type, view));
            return event;
        }
        
        this.initEvent(event, type);
        
        event.screenX = this._screenX;
        event.screenY = this._screenY;
        event.clientX = this._clientX;
        event.clientY = this._clientY;
        event.ctrlKey = this._ctrlKeyArg;
        event.shiftKey = this._shiftKeyArg;
        event.altKey = this._altKeyArg;
        
        return event;
    }
};
