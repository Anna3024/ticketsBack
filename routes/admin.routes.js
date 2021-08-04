const {Router} = require('express')

const database = require('../firebase')

const router = Router()

// /api/admin/showusers

router.get('/showusers', async (req, res) => {
    try {
      let users = [];
      await database.collection('users').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          users.push({id: doc.id, data: doc.data()})
        })})
      res.status(201).json(users)
    } catch (error) {
      console.log("Error getting document:", error);
      res.status(500).json({ message: 'Ошибка получения данных' })
    }
})

// /api/admin/addadmin
router.post('/addadmin', async (req, res) => {
  try {
    await database.collection('users').where("email", "==", req.body.email).get()
    .then((querySnapshot) => {
      if (querySnapshot.docs.length==0) {
        res.status(400).json({ message: 'Пользователя с таким e-mail не существует' })
      } else {
        querySnapshot.forEach(async (doc) => {
          if (doc.data().role=="admin") {
            res.status(400).json({ message: 'Пользователь с указанным e-mail уже является админом' })
          }
          await doc.ref.update({role: "admin"})
          res.status(201).json({data: 'ok'})
        });
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка при добавлении админа' })
  }
})

// /api/admin/addMovie
router.post('/addMovie', async (req, res) => {
  try {
    let data = await database.collection('movies').where("movieTitle", "==", req.body.movieTitle).get()

    if (data.docs.length>0) {
      res.status(400).json({ message: 'Фильм с таким названием уже добавлен в базу' })
      return
    }
  
    await database.collection('movies').add(req.body)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      res.status(201).json({data: docRef.id})
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    // res.status(201).json({data: 'ok'})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка при добавлении фильма' })
  }
})


module.exports = router