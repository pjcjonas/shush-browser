var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var bodyParser = require('body-parser');

// Set the views directory
app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', function(req, res){

    var url = 'http://www.shush.se/index.php?shows';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, episodesUlr;

            var data = [];

            $('td div a').each(function(index){
                data.push({title:$(this).find('.caption').text(), link:$(this).attr('href'), _id:index+1, img:$(this).find('img').attr('src')});
            });

            //console.log(data);

            res.render('index',{series:data});
        }
    });

});

app.post('/getepisodes', function(req, res){
    var data = req.body;
    var url = data.url;

    request(url, function(error, response, html){

        var data = [];

        if(!error){
            var $ = cheerio.load(html);

            $('td div a').each(function(index){
                data.push({title:$(this).text(), link:$(this).attr('href'), _id:index+1});
            });

            res.send(data);

        }

    });
});

app.post('/loadepisode', function(req, res){

    var data = req.body;
    var url = data.url;

    request(url, function(error, response, html){

        var data = [];

        if(!error){
            var $ = cheerio.load(html);


            //res.send($('#load .player').html());
            res.send($.html());

        }

    });
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});