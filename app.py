from calendar import day_abbr, month
from crypt import methods
import os
import time
import json

from cs50 import SQL

from livereload import Server

from flask import Flask, flash, helpers, redirect, render_template, request, session
from flask_session import Session
import sqlite3x
from sqlalchemy.sql.base import Executable
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash

# Flask shit
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.after_request
def after_request(response):

    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"

    return response


# DB
db = SQL("postgres://boqwigugrlxmcr:e9e1751d15511215ca7f57bb3f636d467ce74b3a71d19c9192ee2bf1bbd9a55f@ec2-63-32-248-14.eu-west-1.compute.amazonaws.com:5432/dfa5512mt00u0u")


# json sql injection


def add_data_db(year, month, day, room, adults, children, daily_rate, breakfast, room_total, day_total, tax):
    injection = ('insert into reports (year, month, day, room, adults, children, daily_rate, breakfast, room_total, day_total, tax) values (%d, %d, %d, %d, %d, %d, %f, %d, %f, %f, %f);' % (
        year, month, day, room, adults, children, daily_rate, breakfast, room_total, day_total, tax))
    db.execute(injection)
    print('inserted')


@app.route('/')
def index():
    list = db.execute('select * from reports')
    return render_template('index.html', list=list)


@ app.route("/add-data", methods=["GET", "POST"])
def add_data():
    list = db.execute('select * from reports')
    if request.method == 'POST':
        print('/data-posted-----------')
        data = request.json
        listofdata = data['report']
        year = int(listofdata[0]['year'])
        month = int(listofdata[0]['month'])
        day = int(listofdata[0]['date'])
        db.execute(
            'delete from reports where year = ? and month = ? and day = ?', year, month, day)
        print('----DELETED----')

        for object in listofdata:

            room = int(object['room-id'])
            adults = int(object['adult-guests'])
            children = int(object['child-guests'])
            daily_rate = float(object['daily-rate'])
            breakfast = int(object['breakfast'])
            room_day_total = float(object['room-total'])
            hotel_day_total = float(object['day-total'])
            tax = float(object['tax'])
            year = int(object['year'])
            month = int(object['month'])
            day = int(object['date'])

            add_data_db(year, month, day, room, adults, children,
                        daily_rate, breakfast, room_day_total, hotel_day_total, tax)

        return render_template('add.html', list=list)
    else:
        return render_template('add.html', list=list)


if __name__ == "__main__":
    #app.run(host="172.16.200.10", port=5050, debug=True)

    app.run(debug=True)
