[![Dependency Status](https://david-dm.org/ericnsh/clinicWaitAPI.svg)](https://david-dm.org/ericnsh/clinicWaitAPI)

## ClinicWAIT API

ClinicWait is an Node.js API to performs some walk-in clinics line-up operations. the API provides interface to :   

* search a walk-in clinic based on geolocation*   
* know how engorged a clinic is before going there   
* register remotely to see a doctor   
* follow the evolution of traffic and track your position   
* cancel your registration anytime when needeed   

*dependencies : part of the clinics informations and geolocation is taken from the [Google Places API](https://developers.google.com/places/).

This project is actually for personal concern. It's meant to explore Node.js and all its underlying paradigm.

### Database
ClinicWait uses Azure DocumentDB (Cloud based NoSQL database - yet another deep diving) to store its data. TL;DR see configuration.

### Configuration
To get the API to work, you will need to get you a Google places API Key and A DocumentDB account.

First, add a folder named config in the root repository. Then add a file named config.js into it and copy the following code inside:

module.exports = {   
    GOOGLE_PLACES_API_KEY : 'your google place api key',   
    AZURE_DOCUMENT_DB_URI : 'your documentdb uri',   
    AZURE_DOCUMENT_DB_PRIMARY_KEY : 'your document db primary key',   
    AZURE_USERS_COLLECTION_ID : 'your document db users collection id',   
    AZURE_USERS_COLLECTION_URL : 'your document db users collection uri',     
    AZURE_WAITINGS_COLLECTION_ID : 'your document db waitings collection id',     
    AZURE_WAITINGS_COLLECTION_URL : 'your document db waitings collection uri'     
};

Now, make the following command to install all dependencies (make sure Node.js and npm are installed on your machine before).

```bat
npm install
```

and to finish start the app with the following

```bat
node index.js
```

You can now start querying the API en have fun :)

### hosted ClinicWait 

ClinicWait is available in hosted version on Azure (Microsoft cloud service).   
I will post the link here as soon as it's all ready and stable.

### Documentation

See the documentation in the [ClinicWait wiki](https://github.com/ericnsh/clinicWaitAPI/wiki)
