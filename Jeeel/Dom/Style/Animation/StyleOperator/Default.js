/**
 * カスタムスタイルの初期登録を行う
 */
(function () {
  
    if ( ! Jeeel._elm) {
        return;
    }
    
    var elmStyle = Jeeel._elm.cloneNode(false).style;
    
    var limit = Jeeel.Number.limit;
    var operators = [], i = 0, operator, filter, unfilter;
    
    elmStyle.cssText = 'color: rgba(255, 255, 255, 1);';
    
    // colorの登録
    operators[i] = {name: 'color'};
    
    // rgba形式に対応しているかどうかで振り分ける
    if (elmStyle.color) {
      
        /**
         * @ignore
         */
        filter = function (val) {
            var color = new Jeeel.Object.Color.Rgb(val);
            return [
                color.red,
                color.green,
                color.blue,
                color.alpha
            ];
        };

        /**
         * @ignore
         */
        unfilter = function (val) {
            return 'rgba(' 
                + limit(Math.floor(val[0]), 0, 255) + ','
                + limit(Math.floor(val[1]), 0, 255) + ','
                + limit(Math.floor(val[2]), 0, 255) + ','
                + limit(val[3], 0, 1) + ')';
        };
    } else {
        
        /**
         * @ignore
         */
        filter = function (val) {
            var color = new Jeeel.Object.Color.Rgb(val);
            return [
                color.red,
                color.green,
                color.blue
            ];
        };

        /**
         * @ignore
         */
        unfilter = function (val) {
            return 'rgb(' 
                + limit(Math.floor(val[0]), 0, 255) + ','
                + limit(Math.floor(val[1]), 0, 255) + ','
                + limit(Math.floor(val[2]), 0, 255) + ')';
        };
    }

    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    
    // background-colorの登録
    operators[i] = {name: 'backgroundColor'};
    
    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    
    // border-colorの登録
    operators[i] = {name: 'borderColor'};
    
    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    
    // border-top-colorの登録
    operators[i] = {name: 'borderTopColor'};
    
    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    
    // border-right-colorの登録
    operators[i] = {name: 'borderRightColor'};
    
    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    
    // border-bottom-colorの登録
    operators[i] = {name: 'borderBottomColor'};
    
    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    
    // border-left-colorの登録
    operators[i] = {name: 'borderLeftColor'};
    
    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    
    // outline-colorの登録
    operators[i] = {name: 'outlineColor'};
    
    operators[i].filter = filter;
    operators[i].unfilter = unfilter;
    
    i++;
    
    for (i = operators.length; i--;) {
        operator = Jeeel.Dom.Style.Animation.StyleOperator.createOperator(operators[i].name, operators[i].filter, operators[i].unfilter);
        
        Jeeel.Dom.Style.Animation.StyleOperator.register(operator);
    }
    
})();