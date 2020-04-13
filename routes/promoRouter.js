const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

promoRouter.route('/:promotionId')
.get((req,res,next) => {
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promotionId);
})
.put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promotionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promotionId/comments')
.get((req,res,next) => {
    Promotions.findById(req.params.Id)
    .then((promotions) => {
      if(promotion !=null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      }
      else {
        err = new Error('promotion' + req.params.promotionId + 'not found');
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
  Promotions.findById(req.params.promotionId)
  .then((promotion) => {
      if (promotion != null) {
          promotion.comments.push(req.body);
          promotion.save()
          .then((promotion) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotion);                
          }, (err) => next(err));
      }
      else {
          err = new Error('promotion ' + req.params.promotionId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /promotions/'
      + req.params.promotionId + '/comments');
})
.delete((req, res, next) => {
  Promotions.findById(req.params.promotionId)
  .then((promotion) => {
      if (promotion != null) {
          for (var i = (promotion.comments.length -1); i >= 0; i--) {
              promotion.comments.id(promotion.comments[i]._id).remove();
          }
          promotion.save()
          .then((promotion) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotion);                
          }, (err) => next(err));
      }
      else {
          err = new Error('promotion ' + req.params.promotionId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));    
});

promoRouter.route('/:promotionId/comments/:commentId')
.get((req,res,next) => {
  Promotions.findById(req.params.promotionId)
  .then((promotion) => {
      if (promotion != null && promotion.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotion.comments.id(req.params.commentId));
      }
      else if (promotion == null) {
          err = new Error('promotion ' + req.params.promotionId + ' not found');
          err.status = 404;
          return next(err);
      }
      else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);            
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promotionId
      + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
  Promotions.findById(req.params.promotionId)
  .then((promotion) => {
      if (promotion != null && promotion.comments.id(req.params.commentId) != null) {
          if (req.body.rating) {
              promotion.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
              promotion.comments.id(req.params.commentId).comment = req.body.comment;                
          }
          promotion.save()
          .then((promotion) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotion);                
          }, (err) => next(err));
      }
      else if (promotion == null) {
          err = new Error('promotion ' + req.params.promotionId + ' not found');
          err.status = 404;
          return next(err);
      }
      else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);            
      }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete((req, res, next) => {
  Promotions.findById(req.params.promotionId)
  .then((promotion) => {
      if (promotion != null && promotion.comments.id(req.params.commentId) != null) {
          promotion.comments.id(req.params.commentId).remove();
          promotion.save()
          .then((promotion) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(promotion);                
          }, (err) => next(err));
      }
      else if (promotion == null) {
          err = new Error('promotion ' + req.params.promotionId + ' not found');
          err.status = 404;
          return next(err);
      }
      else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);            
      }
  }, (err) => next(err))
  .catch((err) => next(err));
});


module.exports = promoRouter;
