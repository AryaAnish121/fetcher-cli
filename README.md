
# fetcher-cli

A cli based app for http requests, it comes with features like `wait` and `loop`
## Installation

Install fetcher-cli with npm

```bash
  npm install fetcher-cli -g
```
    
## Usage/Examples

| 1. Create a file ending in `.http` \
| 2. Paste the code below

```javascript
--loop=2 GET https://jsonplaceholder.typicode.com/posts/1
# loop for 2 times and make a get request to https://jsonplaceholder.typicode.com/posts/1

WAIT 5000
# wait for 5 sec

POST https://jsonplaceholder.typicode.com/posts --header={'Content-type': 'application/json'} --body={title: 'foo', body: 'bar', userId: 1}
# make a post request to https://jsonplaceholder.typicode.com/posts/1
```
| 3. Run the code by typing `fetcher-cli filename.http` \
| 4. All the response will be in the `response.json` file
## Authors

- [@AryaAnish121](https://www.github.com/AryaAnish121)

