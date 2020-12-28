var data = {
    "tables" : [
        {
            "name" : 'user',
            "top" : 126,
            "left" : 108,
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
            "top" : 82,
            "left" : 927,
            "fields" : [
                { 'name' : 'id',     'type' : 'serial'  },
                //{ 'name' : 'userid', 'type' : 'numeric' },
                { 'name' : 'number', 'type' : 'varchar' },
            ]
        },
        {
            "name": "user_config",
            "top" : 700,
            "left" : 300,
            "fields" : [
                { 'name' : 'id',     'type' : 'serial'  },
                { 'name' : 'userid', 'type' : 'numeric' },
                { 'name' : 'key',    'type' : 'varchar' },
                { 'name' : 'value',  'type' : 'varchar' },
            ]
        }
    ],
    "relations" : [
        {
            'origin': { 'table': 'user',  'field': 'id',     'nominal': false },
            'target': { 'table': 'phone', 'field': 'userid', 'nominal': true },
            'dots' : [
                {'x' : 969.015625, 'y' : 219.015625 },
            ]
        },
        {
            'origin': { 'table': 'user',        'field': 'id',     'nominal': false },
            'target': { 'table': 'user_config', 'field': 'userid', 'nominal': true },
            'dots' : [
                {'x' : 15, 'y' : 20 },
            ]
        }
    ]
}

