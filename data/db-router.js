const express = require('express');
const db = require('./db.js');

const router = express.Router();

//---------------------------------------------------------
// GET Requests
//---------------------------------------------------------
router.get('/', (req, res) => {
    db.find(req.query)
    .then(dbs => {
      res.status(200).json(dbs);
    })
    .catch(error => {
      res.status(500).json({success: false, error: "The post information could not be retrieved." });
    });
  });

  router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(dbs => {
      if(dbs.length > 0)
        res.status(200).json(dbs);
      else
      res.status(404).json({success: false, message: "The post with the specified ID does not exist." })
    })
    .catch(error => {
      res.status(500).json({success: false, error: "The post information could not be retrieved." });
    });
  });

  router.get('/:id/comments', (req, res) => {
    db.findCommentById(req.params.id)
    .then(dbs => {
      if(dbs.length > 0)
        res.status(200).json(dbs);
      else
      res.status(404).json({success: false, message: "The post with the specified ID does not exist." })
    })
    .catch(error => {
      res.status(500).json({success: false, error:  "The comments information could not be retrieved." });
    });
  });

//---------------------------------------------------------
// POST Requests
//---------------------------------------------------------
router.post('/', (req, res) => {
    const dataInfo = req.body;

    let hasTitle = false;
    let hasContents = false;
        "title" in dataInfo ? hasTitle = true : hasTitle = false;
        "contents" in dataInfo ? hasContents = true : hasContents = false;
        

        if(hasTitle && hasContents) {        
            db.insert(dataInfo)
            .then(data => {
                    db.findById(data.id)
                        .then(post => {
                            res.status(201).json({success: true, post})
                        })

                        .catch(err => {
                            res.status(500).json({success: false, err})
                        })
            })
            .catch(err => {                
                res.status(500).json({success:false, errorMessage: 'There was an error while saving the user to the database'});
            });
        }
        
        else
            res.status(400).json({success: false, errorMessage: "Please provide title and contents for the post." });
        });

router.post('/:id/comments', (req, res) => {
  const changes = req.body;
  const comment = req.body;

    if("text" in changes ) {
      db.findById(req.params.id)
          .then(body => {
            if(body.length > 0) {
              db.insertComment(comment)              
              .then(data => {
                db.findCommentById(data.id)
                  .then(comm => {
                    res.status(201).json({success: true, comm});
                  })
                  .catch(err => {
                    res.status(500).json({success: false, error: "There was an error while saving the comment to the database" });
                  })
                
              })
              .catch(err => {
                res.status(500).json({success: false, error: "There was an error while saving the comment to the database" });
              });
            }
            else
            res.status(404).json({success: true, message: "The post with the specified ID does not exist." });
          })
      .catch(err => {
        res.status(500).json({success: false, error: "There was an error while saving the comment to the database" });
        });
      }
      else  {
        res.status(404).json({success: false, errorMessage: "Please provide text for the comment." });
      }      
    });

//---------------------------------------------------------
// PUT Requests
//---------------------------------------------------------
router.put('/:id', (req, res) => {
  const changes = req.body;
  if("title" in changes && "contents" in changes ) {
    db.update(req.params.id, req.body)
    .then(dbs => {
      console.log(dbs);
      if(parseInt(dbs))
      {
        console.log('ID: ', req.params.id);
        db.findById(req.params.id)
          .then(data => {
            console.log('Inside db.findById()')
            console.log('data: ', data);
            res.status(200).json(data);
          })
          .catch(err => {
            res.status(500).json({success: false, error: "Internal server error fetching post after upate." });
          }) 
        }              
      else
        res.status(404).json({success: false, message: "The post with the specified ID does not exist." })
    })
    .catch(error => {
      res.status(500).json({success: false, error: "The post information could not be modified." });
    });
  }
  else
    res.status(400).json({success: false, errorMessage: "Please provide title and contents for the post." });
  });

//---------------------------------------------------------
// DELETE Requests
//---------------------------------------------------------
router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
  .then(dbs => {
    if(parseInt(dbs))       
      res.status(200).json(dbs);    
    else
    res.status(404).json({success: false, message: "The post with the specified ID does not exist." })
  })
  .catch(error => {
    res.status(500).json({success: false, error: "The post could not be removed" });
  });
  });

module.exports = router;