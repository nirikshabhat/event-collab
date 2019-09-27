import express from 'express'
import cors from 'cors';
import * as bodyParser from 'body-parser' 
import events_routes  from './routes/events_routes'
import passport from 'passport'

var app = express()

//app.use(passport.initialize());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())


app.use('/events',events_routes);

app.use('/',function(req,res){
    res.send('Event Collaboration - Route not found');
})

var server = app.listen(3000, function(){
	console.log('Event Collaboration API running at port 3000: http://127.0.0.1:3000 or http://localhost:3000')
})

module.exports=app;