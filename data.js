var types = [
    { 'name' : 'serial' },
    { 'name' : 'numerical' },
    { 'name' : 'char' },
    { 'name' : 'varchar' },
    { 'name' : 'date' },
    { 'name' : 'datetime' }
]

var data = {
    "tables" : [
        {
            "name" : 'user',
            "top" : 100,
            "left" : 100,
            "fields" : [
                { 'name' : 'id',          'type' : 'serial' },
                { 'name' : 'firstname',   'type' : 'varchar' },
                { 'name' : 'lastname',    'type' : 'varchar' },
                { 'name' : 'password',    'type' : 'varchar' },
                { 'name' : 'timecreated', 'type' : 'time' },
            ]
        },
        {
            "name" : 'fone',
            "top" : 300,
            "left" : 700,
            "fields" : [
                { 'name' : 'id',     'type' :    'serial'  },
                { 'name' : 'userid', 'type' :    'numeric' },
                { 'name' : 'number', 'type' :    'varchar' },
            ]
        }
    ],
    "relations" : [
        {
            'origintable' : 'user',
            'originfield' : 'id',
            'targettable' : 'phone',
            'targetfield' : 'userid',
            'dots' : [
                {'x' : 15, 'y' : 20 },
            ]
        }
    ]
}


function buildTables(data, el){
    var tables = "";
    for(i in data.tables){
        var table = data.tables[i];
        tables += "<ul id='"+table.name+"' class='list-group db-table' style='left:"+table.left+"px; top:"+table.top+"px'>";
        tables += "<li class='list-group-item active'>"+table.name+"</li>";
        tables += buildFields(table.fields);
        tables += "</ul>";
    }
    for(i in data.relations){
        tables += buildConnection(data.relations[i]);
    }
    $(".canvas").html(tables);
}

function buildFields(fields){
    var ret = "";
    for(j in fields){
        var field = fields[j];
        ret+= "<li id='"+field.name+"' class='list-group-item db-row'>"+field.name + buildSelect(field.type)+"</li>"
    }
    return ret;
}

function buildSelect(selected){
    var select = '<select>';
    for(i in types){
        if(types[i].name == selected){
            select += "<option value='"+types[i].name+"' selected>"+types[i].name+"</option>"
        }else{
            select += "<option value='"+types[i].name+"'>"+types[i].name+"</option>"
        }
    }
    return select + '</select>';
}

function buildConnection(connection){
    return '';
    //console.log(connection)
}

buildTables(data, 0);

