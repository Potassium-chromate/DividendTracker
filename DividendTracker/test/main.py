from flask import Flask, Blueprint
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/hello", methods=["GET"])
def get_hello():
    return "hello"

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5002)

