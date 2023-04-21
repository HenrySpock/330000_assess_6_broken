const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/', async (req, res, next) => {
  try {
    const results = await Promise.all(req.body.developers.map(async d => {
      const response = await axios.get(`https://api.github.com/users/${d}`); 
      return response;
    }));

    const out = results.map(({data: { login, bio }}) => ({ name: login, bio }));
 
    return res.send(out);
  } catch(err) {
    next(err);
  }
}); 

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
