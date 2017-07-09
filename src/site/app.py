import os

from eve import Eve
from eve_swagger import swagger
from flask import render_template


app = Eve(root_path=os.path.dirname(os.path.realpath(__file__)), template_folder='templates', static_folder='static', static_url_path='/static')
app.register_blueprint(swagger)

app.config['SWAGGER_INFO'] = {
    'title': 'My Supercool API',
    'version': '1.0',
    'description': 'an API description',
    'termsOfService': 'my terms of service',
    'contact': {
        'name': 'nicola',
        'url': 'http://nicolaiarocci.com'
    },
    'license': {
        'name': 'BSD',
        'url': 'https://github.com/pyeve/eve-swagger/blob/master/LICENSE',
    }
}


@app.route("/japanese")
def japanese():
    return render_template('japanese.html')


if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
