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
        { 'name' : 'time' },
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

        return "<svg "+dataFields+" style='position:absolute;'> <g class='lines'></g> <g class='dots'></g> </svg>";
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
     * DatabaseJs.recalculateSVG 
     *
     *
     */
    DatabaseJs.recalculateSVG = function(svg){
        $(svg).css('width', this.canvas[0].scrollWidth );
        $(svg).css('height', this.canvas[0].scrollHeight );
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

        var x1 = parseInt($(element1).css('left').replace('px', '')) + $(element1).height() / 2;
        var y1 = parseInt($(element1).css('top').replace('px', '')) + $(element1).width() / 2;

        var x2 = parseInt($(element2).css('left').replace('px', '')) + $(element2).height() / 2;
        var y2 = parseInt($(element2).css('top').replace('px', '')) + $(element2).width() / 2;;

        var points = "";
        points += "<circle class='origin' cx='"+x1+"' cy='"+y1+"' r='5' data-table='"+$(element1).attr('id')+"' />";
        if(dots == null || dots == []){
            points += "<circle cx='"+Math.abs(x1-x2)+"' cy='"+Math.abs(y1-y2)+"' r='5' />";
        }else{
            for(i in dots){
                points += "<circle cx='"+dots[i].x+"' cy='"+dots[i].y+"' r='5' />";
            }
        }
        points += "<circle class='origin' cx='"+x2+"' cy='"+y2+"' r='5' data-table='"+$(element2).attr('id')+"' />";
        $(svg).find('.dots').html(points);
    }


    /*
     * DatabaseJs.recalculateDot
     *
     *
     */
    DatabaseJs.recalculateDot = function(dot, svg){
        var table = $('#'+$(dot).data('table'));

        var x = parseInt($(table).css('left').replace('px', '')) + $(table).height() / 2;
        var y = parseInt($(table).css('top').replace('px', '')) + $(table).width() / 2;

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
            var x1 = $(oldElement).attr('cx') 
            var y1 = $(oldElement).attr('cy') 
            var x2 = $(el).attr('cx') - $(oldElement).attr('cx')
            var y2 = $(el).attr('cy') - $(oldElement).attr('cy')
            lines += "<path stroke-dasharray='10,5'  d='M "+x1+" "+y1+" l "+x2+" "+y2+"' stroke-width='3' />"
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
            DatabaseJs.recalculateDots(this); 
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
    DatabaseJs.buildTables = function(data){
        for(i in data.tables){
            var options = '<div style="float: right;">';
            options += "<span class='add_field'>+</span> ";
            options += "<span class='table_collapse'>^</span>";
            options += '</div>';

            var table = data.tables[i];
            var content = '';
            content += "<ul id='"+table.name+"' class='list-group db-table' style='left:"+table.left+"px; top:"+table.top+"px'>";
            content += "<li class='list-group-item active'>"+table.name+options+"</li>";
            content += DatabaseJs.buildFields(table.fields, data.tables[i].collapsed);
            content += "</ul>";

            $( DatabaseJs.canvas ).html( $( DatabaseJs.canvas ).html() + content );
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
    DatabaseJs.buildFields = function(fields, collapsed){
        var ret = "";
        for(j in fields){
            ret+= DatabaseJs.buildField(fields[j]);
        }
        if(collapsed){ return "<div class='rows collapsed'>" + ret + "</div>"; }else{ return "<div class='rows'>" + ret + "</div>"; }
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
        var structure = {'tables' : [], 'constraints': []};
        $(this.canvas).find('ul').each(function (i, el){
            var table = {
                "name"   : $(el).attr('id'),
                "top"    : parseInt( $(el).css('top').replace('px', '') ),
                "left"   : parseInt( $(el).css('left').replace('px', '') ),
                "fields" : [] 
            }
            $(el).find('li:not(.active)').each(function(j, inel){
                table.fields.push({
                    "name" : $(inel).data('field'),
                    "type" : $(inel).find('select').val() 
                });
            });
            structure.tables.push(table)
        });
        $(this.canvas).find('svg').each(function (i, el){
            var dots = [];
            $(this).find('circle').each(function(i, el){
                if( $(el).hasClass('origin') ){ return true; }
                dots.push({
                    'x': parseInt( $(el).attr('cx') ),
                    'y': parseInt( $(el).attr('cy') ) 
                });
            });
            structure.constraints.push({
                'origin': {'table': $(el).data('origintable'), 'field': $(el).data('originfield'), 'nominal':false},
                'target': {'table': $(el).data('targettable'), 'field': $(el).data('targetfield'), 'nominal':false},
                'dots':dots});
        });
        return structure;
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
                    console.log(targetTable)
                    DatabaseJs.appendField(targetField, $(targetTable).find('.rows') )
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
            DatabaseJs.refresh();
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

        });

        //Connection scripts
        $(this).on('mousedown', 'circle:not(.origin)', function(){
            pointInDrag = $(this);
            pointDragging = true;
        });

        // DoubleClick on circle to remove-it
         $(this).on('dblclick', 'circle:not(.origin)', function(e){
            $(this).remove();
            DatabaseJs.refresh();
        });

        // Click on the + icon on the top right
        $(this).on('click', '.add_field', function(e){
            var fieldName = prompt('Field name'); 
            if(fieldName == null || fieldName == ''){ return; }
            DatabaseJs.appendField(fieldName, $(e.currentTarget).parent().parent().parent().find('.rows') )
        });

        $(this).on('click', '.table_collapse', function(e){
            $(this).parent().parent().parent().find('.rows').toggleClass('collapsed');
            DatabaseJs.refresh();
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
