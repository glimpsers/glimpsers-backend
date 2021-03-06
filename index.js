'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const handleMovie = require('./model/movies');
const handleNews = require('./model/news');
const handleBooks = require('./model/books');
const handleArt = require('./model/art');
const cats = require('./model/cats');
const quotes = require('./model/quotes');

const handlefood = require('./model/food');



const schema = require('./model/allDataSchema');

const app = express();

app.use(cors());
app.use(express.json());

//env
const PORT = process.env.PORT || 3070;
const DB_URL = process.env.DB_URL;

mongoose.connect(
  `${DB_URL}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

//API's
app.get('/movie', handleMovie);
app.get('/art', handleArt);
app.get('/news', handleNews);
app.get('/books', handleBooks);
app.get('/cats', cats);
app.get('/quotes', quotes);
app.get('/food', handlefood);


app.get('/', (req, res) => {
  res.send('glimpsers');
});

app.get('/data', schema.filterData);


app.post('/addnewuser', (req, res) => {
  const { email, name, imageUrl, movie, news, books, art, cats, food } = req.body;
  schema.user(email, name, imageUrl, movie, news, books, art, cats, food);
  res.send('New User Added');


});


app.post('/addnewpost', addNewPost);

function addNewPost(req, res) {
  const { email, description, date, numberOfLikes, imageUrl, postindex, post, commit, comment, commenterImage, nameOfCommenter } = req.body;
  if (post === true) {
    schema.UserData.find({ email: email }, (error, ownerData) => {
      if (error) res.send('didnt work creat');

      ownerData[0].posts.unshift({
        description: description,
        date: date,
        numberOfLikes: numberOfLikes,
        imageUrl: imageUrl,
        commentsArray: []
      });
      ownerData[0].save();
      res.send(ownerData[0]);

    });
  } else if (commit === true) {
    const postIndex = Number(postindex);
    schema.UserData.find({ email: email }, (error, ownerData) => {
      if (error) res.send('didnt work creat at comment');

      ownerData[0].posts[postIndex].commentsArray.push({

        comment: comment,
        date: date,
        commenterImage: commenterImage,
        nameOfCommenter: nameOfCommenter,
        numberOfLikes: numberOfLikes,

      });
      ownerData[0].save();
      res.send(ownerData[0]);
    });
  } else {
    res.send('wrong data');
  }

}

app.put('/updatepost/:index', updatepost);

function updatepost(req, res) {
  const { email, description, date, numberOfLikes, commentIndex, updatePost, updateCommit, comment, commenterImage, nameOfCommenter } = req.body;
  const postIndex = Number(req.params.index);
  if (updatePost === true) {
    schema.UserData.find({ email: email }, (error, ownerData) => {
      if (error) res.send('didnt work update post');
      ownerData[0].posts[postIndex].description = description;
      ownerData[0].posts[postIndex].date = date;
      ownerData[0].posts[postIndex].numberOfLikes = numberOfLikes;

      ownerData[0].save();
      res.send(ownerData[0]);

    });
  } else if (updateCommit === true) {
    const commientindex = Number(commentIndex);
    schema.UserData.find({ email: email }, (error, ownerData) => {
      if (error) res.send('didnt work update comment');

      ownerData[0].posts[postIndex].commentsArray[commientindex].comment = comment;
      ownerData[0].posts[postIndex].commentsArray[commientindex].date = date;
      ownerData[0].posts[postIndex].commentsArray[commientindex].commenterImage = commenterImage;
      ownerData[0].posts[postIndex].commentsArray[commientindex].nameOfCommenter = nameOfCommenter;
      ownerData[0].posts[postIndex].commentsArray[commientindex].numberOfLikes = numberOfLikes;

      ownerData[0].save();
      res.send(ownerData[0]);
    });
  }
}
app.delete('/deletepost/:index', deletePost);

function deletePost(req, res) {
  const index = Number(req.params.index);

  const { email, commentNum, commentFlag, postFlag } = req.query;

  if (postFlag === '1') {

    schema.UserData.find({ email: email }, (error, ownerData) => {
      if (error) res.send('didnt work delete');
      const newPostArr = ownerData[0].posts.filter((posts, idx) => {
        return idx !== index;
      });
      ownerData[0].posts = newPostArr;
      ownerData[0].save();
      res.send(ownerData[0]);
    });
  } else if (commentFlag === '1') {

    const commentIndex = Number(commentNum);

    schema.UserData.find({ email: email }, (error, ownerData) => {
      if (error) res.send('didnt work delete');
      const newPostArr = ownerData[0].posts[index].commentsArray.filter((comment, idx) => {
        return idx !== commentIndex;
      });
      ownerData[0].posts[index].commentsArray = newPostArr;
      ownerData[0].save();
      res.send(ownerData[0]);
    });
  } else {
    res.send('bad request ');
  }

}

app.put('/updateinterest', updateinterest);

function updateinterest(req, res) {
  const { email, movie, news, books, art, cats, food } = req.body;
  schema.UserData.find({ email: email }, (error, ownerData) => {
    if (error) res.send('didnt work update post');

    ownerData[0].interest.movie = movie;
    ownerData[0].interest.news = news;
    ownerData[0].interest.books = books;
    ownerData[0].interest.art = art;
    ownerData[0].interest.cats = cats;
    ownerData[0].interest.food = food;


    ownerData[0].save();
    res.send(ownerData[0]);

  });
}

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

