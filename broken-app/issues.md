# Broken App Issues
1. npm install express

2. npm install axios

3. Update the app.listen(3000) to include a console.log for my own benefit.

4. Let's get ride of the 'let' and 'var' declarations for axios and app: 
const axios = require('axios');
const app = express();

5. Pass 'err' into the error block:   } catch(err) {
6. Add app.use(express.json()); so the POST and response are valid JSON.
7. The function call has an axios.get call but 'async' isn't declared.
Adding 'async' to the function passed in the route definition:
app.post('/', async function(req, res, next) { 
I'll use curl commands to try and get the expected output:

curl --header "Content-Type: application/json" --request POST --data '{"developers": ["joelburton", "elie"]}' http://localhost:3000/

8. Now we're getting an async function call on the post route, but the response 'Cannot read properties of undefined (reading 'name'). Looking at these two lines:
    let results = await axios.get(req.body.developers.map(async d => {
      return (`https://api.github.com/users/${d}`);
It's setting results to information from the call to 'results', but there isn't an 'await axios.get' call until the return, so results is set something that doesn't exist yet. Let's move the 'await axios.get' inside the results declaration:
  try {
    let results = await axios.get(req.body.developers.map(async d => {
      return (`https://api.github.com/users/${d}`);
    }));
9. This gives an ECONNREFUSED error and trying to log results gives an empty reply from the server. So we need to wait (await) for the server to return the call(s) to (`https://api.github.com/users/${d}`);, which means setting that to a variable and returning that variable:
  try {
    let results = await axios.get(req.body.developers.map(async d => {
      const response = await axios.get(`https://api.github.com/users/${d}`);
      return response;
    }));
10. This still gives an ECONNREFUSED error, but we have a response variable we can at least look at:
      console.log(response);
11. We're still getting an ECONNREFUSED error, *but* we do see the response object, and scrolling through it we find the two objects for the joelburton and elie - and they are located in 'data' keys. So, what's probably happening is we have an axios.get inside an axios.get which is looking for 4 pieces of information (name and bio for 2 people), and this may be pinging the server too many times. Let's try a Promise.all() instead of the outer axios.get (and change the console.log to the data key):
app.post('/', async function(req, res, next) {
  try {
    let results = await Promise.all(req.body.developers.map(async d => {
      const response = await axios.get(`https://api.github.com/users/${d}`);
      console.log(response.data);
      return response;
    }));
12. Whoa... ok. No more ECONNREFUSED error, and we're getting our response.data objects:
Server is listening on port 3000
{
  login: 'elie',
  id: 5502107,
  node_id: 'MDQ6VXNlcjU1MDIxMDc=',
  avatar_url: 'https://avatars.githubusercontent.com/u/5502107?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/elie',
  html_url: 'https://github.com/elie',
  followers_url: 'https://api.github.com/users/elie/followers',
  following_url: 'https://api.github.com/users/elie/following{/other_user}',
  gists_url: 'https://api.github.com/users/elie/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/elie/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/elie/subscriptions',
  organizations_url: 'https://api.github.com/users/elie/orgs',
  repos_url: 'https://api.github.com/users/elie/repos',
  events_url: 'https://api.github.com/users/elie/events{/privacy}',
  received_events_url: 'https://api.github.com/users/elie/received_events',
  type: 'User',
  site_admin: false,
  name: 'Elie Schoppik',
  company: '@rithmschool ',
  blog: 'https://www.rithmschool.com',
  location: 'United States',
  email: null,
  hireable: null,
  bio: 'Co-founder + Lead Instructor @rithmschool ',
  twitter_username: 'eschoppik',
  public_repos: 84,
  public_gists: 9,
  followers: 232,
  following: 0,
  created_at: '2013-09-20T13:54:10Z',
  updated_at: '2023-03-03T12:20:29Z'
}
{
  login: 'joelburton',
  id: 1178518,
  node_id: 'MDQ6VXNlcjExNzg1MTg=',
  avatar_url: 'https://avatars.githubusercontent.com/u/1178518?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/joelburton',
  html_url: 'https://github.com/joelburton',
  followers_url: 'https://api.github.com/users/joelburton/followers',
  following_url: 'https://api.github.com/users/joelburton/following{/other_user}',
  gists_url: 'https://api.github.com/users/joelburton/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/joelburton/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/joelburton/subscriptions',
  organizations_url: 'https://api.github.com/users/joelburton/orgs',
  repos_url: 'https://api.github.com/users/joelburton/repos',
  events_url: 'https://api.github.com/users/joelburton/events{/privacy}',
  received_events_url: 'https://api.github.com/users/joelburton/received_events',
  type: 'User',
  site_admin: false,
  name: 'Joel Burton',
  company: 'VP of Education, RithmSchool',
  blog: 'http://joelburton.com/',
  location: 'San Francisco, California',
  email: null,
  hireable: true,
  bio: 'Open source developer. Former dev at Apple, Planned Parenthood, Zana. Former VP of Ed at Hackbright. Python, JS, design, cats, tea, but not always in that order',
  twitter_username: 'wjoelburton',
  public_repos: 186,
  public_gists: 41,
  followers: 160,
  following: 88,
  created_at: '2011-11-07T17:25:45Z',
  updated_at: '2023-03-02T17:15:15Z'
}

Let's log just the name and bio:
      console.log(response.data.name);
      console.log(response.data.bio);
13. Ok... This is something:
Server is listening on port 3000
Elie Schoppik
Co-founder + Lead Instructor @rithmschool
Joel Burton
Open source developer. Former dev at Apple, Planned Parenthood, Zana. Former VP of Ed at Hackbright. Python, JS, design, cats, tea, but not always in that order

But the name output isn't quite what is expected from the exercise. Looking at the object, the expected name ouptut is located under 'login', not 'name.'
      console.log(response.data.login);
      console.log(response.data.bio);
So we would change the output:
    let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));
14. I think this is it. Here's the terminal output:
elie
Co-founder + Lead Instructor @rithmschool
joelburton
Open source developer. Former dev at Apple, Planned Parenthood, Zana. Former VP of Ed at Hackbright. Python, JS, design, cats, tea, but not always in that order

And here is how that is mapped in the function output:
[{"name":"joelburton","bio":"Open source developer. Former dev at Apple, Planned Parenthood, Zana. Former VP of Ed at Hackbright. Python, JS, design, cats, tea, but not always in that order"},{"name":"elie","bio":"Co-founder + Lead Instructor @rithmschool "}]

If I do that with jq:
kodai@Yamato:~/springex/330000_assess_6_broken/broken-app$ curl --header "Content-Type: application/json" --request POST --data '{"developers": ["joelburton", "elie"]}' http://localhost:3000/| jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   297  100   259  100    38   1281    188 --:--:-- --:--:-- --:--:--  1477
[
  {
    "name": "joelburton",
    "bio": "Open source developer. Former dev at Apple, Planned Parenthood, Zana. Former VP of Ed at Hackbright. Python, JS, design, cats, tea, but not always in that order"
  },
  {
    "name": "elie",
    "bio": "Co-founder + Lead Instructor @rithmschool "
  }
]

15. Refactoring
Change the async function call to an arrow function:
app.post('/', async (req, res, next) => {

Changing the results variable to a const declaration:
   const results = await Promise.all(req.body.developers.map(async d => {

Change the out from let to const:
    const out = results.map(r => ({ name: r.data.login, bio: r.data.bio }));

Destructure out:
    let out = results.map(({data: { login, bio }}) => ({ name: login, bio }));

res.send and JSON.stringify are redundant:
    return res.send(out);
