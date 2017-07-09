character = {
    # 'title' tag used in item links. Defaults to the resource title minus
    # the final, plural 's' (works fine in most cases but not for 'people')
    'item_title': 'character',

    # by default the standard item entry point is defined as
    # '/people/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/people/<lastname>'.
    'additional_lookup': {
        'url': 'regex("[\w]+")',
        'field': 'appearance'
    },

    # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,

    # most global settings can be overridden at resource level
    'resource_methods': ['GET', 'POST', 'DELETE'],

    'item_methods': ['GET', 'PATCH', 'PUT', 'DELETE'],

    'schema': {
        'appearance': {
            'type': 'string',
            'unique': True,
            'required': True
        },
        'pronunciation': {
            'type': 'string',
            'required': True
        },
    }
}

trial = {
    # 'title' tag used in item links. Defaults to the resource title minus
    # the final, plural 's' (works fine in most cases but not for 'people')
    'item_title': 'trial',

    # by default the standard item entry point is defined as
    # '/people/<ObjectId>'. We leave it untouched, and we also enable an
    # additional read-only entry point. This way consumers can also perform
    # GET requests at '/people/<lastname>'.
    # 'additional_lookup': {
    #     'url': 'regex("[\w]+")',
    #     'field': 'appearance'
    # },

    # We choose to override global cache-control directives for this resource.
    'cache_control': 'max-age=10,must-revalidate',
    'cache_expires': 10,

    # most global settings can be overridden at resource level
    'resource_methods': ['GET', 'POST', 'DELETE'],

    'item_methods': ['GET', 'PATCH', 'PUT', 'DELETE'],

    'schema': {
        'username': {
            'type': 'string',
            'required': True
        },
        'results': {
            'type': 'dict',
            'schema': {
                'ground_truth': {
                    'type': 'list',
                    'required': True,
                    'schema': {
                        'type': 'dict',
                        'schema': {
                            'appearance': {
                                'type': 'string'
                            },
                            'pronunciation': {
                                'type': 'string'
                            }
                        }
                    }
                },
                'answer_sheet': {
                    'type': 'list',
                    'required': True
                },
                'time_spent': {
                    'type': 'list',
                    'required': True
                }
            }
        },
    }
}
