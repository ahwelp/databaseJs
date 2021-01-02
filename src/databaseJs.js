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
     * DatabaseJs.buildSVG 
     *
     *
     */

    DatabaseJs.buildSVG = function(element1, element2, originField, targetField){
        var dataFields = "";
        dataFields += "data-origintable='"+$(element1).attr('id')+"'";
        dataFields += "data-targettable='"+$(element2).attr('id')+"'";
        dataFields += "data-originfield='"+originField+"'";
        dataFields += "data-targetfield='"+targetField+"'";

        return "<svg "+dataFields+"> <g class='lines'></g> <g class='dots'></g> </svg>";
    }

    /*
     * DatabaseJs.createSVG 
     *
     *
     */
    DatabaseJs.createSVG = function(element1, element2, originField, targetField){
        var svg = DatabaseJs.buildSVG(element1, element2, originField, targetField);
        $(this.canvas).html( $(this.canvas).html() + svg );
        return DatabaseJs.getSVG(element1, element2, originField, targetField) 
    }

    /*
     * DatabaseJs.getSVG 
     *
     */
    DatabaseJs.getSVG = function(element1, element2, originField, targetField){
        return $('[data-origintable="'+$(element1).attr('id')+'"][data-targettable="'+$(element2).attr('id')+'"][data-originfield="'+originField+'"][data-targetfield="'+targetField+'"]');
    };
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
            "left" : parseFloat( $(lel).css('left').replace('px', '')),
            "top" : parseFloat( $(tel).css('top').replace('px', '')),
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

        var x1 = ( parseFloat( $(element1).css('left').replace('px', '')) + $(element1).width() / 2) - parseFloat( $(svg).css('left').replace('px', '') ) 
        var y1 = ( parseFloat( $(element1).css('top').replace('px', ''))  + $(element1).height() / 2) - parseFloat( $(svg).css('top').replace('px', '') )

        var x2 = ( parseFloat( $(element2).css('left').replace('px', '')) + $(element2).width() / 2) - parseFloat( $(svg).css('left').replace('px', '') ) 
        var y2 = ( parseFloat( $(element2).css('top').replace('px', ''))  + $(element2).height() / 2) - parseFloat( $(svg).css('top').replace('px', '') )

        var offsetTop = $(element1).height() / 2;
        var offsetLeft = $(element1).width() / 2;

        var points = "";
        points += "<circle class='origin' cx='"+x1+"' cy='"+y1+"' r='3' data-table='"+$(element1).attr('id')+"' />";
        if(dots == null || dots == []){
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
     * DatabaseJs.createDot
     *
     *
     */
    DatabaseJs.recalculateDot = function(dot, svg){
        var table = $('#'+$(dot).data('table'));
        
        var x = ( parseFloat( $(table).css('left').replace('px', '')) + $(table).width() / 2) - parseFloat( $(svg).css('left').replace('px', '') ) 
        var y = ( parseFloat( $(table).css('top').replace('px', ''))  + $(table).height() / 2) - parseFloat( $(svg).css('top').replace('px', '') )

        $(dot).attr('cx', x );
        $(dot).attr('cy', y );

        DatabaseJs.recalculatePaths(svg);
    }

    /*
     * DatabaseJs.createDots
     *
     *
     */
    DatabaseJs.recalculateDots = function(svg){
        $(svg).find('.origin').each(function(i, el){
            DatabaseJs.recalculateDot(el, svg);
        });
        
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
    
    /*
     * DatabaseJs.refresh 
     *
     *
     */
    DatabaseJs.refresh = function(){
        $( DatabaseJs.canvas ).find('svg').each(function(){
            DatabaseJs.recalculatePaths(this);
        });
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
     *
     */
    DatabaseJs.buildTables = function(){
        for(i in data.tables){
            var options = '<div style="float: right;">';
            options += "<span class='add_field'>+</span> ";
            options += "<span class='table_collapse'>^</span>";
            options += '</div>';

            var table = data.tables[i];
            var content = '';
            content += "<ul id='"+table.name+"' class='list-group db-table' style='left:"+table.left+"px; top:"+table.top+"px'>";
            content += "<li class='list-group-item active'>"+table.name+options+"</li>";
            content += DatabaseJs.buildFields(table.fields);
            content += "</ul>";

            $( DatabaseJs.canvas).html( $( DatabaseJs.canvas ).html() + content );
        }

        for(i in data.constraints){
            $( DatabaseJs.canvas).html( $( DatabaseJs.canvas ).html() + 
                DatabaseJs.buildSVG(
                    $('#'+data.constraints[i].origin.table),
                    $('#'+data.constraints[i].target.table),
                    data.constraints[i].origin.field,
                    data.constraints[i].target.field,
                )
            );
            var svg = DatabaseJs.getSVG(
                $('#'+data.constraints[i].origin.table),
                $('#'+data.constraints[i].target.table),
                data.constraints[i].origin.field,
                data.constraints[i].target.field,
            );
            DatabaseJs.recalculateSVG(svg);
            // DatabaseJs.createDots = function( element1, element2, svg, dots = null ){
            DatabaseJs.createDots(
                $('#'+data.constraints[i].origin.table),
                $('#'+data.constraints[i].target.table),
                svg,
                data.constraints[i].dots
            );
            DatabaseJs.refresh();
        }

    }

    /*
     * DatabaseJs.buildField
     *
     *
     */
    DatabaseJs.buildField = function(field){
        return "<li data-field='"+field.name+"' class='list-group-item db-row'> <label>*</label> <span class='field_name'>"+field.name + "</span>" + DatabaseJs.buildSelect(field.type)+"</li>"
    }


    /*
     * DatabaseJs.buildFields 
     *
     *
     */
    DatabaseJs.buildFields = function(fields){
        var ret = "";
        for(j in fields){
            ret+= DatabaseJs.buildField(fields[j]);
        }
        return ret;
    }
    /*
     * DatabaseJs.buildFields 
     *
     * @param field Field name
     * @param table Table to append field 
     *
     */
    DatabaseJs.appendField = function(field, table){
        $(table).html( $(table).html() + DatabaseJs.buildField({'name' : field, 'type': 'varchar'}) );
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
     * DatabaseJs.exportContent 
     *
     *
     */
    DatabaseJs.exportContent = function(){
        var tables = {'tables' : [] };
        $('.canvas ul').each(function (i, el){
            var table = {
                "name"   : $(el).attr('id'),
                "left"   : parseFloat( $(el).css('left').replace('px', '') ),
                "top"    : parseFloat( $(el).css('top').replace('px', '') ),
                "fields" : [] 
            }
            $(el).find('li').each(function(j, inel){
                table.fields.push({
                    "name" : $(inel).data('field'),
                    "type" : $(inel).find('select').val() 
                });
            });
            tables.tables.push(table)
        });
        return tables;
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
                    return DatabaseJs.exportContent()
                    break;
                case 'buildModel':
                    DatabaseJs.buildTables(originTable)
                    break;
                case 'refresh':
                    DatabaseJs.refresh();
                    break;
            }
        }

        if(inited){
            return;
        }

        inited = true;

        DatabaseJs.canvas = this;

        //
        $(this).on('mousedown', 'ul > li:first-of-type', function(e){
            e.preventDefault();
            dragging = true;
            dragElement = e.currentTarget;
        });

        //
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
                    var svg = $(dragElement).parent().attr('id');
                    svg = $("[data-origintable='"+svg+"'], [data-targettable='"+svg+"']");
                    if(svg.length > 0){ DatabaseJs.recalculateDots(svg); }
                }
            }

            if(pointDragging){ //SVG
                $(pointInDrag).attr('cx', e.originalEvent.clientX - $(pointInDrag).parent().parent().position().left );
                $(pointInDrag).attr('cy', e.originalEvent.clientY - $(pointInDrag).parent().parent().position().top );
                $(pointInDrag).parent().parent().trigger('change');
                DatabaseJs.recalculatePaths( $(pointInDrag).parent().parent() );
            }

        });

        //Cancel draggin stuff
        $('html').on('mouseup', function(e){
            e.preventDefault();
            dragElement = null; 
            dragging = false;
            pointInDrag = null; //SVG
            pointDragging = false; //SVG
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

            DatabaseJs.recalculateSVG(svg);
            DatabaseJs.recalculateDots(svg);
            DatabaseJs.recalculatePaths(svg);
        });

        //Connection scripts
        $(this).on('mousedown', 'circle:not(.origin)', function(){
            pointInDrag = $(this);
            pointDragging = true;
        });

        //Create a new dot on a existing path
        $(this).on('dblclick', 'path', function(e){
            console.log(e);
        });
        
        // Click on the + icon on the top right
        $(this).on('click', '.add_field', function(e){
            var fieldName = prompt('Field name'); 
            if(fieldName == null || fieldName == ''){ return; }
            DatabaseJs.appendField(fieldName, $(e.currentTarget).parent().parent().parent() )
        });

        $(this).on('contextmenu', 'li', function(e){
            e.preventDefault();

            var element = e.currentTarget;
            var table   = $(element).parent();

            if( confirm("Delete field and it's connections?") ){
                DatabaseJs.deleteField(element);
            }

        });

        $(this).on('contextmenu', '.add_field', function(e){
            e.preventDefault();
        });

    }

})(jQuery);
