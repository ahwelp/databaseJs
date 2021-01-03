var data = {
    "tables" : [
        {
            "name" : 'user',
            "top" : 126,
            "left" : 108,
            "collapsed" : false,
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
            "collapsed" : false,
            "fields" : [
                { 'name' : 'id',     'type' : 'serial'  },
                { 'name' : 'userid', 'type' : 'numeric' },
                { 'name' : 'number', 'type' : 'varchar' },
            ]
        },
        {
            "name" : 'email',
            "top" : 450,
            "left" : 1000,
            "collapsed" : true,
            "fields" : [
                { 'name' : 'id',     'type' : 'serial'  },
                { 'name' : 'userid', 'type' : 'numeric' },
                { 'name' : 'number', 'type' : 'varchar' },
            ]
        },
        {
            "name": "user_config",
            "top" : 700,
            "left" : 300,
            "collapsed" : false,
            "fields" : [
                { 'name' : 'id',     'type' : 'serial'  },
                { 'name' : 'userid', 'type' : 'numeric' },
                { 'name' : 'key',    'type' : 'varchar' },
                { 'name' : 'value',  'type' : 'varchar' },
            ]
        }
    ],
    "constraints" : [
        {
            'origin': { 'table': 'user',        'field': 'id',     'nominal': false },
            'target': { 'table': 'user_config', 'field': 'userid', 'nominal': false },
            'dots' : [
                {'x' : 451, 'y' : 300 },
                {'x' : 451, 'y' : 526 },
            ]
        },
        {
            'origin': { 'table': 'user',  'field': 'id',     'nominal': false },
            'target': { 'table': 'email', 'field': 'userid', 'nominal': false },
            'dots' : [
                {'x' : 500, 'y' : 526 },
            ]
        },
        {
            'origin': { 'table': 'user', 'field': 'id',     'nominal': false },
            'target': { 'table': 'fone', 'field': 'userid', 'nominal': false },
            'dots' : [
                {'x' : 535, 'y' : 358 },
                {'x' : 969, 'y' : 358 },
            ]
        },
    ]
}
