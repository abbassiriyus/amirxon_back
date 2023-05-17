require("dotenv").config()
var express = require('express');
var app = express();

var fs =require('fs')
var cors = require('cors')
const upload = require("express-fileupload")
const pool = require("./db")
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(upload())
app.use(express.static('./public'))
const jwt = require('jsonwebtoken');


const TOKEN = '69c65fbc9aeea59efdd9d8e04133485a09ffd78a70aff5700ed1a4b3db52d33392d67f12c1'

function autificationToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, TOKEN, (err, user) => {
        if (err) res.sendStatus(403)
    })
    next()
}

// news
app.get('/news', (req, res) => {
    pool.query("SELECT * FROM news", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/news/:id', (req, res) => {
    pool.query("SELECT * FROM news where newsid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/news', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
    const { image_news } = req.files;
    var rendom = Math.floor(Math.random() * 10000000);
    var img2 = rendom + image_news.name.slice(image_news.name.lastIndexOf('.'));

    image_news.mv(__dirname + '/public/' + img2);
    pool.query("insert into news (title_news, image_news, desc_news,link,syscreatedatutc) values ($1, $2, $3, $4, $5)",
        [body.title_news,img2,body.desc_news,body.link,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/news/:id', (req, res) => {
    pool.query("SELECT * FROM news where newsid=$1", [req.params.id], (err, result) => {
      if (result.rows.length>0) {
        if (!err) {
            fs.unlink(`./public/${result.rows[0].image_news}`, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
        } else {
            res.status(400).send(err)
        }
      }
    })

    pool.query("DELETE FROM news WHERE newsid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/news/:id', (req, res) => {
pool.query("SELECT * FROM news where newsid=$1", [req.params.id], (err, result) => {
        const { image_news }=req.files
        if (result.rows.length>0) {
          if (!err){
              image_news.mv(__dirname + '/public/' + result.rows[0].image_news);
          } else {
              res.status(400).send(err)
          }
        }
      })
var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE news SET title_news=$1,  desc_news=$3,link=$4 WHERE newsid=$2`,
        [body.title_news, req.params.id,body.desc_news,body.link], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})



// file
app.get('/file', (req, res) => {
    pool.query("SELECT * FROM file", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/file/:id', (req, res) => {
    pool.query("SELECT * FROM file where fileid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/file', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
    const { file_image, file1 } = req.files;
    var rendom = Math.floor(Math.random() * 10000000);
    var img2 = rendom + file1.name.slice(file1.name.lastIndexOf('.'));
    var img3 = rendom+"file"+ file_image.name.slice(file_image.name.lastIndexOf('.'));
    file_image.mv(__dirname + '/public/' + img2);
    file_image.mv(__dirname + '/public/' + img3);
    pool.query("insert into file (file_title, file_image, file1) values ($1, $2, $3)",
        [body.file_title,img2,img3], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/file/:id', (req, res) => {
    pool.query("SELECT * FROM file where fileid=$1", [req.params.id], (err, result) => {
      if (result.rows.length>0) {
        if (!err) {
            fs.unlink(`./public/${result.rows[0].file_image}`, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
            fs.unlink(`./public/${result.rows[0].file1}`, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
        } else {
            res.status(400).send(err)
        }
      }
    })

    pool.query("DELETE FROM news WHERE fileid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/file/:id', (req, res) => {
pool.query("SELECT * FROM file where fileid=$1", [req.params.id], (err, result) => {
        const { file1,file_image }=req.files
        if (result.rows.length>0) {
          if (!err){
            file1.mv(__dirname + '/public/' + result.rows[0].file1);
            file_image.mv(__dirname + '/public/' + result.rows[0].file_image);
          } else {
              res.status(400).send(err)
          }
        }
      })
var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE file SET file_title=$1 WHERE fileid=$2`,
        [body.file_title, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})



// foto
app.get('/foto', (req, res) => {
    pool.query("SELECT * FROM foto", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/foto/:id', (req, res) => {
    pool.query("SELECT * FROM foto where fotoid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/foto', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
pool.query("insert into foto (foto_title,link,syscreatedatutc) values ($1, $2,$3)",
        [body.foto_title,body.link,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/foto/:id', (req, res) => {
  
    pool.query("DELETE FROM foto WHERE fotoid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/foto/:id', (req, res) => {

var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE foto SET foto_title=$1,link=$3 WHERE fotoid=$2`,
        [body.foto_title,body.link, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// fotoimg
app.get('/fotoimg', (req, res) => {
    pool.query("SELECT * FROM fotoimg", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/fotoimg/:id', (req, res) => {
    pool.query("SELECT * FROM fotoimg where fotoimgid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/fotoimg', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
    const { images } = req.files;
    var rendom = Math.floor(Math.random() * 10000000);
    var img2 = rendom + images.name.slice(images.name.lastIndexOf('.'));

    images.mv(__dirname + '/public/' + img2);
    pool.query("insert into fotoimg (fotoid, images, syscreatedatutc) values ($1, $2, $3)",
        [body.fotoid,img2,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/fotoimg/:id', (req, res) => {
    pool.query("SELECT * FROM fotoimg where fotoimgid=$1", [req.params.id], (err, result) => {
      if (result.rows.length>0) {
        if (!err) {
            fs.unlink(`./public/${result.rows[0].images}`, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
        } else {
            res.status(400).send(err)
        }
      }
    })

    pool.query("DELETE FROM fotoimg WHERE fotoimgid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/fotoimg/:id', (req, res) => {
pool.query("SELECT * FROM fotoimg where fotoimgid=$1", [req.params.id], (err, result) => {
        const { images }=req.files
        if (result.rows.length>0) {
          if (!err){
              images.mv(__dirname + '/public/' + result.rows[0].images);
          } else {
              res.status(400).send(err)
          }
        }
      })
var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE fotoimg SET fotoid=$1 WHERE fotoimgid=$2`,
        [body.fotoid, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// help
app.get('/help', (req, res) => {
    pool.query("SELECT * FROM help", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/help/:id', (req, res) => {
    pool.query("SELECT * FROM help where helpid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/help', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
pool.query("insert into help (help_title,syscreatedatutc) values ($1, $2)",
        [body.help_title,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/help/:id', (req, res) => {
  
    pool.query("DELETE FROM help WHERE helpid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/help/:id', (req, res) => {

var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE help SET help_title=$1 WHERE helpid=$2`,
        [body.foto_title, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})


// helpimg
app.get('/helpimg', (req, res) => {
    pool.query("SELECT * FROM helpimg", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/helpimg/:id', (req, res) => {
    pool.query("SELECT * FROM helpimg where helpimgid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/helpimg', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
    const { images } = req.files;
    var rendom = Math.floor(Math.random() * 10000000);
    var img2 = rendom + images.name.slice(images.name.lastIndexOf('.'));

    images.mv(__dirname + '/public/' + img2);
    pool.query("insert into helpimg (helpid, images, syscreatedatutc) values ($1, $2, $3)",
        [body.helpid,img2,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/helpimg/:id', (req, res) => {
    pool.query("SELECT * FROM helpimg where helpimgid=$1", [req.params.id], (err, result) => {
      if (result.rows.length>0) {
        if (!err) {
            fs.unlink(`./public/${result.rows[0].images}`, function (err) {
                if (err && err.code == 'ENOENT') {
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });
        } else {
            res.status(400).send(err)
        }
      }
    })

    pool.query("DELETE FROM helpimg WHERE helpimgid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/helpimg/:id', (req, res) => {
pool.query("SELECT * FROM helpimg where helpimgid=$1", [req.params.id], (err, result) => {
        const { images }=req.files
        if (result.rows.length>0) {
          if (!err){
              images.mv(__dirname + '/public/' + result.rows[0].images);
          } else {
              res.status(400).send(err)
          }
        }
      })
var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE helpimg SET helpid=$1 WHERE helpimgid=$2`,
        [body.helpid, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})

// video
app.get('/video', (req, res) => {
    pool.query("SELECT * FROM video", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.get('/video/:id', (req, res) => {
    pool.query("SELECT * FROM video where videoid=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
app.post('/video', (req, res) => {
    const body = req.body
    var datenew = new Date().toISOString()
pool.query("insert into video (video_link,video_title,syscreatedatutc) values ($1, $2, $3)",
        [body.video_link,body.video_title,datenew], (err, result) => {
            if (!err) {
                res.status(201).send("Created")
            } else {
                res.status(400).send(err)
            }
        })
})
app.delete('/video/:id', (req, res) => {
  
    pool.query("DELETE FROM video WHERE videoid=$1", [req.params.id], (err, result) => {
        if (!err) {
            if (result.rowCount === 1) {
              
                res.status(200).send("Deleted")
            } else {
                res.status(400).send("Id not found")
            }
        } else {
            res.status(400).send(err)
        }
    })
})
app.put('/video/:id', (req, res) => {

var datenew = new Date().toISOString()
    const body = req.body
    pool.query(`UPDATE video SET video_link=$1,video_title=$3 WHERE videoid=$2`,
        [body.video_link,body.video_title, req.params.id], (err, result) => {
            if (!err) {
                if (result.rowCount === 1) {
                    res.status(200).send("Updated")
                } else {
                    res.status(400).send("Id not found")
                }
            } else {
                res.status(400).send(err)
            }
        })
})








app.listen(PORT, function () {
    console.log(`Listening to Port ${PORT}`);
});
