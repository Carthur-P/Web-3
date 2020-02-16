from flask import Flask, render_template, request
from mongoengine import *
import os, csv
from flask_cors import CORS, cross_origin

app = Flask(__name__) 
CORS(app, supports_credentials=True)
app.config.from_object('config')
connect('test') #connecting to the database name test

#creating a class that will create a user in the db
class Country(Document):
    name = StringField()
    data = DictField()

#route for accessing the templates
@app.route('/')
@app.route('/index')
@app.route('/home')
def index():
    return render_template("index.html", title = "Homepage", name = "index")

@app.route('/inspiration')
def inspiration():
    return render_template("inspiration.html", title = "Inspiration Page", name = "inspiration")

@app.route('/loadData')
def loadData():
    #Country.objects.delete()
    for file in os.listdir(app.config['FILES_FOLDER']):
        filename = os.fsdecode(file)
        path = os.path.join(app.config['FILES_FOLDER'],filename)
        f = open(path)
        r = csv.DictReader(f) 
        d = list(r)
        for data in d:
            country = Country() # a blank placeholder country
            dt = {} # a blank placeholder data dict
            for key in data: # iterate through the header keys
                if key == "country":
                    if Country.objects(name = data[key]).count() == 0:
                        country['name'] = data[key]                        
                    else:
                        country = Country.objects.get(name = data[key])  
                        dt = country['data']           
                else:
                    f = filename.replace(".csv","") # we want to trim off the ".csv" as we can't save anything with a "." as a mongodb field name
                    if f in dt: # check if this filename is already a field in the dict
                        dt[f][key] = data[key] # if it is, just add a new subfield which is key : data[key] (value)
                    else:
                        dt[f] = {key:data[key]} # if it is not, create a new object and assign it to the dict
                country['data'] = dt
            country.save()   
    return Country.objects.to_json()

@app.route('/showGraph')
def showGraph():
    return render_template("data.html", title = "Show Graph Page", name = "showGraph")

#route for interacting with data
@app.route('/country', methods=['GET'])
@cross_origin()
def getCountry():
    countryName = request.form.get("country")
    if countryName is None:
        countries = Country.objects
    else:
        countries = Country.objects.get(name = countryName)
    return countries.to_json(), 200

@app.route('/country', methods=['POST'])
@cross_origin()
def addCountry():
    countryName = request.form.get("name")
    countryData = request.form.get("data")
    if countryName is None:
        return 500
    else:
        country = Country(name = countryName, data = countryData).save()
        countries = Country.objects
        return countries.to_json(), 200

@app.route('/country', methods=['DELETE'])
@cross_origin()
def deleteCountry():
    countryName = request.form.get("country")
    Country.objects(name = countryName).delete()
    return Country.objects.to_json(), 200

@app.route('/country', methods=['PUT'])
@cross_origin()
def updateCountry():
    countryName = request.form.get("country")
    newCountryName = request.form.get("newCountry")
    Country.objects(name = countryName).update(name = newCountryName)
    return Country.objects.to_json(), 200
    
if __name__ =="__main__":
    app.run(host='0.0.0.0', port=80)