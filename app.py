from flask import Flask, render_template,jsonify,request

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/db.sqlite"
#db = SQLAlchemy(app)


@app.route("/")
def index():
    return render_template("index.html")




if __name__ == "__main__":
    app.run(debug=True)