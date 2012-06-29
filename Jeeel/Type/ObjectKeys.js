
/**
 * @namespace オブジェクトが元々保持しているキーのリストの列挙体
 */
Jeeel.Type.ObjectKeys = {

    /**
     * オブジェクト型のキーリスト
     *
     * @type String[]
     * @constant
     */
    OBJECT: (['toString', 'toLocaleString', 'valueOf', 'constructor', 'hasOwnProperty', 'propertyIsEnumerable', 'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__']).concat(({}).__proto__ ? ['__proto__'] : []),

    /**
     * オブジェクトのprototype型を示す
     *
     * @type String[]
     * @constant
     */
    PROTOTYPE: ['toString', 'toLocaleString', 'valueOf', 'constructor', 'hasOwnProperty', 'propertyIsEnumerable', 'isPrototypeOf', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'],

    /**
     * Function型のキーリスト
     *
     * @type String[]
     * @constant
     */
    FUNCTION: ['arguments', 'caller', 'length', 'name', 'prototype', 'call', 'apply', 'bind'],

    /**
     * Array型のキーリスト
     *
     * @type String[]
     * @constant
     */
    ARRAY: ['length', 'concat', 'join', 'shift', 'unshift', 'push', 'pop', 'splice', 'slice', 'sort', 'reverse', 'indexOf', 'lastIndexOf', 'every', 'some', 'forEach', 'map', 'filter', 'reduce', 'reduceRight'],

    /**
     * Arguments型のキーリスト
     *
     * @type String[]
     * @constant
     */
    ARGUMENTS: ['length', 'callee'],

    /**
     * Boolean型のキーリスト
     *
     * @type String[]
     * @constant
     */
    BOOLEAN: [],

    /**
     * String型のキーリスト
     *
     * @type String[]
     * @constant
     */
    STRING: ['length', 'charAt', 'substring', 'substr', 'slice', 'split', 'concat', 'replace', 'toUpperCase', 'toLowerCase', 'indexOf', 'lastIndexOf', 'match', 'search', 'charCodeAt', 'bold', 'italics', 'fixed', 'big', 'small', 'blink', 'strike', 'sup', 'sub', 'fontcolor', 'fontsize', 'anchor', 'link'],

    /**
     * RegExp型のキーリスト
     *
     * @type String[]
     * @constant
     */
    REGULAR_EXPRESSION: ['ignoreCase', 'global', 'source', 'exec', 'test', 'compile', 'lastIndex'],

    /**
     * Date型のキーリスト
     *
     * @type String[]
     * @constant
     */
    DATE: ['getFullYear', 'getYear', 'getMonth', 'getDate', 'getDay', 'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds', 'setFullYear', 'setYear', 'setMonth', 'setDate', 'setHours', 'setMinutes', 'setSeconds', 'setMilliseconds', 'getUTCFullYear', 'getUTCYear', 'getUTCMonth', 'getUTCDate', 'getUTCDay', 'getUTCHours', 'getUTCMinutes', 'getUTCSeconds', 'getUTCMilliseconds', 'setUTCFullYear', 'setUTCYear', 'setUTCMonth', 'setUTCDate', 'setUTCHours', 'setUTCMinutes', 'setUTCSeconds', 'setUTCMilliseconds', 'getTime', 'setTime', 'toGMTString', 'toUTCString', 'toLocaleString', 'toString'],

    /**
     * Number型のキーリスト
     *
     * @type String[]
     * @constant
     */
    NUMBER: ['toString', 'toPrecision', 'toFixed', 'toExponential'],

    /**
     * Element型のキーリスト
     *
     * @type String[]
     * @constant
     */
    ELEMENT: ['name', 'id', 'className', 'tagName', 'nodeName', 'nodeType', 'firstChild', 'lastChild', 'nextSibling', 'previousSibling', 'parentNode', 'children', 'childNodes', 'hasChildNodes', 'getElementsByClassName', 'getElementsByTagName', 'querySelectorAll', 'querySelector', 'style', 'appendChild', 'removeChild', 'replaceChild', 'insertBefore', 'setAttribute', 'getAttribute', 'removeAttribute', 'blur', 'focus', 'cloneNode', 'tabIndex', 'innerHTML', 'onabort', 'onbeforecopy', 'onbeforecut', 'onbeforepaste', 'onbeforeunload', 'onblur', 'onchange', 'onclick', 'oncontextmenu', 'oncopy', 'oncut', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onerror', 'onfocus', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmessage', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpaste', 'onpopstate', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onselect', 'onselectstart', 'onstorage', 'onsubmit', 'onunload'],

    /**
     * Attribute型のキーリスト
     *
     * @type String[]
     * @constant
     */
    ATTRIBUTE: ['name', 'value', 'childNodes', 'firstChild', 'lastChild', 'nodeName', 'nodeType'],
    
    /**
     * Text型のキーリスト
     *
     * @type String[]
     * @constant
     */
    TEXT: ['nodeName', 'nodeType', 'data'],

    /**
     * Comment型のキーリスト
     *
     * @type String[]
     * @constant
     */
    COMMENT: ['nodeName', 'nodeType', 'data'],

    /**
     * DocumentFragment型のキーリスト
     *
     * @type String[]
     * @constant
     */
    DOCUMENT_FRAGMENT: ['nodeName', 'nodeType', 'childNodes', 'appendChild', 'removeChild', 'firstChild', 'lastChild'],

    /**
     * Document型のキーリスト
     *
     * @type String[]
     * @constant
     */
    DOCUMENT: ['nodeType', 'getElementById', 'getElementsByClassName', 'querySelectorAll', 'querySelector', 'getElementsByName', 'getElementsByTagName', 'documentElement', 'body', 'childNodes', 'write', 'writeln', 'open', 'close', 'cookie', 'createElement', 'createTextNode', 'createDocumentFragment', 'createComment', 'createAttribute'],

    /**
     * Window型のキーリスト
     *
     * @type String[]
     * @constant
     */
    WINDOW: ['Object', 'Number', 'String', 'Boolean', 'Array', 'RegExp', 'Date', 'JSON', 'document', 'location', 'navigator', 'name', 'parent', 'self', 'postMessage', 'setTimeout', 'setInterval', 'alert', 'prompt', 'confirm', 'open', 'close', 'closed', 'showModalDialog'],

    /**
     * Event型のキーリスト
     *
     * @type String[]
     * @constant
     */
    EVENT: ['type'],

    /**
     * Error型のキーリスト
     *
     * @type String[]
     * @constant
     */
    ERROR: ['name', 'message', 'stack', 'toString'],
    
    /**
     * Math型のキーリスト
     *
     * @type String[]
     * @constant
     */
    MATH: ['PI', 'SQRT2', 'SQRT1_2', 'E', 'LN10', 'LN2', 'LOG10E', 'LOG2E', 'abs', 'max', 'min', 'ceil', 'floor', 'random', 'pow', 'exp', 'log', 'sqrt', 'sin', 'cos', 'tan', 'acos', 'asin', 'atan', 'atan2'],

    /**
     * JSON型のキーリスト
     *
     * @type String[]
     * @constant
     */
    JSON: ['parse', 'stringify'],
    
    /**
     * Storage型のキーリスト
     *
     * @type String[]
     * @constant
     */
    STORAGE: ['length', 'key', 'getItem', 'setItem', 'removeItem', 'clear']
};
