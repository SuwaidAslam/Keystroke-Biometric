from flask import Flask, request
from flask import jsonify
from flask_cors import CORS #include this line
from joblib import dump, load
import json
import os
import pandas as pd

app = Flask(__name__)
app.run(debug=True)
CORS(app)
# @app.route("/")
# def hello_world():
#     return "<p>Hello world</p>"

@app.route('/learn', methods=['POST'])
def learn():
    # Get item from the POST body
    req_data = request.get_json()
    timeHoldDD = req_data[0:-1]
    user = req_data[-1]
    # print(timeHoldDD)
    # print(user)
    # load the model from disk
    label_encoder = load("./models/label_encoder.pkl")
    model = load("./models/model.pkl")
    X_test = [timeHoldDD]
    label = model.predict(X_test)
    # # remove Target_ from the name
    # user = user[7:]
    encoded_label = label_encoder.transform([user])
    # print(encoded_label)
    # print(label)
    res = False
    if encoded_label == label[0]:
        res = True
    res = bool(res)
    return str(res)


@app.route('/train', methods=['POST'])
def train():
    # Get item from the POST body
    req_data = request.get_json()
    df = pd.DataFrame(req_data)
    columns =  ['Usuario' ,'r_H','o_H','b_H','e_H','r_H','t_H','o_H','or_DD','bo_DD','eb_DD','re_DD','tr_DD','ot_DD']
    df.columns = columns
    df_original = pd.read_csv('./data/data.csv')
    df_original.columns = columns
    result = pd.concat([df_original, df], ignore_index=True)
    result.to_csv('./data/data.csv', index=False)
    res = bool(True)
    return str(res)


# get route which will return a list of users from models file names
@app.route('/users', methods=['GET'])
def users():
    label_encoder = load("./models/label_encoder.pkl")
    users = label_encoder.classes_
    users = users.tolist()
    return jsonify(users)