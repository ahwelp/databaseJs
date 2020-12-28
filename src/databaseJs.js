(function($){

    var inited = false;

    //Table draging variables
    var dragging = false;
    var dragStep = 20;
    var startOffsetX = 0;
    var startOffsetY = 0;
    var dragElement = null;

    //Conection variables
    var pointDragging = false;
    var pointInDrag = null;

	var types = [
        { 'name' : 'serial' },
        { 'name' : 'numeric' },
        { 'name' : 'char' },
        { 'name' : 'varchar' },
        { 'name' : 'date' },
        { 'name' : 'datetime' }
    ]

    //Prototype helper definition
    var DatabaseJs = {};

    /* 
     * DatabaseJs.createConnection 
     * 
     *
    */
    DatabaseJs.createConnection = function(originTable, targetTable, targetField, originField ){
        var svg = this.createSVG(originTable, targetTable, originField, targetField)
        this.recalculateSVG(svg);
        this.createDots(originTable, targetTable, svg)
        this.recalculatePaths(svg) 
    }

    /*
     * DatabaseJs.cloneField 
     *
     *
     */
    DatabaseJs.cloneField = function(originTable, originField, targetTable, targetField){

    }

    /*
     * DatabaseJs.createSVG 
     *
     *
     */
    DatabaseJs.createSVG = function(element1, element2, originField, targetField){
        var dataFields = "";
        dataFields += "data-origintable='"+$(element1).attr('id')+"'";
        dataFields += "data-targettable='"+$(element2).attr('id')+"'";
        dataFields += "data-originfield='"+originField+"'";
        dataFields += "data-targetfield='"+targetField+"'";

        var svg = "<svg "+dataFields+" > <g class='lines'></g> <g class='dots'></g> </svg>";
        $(this.canvas).html( $(this.canvas).html() + svg );
        return $('[data-origintable="'+$(element1).attr('id')+'"][data-targettable="'+$(element2).attr('id')+'"][data-originfield="'+originField+'"][data-targetfield="'+targetField+'"]');
    }

    /*
     * DatabaseJs.calculateSVGSize 
     *
     *
     */
    DatabaseJs.calculateSVGSize = function(element1, element2){
        var rel = null; // Right element
        var lel = null; // Left element
        if( $(element1).position().left + $(element1).width() > $(element2).position().left + $(element2).width() ){
            rel = element1; 
        }else{
            rel = element2;
        }
        if( $(element1).position().left < $(element2).position().left ){
            lel = element1; 
        }else{
            lel = element2; 
        }

        var tel = null; // Top element
        var bel = null; // Bottom element
        if($(element1).position().top < $(element2).position().top ){
            tel = element1;
        }else{
            tel = element2;
        }

        if( $(element1).position().top + $(element1).height() > $(element2).position().top + $(element2).height() ){
            bel = element1;
        }else{
            bel = element2;
        }

        return {
            "width" : $(rel).position().left + $(rel).width() ,
            "height" : $(bel).position().top + $(bel).height(),
            "left" : $(lel).position().left,
            "top" : $(tel).position().top,
        };
    }
 
    /*
     * DatabaseJs.recalculateSVG 
     *
     *
     */
    DatabaseJs.recalculateSVG = function(svg){
        var element1 = $('#'+$(svg).data('origintable') )
        var element2 = $('#'+$(svg).data('targettable') )
        var dimensions = DatabaseJs.calculateSVGSize(element1, element2);

        $(svg).attr('width', dimensions.width );
        $(svg).attr('height', dimensions.height );

        $(svg).css('top', dimensions.top );
        $(svg).css('left', dimensions.left );
        $(svg).css('position', 'absolute');
    }
    
    /*
     * DatabaseJs.createDots 
     *
     * ## Todo
     *
     */
    DatabaseJs.createDots = function( element1, element2, svg, dots = null ){
        //Somehow, this stoped working, so search elements by id. No sense, but it needs
        element1 = $('#'+$(element1).attr('id'));
        element2 = $('#'+$(element2).attr('id'));

        var x1 = ( $(element1).position().left + $(element1).width() / 2) - parseFloat( $(svg).css('left').replace('px', '') ) 
        var y1 = ( $(element1).position().top  + $(element1).height() / 2) - parseFloat( $(svg).css('top').replace('px', '') )

        var x2 = ( $(element2).position().left + $(element2).width() / 2 ) - parseFloat( $(svg).css('left').replace('px', '') )
        var y2 = ( $(element2).position().top  + $(element2).height() / 2 ) - parseFloat( $(svg).css('top').replace('px', '') )

        var offsetTop = $(element1).height() / 2;
        var offsetLeft = $(element1).width() / 2;

        var points = "";
        points += "<circle class='origin' cx='"+x1+"' cy='"+y1+"' r='3' data-table='"+$(element1).attr('id')+"' />";
        if(dots == null){
            points += "<circle cx='"+(Math.abs(x1-x2) - offsetLeft)+"' cy='"+( Math.abs(y1-y2) + offsetTop )+"' r='3' />";
        }else{
            for(i in dots){
                points += "<circle cx='"+dots[i].x+"' cy='"+dots[i].y+"' r='3' />";
            }
        }
        points += "<circle class='origin' cx='"+x2+"' cy='"+y2+"' r='3' data-table='"+$(element2).attr('id')+"' />";
        $(svg).find('.dots').html(points);
    }


    /*
     * DatabaseJs.createDots 
     *
     *
     */
    DatabaseJs.recalculateDots = function(dot, svg){
        var table = $('#'+$(dot).data('table'));
        
        var top = parseFloat( $(svg).css('top').replace('px', '') )
        var left = parseFloat( $(svg).css('left').replace('px', '') )

        $(dot).attr('cx', ( $(table).position().left + $(table).width() / 2) - left );
        $(dot).attr('cy',  ( $(table).position().top  + $(table).height() / 2) - top );

        DatabaseJs.recalculatePaths(svg);
    }

    /*
     * DatabaseJs.createPath 
     *
     *
     */
    DatabaseJs.createPath = function(element1, element2, fieldName) {
        var svg = createSVG(element1, element2, 'id', fieldName)
        this.recalculateSVG(svg);
        this.createDots(element1, element2, svg)
        this.recalculatePaths(svg) 
    }

    /*
     * DatabaseJs.recalculatePaths 
     *
     *
     */
    DatabaseJs.recalculatePaths = function(svg){
        var lines = '';
        var oldElement = null;
        $(svg).find('circle').each(function(i, el){
            if(oldElement == null){ oldElement = el; return;  }
            var x1 = $(oldElement).attr('cx') //- parseFloat( $(svg).css('left').replace('px', '') ) 
            var y1 = $(oldElement).attr('cy') //- parseFloat( $(svg).css('top').replace('px', '') )
            var x2 = $(el).attr('cx') - $(oldElement).attr('cx') //- $(svg).css('left').replace('px', '') 
            var y2 = $(el).attr('cy') - $(oldElement).attr('cy') // -$(svg).css('top').replace('px', '')  
            lines += "<path d='M "+x1+" "+y1+" l "+x2+" "+y2+"' stroke-width='3' />"
            oldElement = el;
        }); 
        $(svg).find('.lines').html(lines);
    }


    //
    // _____     _     _        _____      _ _   _       _   _             
    //|_   _|   | |   | |      |_   _|    (_) | (_)     | | (_)            
    //  | | __ _| |__ | | ___    | | _ __  _| |_ _  __ _| |_ _  ___  _ __  
    //  | |/ _` | '_ \| |/ _ \   | || '_ \| | __| |/ _` | __| |/ _ \| '_ \ 
    //  | | (_| | |_) | |  __/  _| || | | | | |_| | (_| | |_| | (_) | | | |
    //  \_/\__,_|_.__/|_|\___|  \___/_| |_|_|\__|_|\__,_|\__|_|\___/|_| |_|
    // 

    /*
     * DatabaseJs.buildTables 
     *
     */
    DatabaseJs.buildTables = function(){
        var tables = "";
        for(i in data.tables){
            var table = data.tables[i];
            tables += "<ul id='"+table.name+"' class='list-group db-table' style='left:"+table.left+"px; top:"+table.top+"px'>";
            tables += "<li class='list-group-item active'>"+table.name+"</li>";
            tables += DatabaseJs.buildFields(table.fields);
            tables += "</ul>";
        }
        for(i in data.relations){
            tables += DatabaseJs.buildConnection(data.relations[i]);
        }
        $( DatabaseJs.canvas ).html(tables);
    }

    /*
     * DatabaseJs.buildFields 
     *
     */
    DatabaseJs.buildFields = function(fields){
        var ret = "";
        for(j in fields){
            var field = fields[j];
            ret+= "<li data-field='"+field.name+"' class='list-group-item db-row'> <label>*</label> "+field.name + DatabaseJs.buildSelect(field.type)+"</li>"
        }
        return ret;
    }
   
    /*
     * DatabaseJs.buildSelect 
     *
     *
     */
    DatabaseJs.buildSelect = function(selected){
        var select = '<div class="datatype"><select>';
        for(i in types){
            if(types[i].name == selected){
                select += "<option value='"+types[i].name+"' selected>"+types[i].name+"</option>"
            }else{
                select += "<option value='"+types[i].name+"'>"+types[i].name+"</option>"
            }
        }
        return select + '</select></div>';
    }

    /*
     * DatabaseJs.buildConnection 
     *
     */
    DatabaseJs.buildConnection = function(connection){
        console.log(connection)
    }

    /*
     * DatabaseJs.exportContent 
     *
     *
     */
    DatabaseJs.exportContent = function(){
        var tables = {'tables' : [] };
        $('.canvas ul').each(function (i, el){
            var table = {};
            table.name = $(el).attr('id');
            table.left = parseFloat( $(el).css('left').replace('px', '') )
            table.top  = parseFloat( $(el).css('top').replace('px', '') ) 
            $(el).find('li').each(function(j, inel){

            });
            tables.tables.push(table)
        });
    }

    /*
     * Starts Here
     *
     */
    $.fn.databaseJs = function(action = null, originTable = null, targetTable = null, targetField = null, originField = 'id'){

        //Init content
        if(action != null){
            switch (action){
                case 'createConnection':
                    DatabaseJs.cloneField(originTable, originField, targetTable, targetField);
                    DatabaseJs.createConnection(originTable, targetTable, targetField, originField);
                    break;
                case 'export' :
                    DatabaseJs.exportContent()
                    break;
                case 'buildModel':
                    DatabaseJs.buildTables(originTable)
            }
        }

        if(inited){
            return;
        }

        inited = true;

        DatabaseJs.canvas = this;

        $(this).on('mousedown', 'ul > li:first-of-type', function(e){
            e.preventDefault();
            dragging = true;
            dragElement = e.currentTarget;
        });

        $(this).on('mousemove', function(e){
            if(dragging){
                var newx = e.currentTarget.scrollLeft + e.originalEvent.clientX; 
                var newy = e.currentTarget.scrollTop + e.originalEvent.clientY;
                var moved = false;

                if( newx - startOffsetX > dragStep || Math.abs(startOffsetX - newx) > dragStep ){
                    startOffsetX = newx; 
                    $(dragElement).parent().css('left', newx ).trigger('move');
                    moved = true;
                }
                if( newy - startOffsetY > dragStep || Math.abs(startOffsetY - newy) > dragStep ){
                    startOffsetY = newy; 
                    $(dragElement).parent().css('top', newy ).trigger('move'); 
                    moved = true;
                }

                if(moved){
                    $('svg .origin').each(function(){
                        DatabaseJs.recalculateDots(this, $(this).parent().parent());
                    })
                }
            }

            if(pointDragging){ //SVG
                $(pointInDrag).attr('cx', e.originalEvent.clientX - $(pointInDrag).parent().parent().position().left );
                $(pointInDrag).attr('cy', e.originalEvent.clientY - $(pointInDrag).parent().parent().position().top );
                $(pointInDrag).parent().parent().trigger('change');
                DatabaseJs.recalculatePaths($(pointInDrag).parent().parent() );
            }
        });

        $('html').on('mouseup', function(e){
            e.preventDefault();
            dragElement = null; 
            dragging = false;
            pointInDrag = null; //SVG
            pointDragging = false; //SVG
        });

        //Connection scripts
        //########################################################
        $(this).on('mousedown', 'circle:not(.origin)', function(){
            pointInDrag = $(this);
            pointDragging = true;
        });

        // Table element moving. Search and move child dots
        $(this).on('move', 'ul', function() {
            var table = '[data-table="'+$(this).attr('id')+'"]';
            var element = $('svg g ' + table );

            var svg = $(element).parent().parent();

            if( svg.length == 0 ){ return; }

            var top = parseFloat( $(svg).css('top').replace('px', '') )
            var left = parseFloat( $(svg).css('left').replace('px', '') )

            var x = ( $(this).position().left + $(this).width() / 2) - left;
            var y = ( $(this).position().top  + $(this).height() / 2) - top;

            $(element).attr('cx', ( $(this).position().left + $(this).width() / 2) - left );
            $(element).attr('cy',  ( $(this).position().top  + $(this).height() / 2) - top );

            DatabaseJs.recalculateSVG(svg);
            DatabaseJs.recalculatePaths(svg);
        });

    }

})(jQuery);
