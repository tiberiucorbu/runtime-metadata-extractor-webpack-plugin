# Runtime Metadata Extractor Webpack Plugin

A plugin that initializes on after emit a chromium instance, loads the asset and extracts metadata produced from the emitted asset.

This produces a similar output with the records but contains more meaningful infos. 

One can use this metadata to : 
    
- load bundles based their contents
- map your components to various packages in documents
- advance linting

### My TODO list :

- Find meaningfull names (names can change)
- Assert options
- Add types
- Run a browser instance per build and not per asset 

## How to use ? 

Install as a npm dependency
    
    npm i -D metadata-extractor-webpack-plugin


Attach the plugin to a webpack configuration (a file in your project maybe named `webpack.config.js`) : 

     const path = require('path');
     const MetadataExtractorWebpackPlugin = require('runtime-metadata-extractor-webpack-plugin');
     module.exports = function configure(environment, options) {
         return {
             entry: {
                 'dude': ['./index.js']
             },
             output: {
                 path: path.resolve('dist')
             },
             plugins: [
                 new MetadataExtractorWebpackPlugin({
                     outputFileName: 'some-other-dude.json',
                     captureInit: () => {
                         // this code is runs in browser, don't use `closure` :)
                         window.captures = {};
                         window.customElements.define = (componentName, componentClass) => {
                             window.captures[componentName] = componentClass;
                         };
     
                     },
                     captureExtract: () =>  {
                         // this code is runs in browser, don't use `closure` :)
                         return window.captures
                     }
                 })
             ]
     
         }
     };
run the command

    webpack --config webpack.config.js

assuming you have `webpack-cli` installed

And enjoy the results

## Example 

there is a working example under the `example` folder;

For a source that looks like this : 

    export function maybeDefine(name, clazz) {
        window.customElements.define(name, clazz);
    }
    
    class SomeStuff extends HTMLElement {
    
    }
    
    class SomeOtherStuff extends HTMLElement {
    
    }
    
    maybeDefine('some-stuff', SomeStuff);
    maybeDefine('some-other-stuff', SomeOtherStuff);
    
produces a json that contains : 

    {
      "assets": [
        {
          "asset": [
            "dude.js"
          ],
          "elements": {
            "some-stuff": {},
            "some-other-stuff": {}
          }
        }
      ],
      "packageId": "@PB/arbitrary-require-webpack-plugin-example"
    }    
    



## For the hackers

Did you knew that the url can be actualy a whole page: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
    
