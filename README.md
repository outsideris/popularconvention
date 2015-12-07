# Popular Convention on Github

analyzing code convention from github commits for [Github data challenge II](https://github.com/blog/1450-the-github-data-challenge-ii)

You can see [Here](http://sideeffect.kr/popularconvention/).

## Getting Started

    npm install
    $(npm bin)/bower install
    $(npm bin)/coffee server.coffee --nodejs
    open http://localhost:8020/popularconvention

## Tests

    npm run test
    $(npm bin)/grunt test

## Requirement
* Node.js
* CoffeeScript
* MongoDB 2.4 with MONGODB_HOST and MONGODB_PORT environment variables set (ex: `export MONGODB_HOST=127.0.0.1; export MONGODB_PORT=27017`)
* GitHub tokens (see https://github.com/settings/applications/new) - save to `github.json` in `.tokens` directory

## License
Copyright (c) 2013 "Outsider" Jeonghoon Byun  
Licensed under the MIT license.
