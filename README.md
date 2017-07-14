# README

# Nosey Neighbor  

*There are **dangerous people** in this world.*  

*They can be anyone, walking freely amongst us and blending into our society.*   

*They can be anywhere, at anytime. From the nations capitol, to the streets of your hometown.*  

*They watch from the shadows of our society, waiting for when we are the most unprepared and vulnerable,to strike and harm us, our families, our friends and even our neighbors.*  

*In this modern world that we live in, with an overt presence of **danger** coming from all around us, it's more important than ever that the people of this world, the ones with drive, vision and moral superiority be given the tools to watch over those who cannot bear the burden that comes with the weight having those qualities can bring.*

*And only those elite few can master the sleuth-like cunning and technical prowess to save us all.*  

*For those select few - the **bold**, the **strong**, the **superior** - we give you the greatest tool to maintain the information necessary to protect those around you.*  

*We give you - **Nosey Neighbor**.*  

*It may just save us all...*


## Overview  

* This RESTful API provides the necessary back-end infrastructure to create, read, update and delete data related to the day-to-day operation of Home Owners Association/Neighborhood watch duties.  

* Currently, access to technology that is capable of providing this functionality resides within other, more cumbersome applications or may be created using various office-based applications and our over-all goal is to provide the eagle-eyed member of a neighborhood watch member or administrator for a Home Owners Association a simple-to-use platform for recording any incidents or infraction for display to the neighborhood members and prospective neighbors.

### Our App In Use

In real world deployment - Our app provides a database, utilizing several middle-ware applications and MongoDB, of all instances of neighborly conduct ranging from H.O.A. violations, Medical emergencies and even Criminal/Civil infractions.  

The end-user goal will be to place this app into the hands of the more inquisitive types in this world and store their findings within our database for later reference as a resource to aid in determining potential future problems or to display a history of infractions - should such information be necessary.

Some documented features include:

* The ability to create an individual user for access to the local neighborhoods database. Also, the functionality of being able to customize this user has been added for ease of identifying themselves or others, to include those who may not wish to be tracked by this app.

* The ability to create and track an individual residence for the sake of noting any noteworthy incidents at said residence.  

* An individual ability to report incidents and using a residences individual instance, and provide this information for local users to add their own feedback!

* The ability to remove any incident report will be relegated only to the administrator of the DB to ensure total transparency for the protection and scrutiny of all users. The app will publicly display any infractions for review by the other users in a predetermined area, and allow for other users to comment publicly on any incident.  

## Installation  

In it's current configuration - forking the repository from [GitHub](https://github.com/tjayrocket/nosey-neighbor) and cloning the repository to your local system is the most direct way to install this app for use.  

Upon receipt of the application, in the command line the necessary dependencies need to be installed for full functionality. This can be done by using the following command:

```
npm i  
```

This will install all necessary dependencies for deployment and use.

## How To Use  

PLACEHOLDER

## Architecture

### Overview

Nosey Neighbor is structured on a Model View Controller (MVC) architecture pattern.  The base technologies are node.js server, node.http module, express middleware, and a Mongo database. This architecture is currently deployed in a two tier environment(staging, production), leveraging the Heroku platform.  

### Middleware  

The Following Middleware Packages are used in the current build and are required for full operation of this application:  

* AWS-SDK (For access to S3)
* BCRYPT (For Encryption)
* BODY-PARSER (For Accepting JSON)
* CORS (Makes API Public)
* DOTENV (For Environment Variables)
* EXPRESS (Handles Routes)
* FS-EXTRA (For working with the File System)
* JSONWEBTOKEN (For Authorization)
* MONGOOSE (Interacting with MongoDB)
* MULTER (For Multipart/Form data)
* UNIVERSALIFY (For Callback/Promise Functionality)  

The Following Middleware Packages are used for the development and testing process and are required for further development of features for this application:  

* AWS-SDK-MOCK (Creating Mock Data for S3)
* DOTENV (For Environment Variables)
* ESLINT (Code Error Detection)
* EXPECT (Testing)
* FAKER (Creation of Fake Assets/Testing)
* MOCHA (Testing)
* MORGAN (HTTP Request Logger)
* NYC (For Code Coverage)
* SUPERAGENT (HTTP Request Library)

## Models  

This application uses 5 unique models:   

* **USER**  

Required Data:  
*EMAIL, PASSWORD*  
Generated Content:  
*USER_ID, PASSWORDHASH, TOKENSEED*  
Model Dependencies:  
*NONE*  
Middleware Required:  
*BCRYPT, CRYPTO, JSONWEBTOKEN, MONGOOSE*  

Description:  
This model is initially used to create a user and define their login and password while also issuing the necessary webtoken for authorization access. It uses encryption to ensure that no passwords are stored in plain-text for security reasons.  

* **RESIDENCE**  

Required Data:  
*ADDRESS, OCCUPANTS*  
Generated Content:  
*RESIDENCE_ID*  
Model Dependencies:  
*INCIDENTS*  
Middleware Required:  
*MONGOOSE*  

Description:  
This model is used to create an incidence of a Residence in the neighborhood. It carries no dependencies beyond the ability to attach an INCIDENT to the residence.  

* **PROFILE**  

Required Data:  
*USERID, NAME, IMAGE, RESIDENCEID, PHONE, BIO*  
Generated Content:  
*PROFILE_ID*  
Model Dependencies:  
*USER, RESIDENCE*  
Middleware Required:  
*MONGOOSE*  

Description:  
This model is used to create the profile for the user or for others in the neighborhood. The dependencies require both the USER and RESIDENCE models to supply the USERID and RESIDENCEID.  

* **INCIDENT**  

Required Data:  
*USERID, TIMESTAMP, TYPE, DESCRIPTION, RESIDENCEID, COMMENTS*  
Generated Content:  
*INCIDENT_ID*  
Model Dependencies:  
*USER, RESIDENCE, COMMENT*  
Middleware Required:  
*MONGOOSE*  

Description:  
This model is for creating known incidents, applying a time stamp to it for later reference and attaching user comments and a residence to an incidence. This model also feeds into several other models for tracking the incidents by residence and also carries an array of comments with it that will be supplied by the users.  

* **COMMENT**  

Required Data:  
*USERID, INCIDENTID, CONTENT, TIMESTAMP*  
Generated Content:  
*COMMENT_ID*  
Model Dependencies:  
*USER, INCIDENTS*  
Middleware Required:  
*MONGOOSE*  

Description:  
This model handles user generated comments and attaches them to the appropriate incidents for search at a later time.

## Routes

* **USER**

+ '/api/signup'   
  * POST: email + pw => token, 201  

This route creates our users.

The route does this when it takes in an email and user-generated password and encrypts the data and also handles the initial issuing of a token to grant the user access to our application.  

Creating the user is necessary to post any new assets to our application and issue the token required to authorize the user to create and update data.

- '/api/signin'  
  * GET: basicAuth => token, 200  

This route takes in the user-supplied email and password and creates an Authorization header to be sent for authentication. Upon successful verification of the user, it issues a new token so the user can access the application

* **RESIDENCE** '/api/residences'  

  * POST: address => residenceId, 201  

This route takes in the user-supplied required data to create a new residence within our database. This information requires TOKEN authorization in order to successfully POST a new residence and populate the DATABASE with it.  

  * GET: /residenceId => whole object, 200  

This route is used to find an individual RESIDENCE by it's ID that was issued by MongoDB.  

  * GET: / => pagination of whole residence objects, 200  

This route takes in a request for a listing of all RESIDENCES stored in the DATABASE and returns it to the user in a controlled 'Page' format.  

One Page would contain up to the first 50 responses - or less if not more than 50. But, 50 is still a lot of damn houses/units to watch. *How do you find the time to do it, hero*?  

  * PUT: residenceId + occupants => 202  

This route requires the RESIDENCE_ID and is used to update the Occupants of a residence. It requires TOKEN access to update this resource.

*  **INCIDENTS** '/api/incidents'  

  * POST: token, type (validated), content, residenceId => whole object, 201  

This route takes in user-supplied data for a new Incident and TOKEN authorization to create a new instance of an incident in our Database.  

This also provides access to Comments by users later via the COMMENTS router.  

  * GET: / => array of incidents, 200  

This route provides access to all incidents held in the database. It does not require TOKEN access to assist with the largest dissemination of information possible.  

  * GET: incidentId => whole object, 200  

This route provides access to one singular incident, when being supplied with the INCIDENT_ID. Also not protected via TOKEN authorization, as to disseminate the information to the most possible people. For public shaming.  


* **COMMENTS** '/api/comments'  

  * POST: token + incidentId + content => whole object, 201  

This route takes in TOKEN authorization, but also requires the INCIDENT_ID and a body of content to attach an instance of a comment to a single INCIDENT.  

This new COMMENT is then stored in the DATABASE and made available for search later.  

  * GET: /commentId => whole object, 200  

Using the COMMENT_ID, this route allows anyone to request and view the single comment requested.  

  * GET: / => pagination of whole comment objects, 200  

This route takes in a request for a listing of all COMMENTS stored in the DATABASE and returns it to the user in a controlled 'Page' format.  

One Page would contain up to the first 5 responses - or less if not more than 5.  

  * PUT: token + content => whole object (user validated), 202  

This route takes in a specific COMMENT_ID and TOKEN authorization to allow a user the ability to update their comments within the database.  

  * DEL: token + content => 204 (user validated)  

This route takes in a specific COMMENT_ID and TOKEN authorization to allow a user the ability to DELETE their comments within the database.  

Personally, as the guy who loves the worst things about the internet, I don't like how people can update or edit their comments. But, this *is* a school project and well, I don't have the heart to be a Tyrant .... this time.  


* **PROFILE** '/api/profiles'  

  * POST: token + name + residenceId + phone + bio => whole object, 201  

This route takes in TOKEN authorization to allow a user to create a new profile, attach a S3 hosted image to the profile and also update any of the other information they desire for ease of use and identification. In case of suspicious activity, ya know?  

  * PUT: /profileId + token + phone &/|| bio => 202  

This route, requiring TOKEN authorization, allows a user to update and change information to a specific instance of a profile, as found by the user-supplied PROFILE_ID.  

  * GET: /profileId => whole object, 200  

This route allows a user to search and view a specific profile by using the PROFILE_ID to find it.  

This can be used nefariously. I approve.

## About Us

* **Spencer Gietzen**  
  * I am a software developer and I take my development very seriously. I love coding and outside of Code Fellows, it is one of my main hobbies. I've worked with many different programming languages, but ultimatly JavaScript is what I emerged with because of its versatility, advancement, and rapidly growing adoption in the real world. This project was awesome to work on and working with my team was very easy and we didn't really have any problems. Everyone did there part and we all contributed to this entire project. I can't wait to start my career as a software developer and that's why I'm doing what I'm doing right now.

* **Steve Walsh**
  * I was born and raised in Boston where I first found my love for computers visiting the Computer Museum. I spent middle and high school working for my school's IT department where I learned network infrastructure, the NT server environment, cabling, etc. I continued to work there through college, where I earned a Bachelor's of Science in 2007. I did freelance computer work (hardware/OS) and front-end development on CMS platforms such as Joomla and WordPress, including a production e-commerce site for my own business. I joined another business as a partner in 2010 and left that business in 2017 to pursue software development full-time. I love building things and solving complex problems in a collaborative environment.  That's why I love software development!

  * **Stephanie Dover**
    * I have a background in business and specialized in process improvement. As part of doing process improvement at my previous job, I had to build an intranet for 200+ users. I did so by using tools that other developers built, but I dreamed of doing it better. I wanted to learn to code so that I could make my own tools tailor made for the company. I learned a little bit and loved it so much I decided to learn more and become a software developer. Being a software developer feeds my passion for problem solving and learning. I enjoyed working with my project team. We had a great team dynamic and work well together.
