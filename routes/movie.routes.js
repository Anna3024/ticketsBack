const {Router} = require('express')

const database = require('../firebase')

const router = Router()

// /api/movie/getAllMovies

router.get('/getAllMovies', async (req, res) => {
  try {
    let movies = [];
    await database.collection('movies').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        movies.push({id: doc.id, data: doc.data()})
      })})
    res.status(201).json(movies)

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка при получении данных' })
  }
})

// /api/movie/delMovie

router.post('/delMovie', async (req, res) => {
  try {
    await database.collection('movies').doc(req.body.id).delete()
    .then(() => {
      res.status(201).json({data: "ok"})
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка при удалении элемента' })
  }
})

// /api/movie/changeMovie

router.post('/changeMovie', async (req, res) => {
  try {
    await database.collection('movies').doc(req.body.id).update(req.body.form)
  .then(() => {
      console.log("Document successfully updated!");
      res.status(201).json({data: "ok"})
  })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка при изменении данных' })
  }
})

module.exports = router