const express = require('express');
const tagsRouter = express.Router();
const { 
  getAllTags, 
  getPostsByTagName,
  getUserById, 
} = require('../db');

tagsRouter.use((req, res, next) => {
  console.log('A request is being made to /tags');
  next();
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();
  res.send({ tags });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const allPosts = await getPostsByTagName(tagName.replace('%23', '#'));
    
    const posts = allPosts.filter( post => {

      if (post.active && post.author.active) {
        return true;
      }
      else if (req.user && post.author.id === req.user.id) {
        return true;
      }
      else {
        return false;
      }
    });
    res.send({ posts });
  }
  catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;