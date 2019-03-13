# Runtime Metadata Extractor Webpack Plugin

A plugin that initializes on after emit a chrome instance, loads the asset and extracts metadata produced from the emitted asset.

This produces a similar output with the records but contains more meaningful infos. 

Currently in the alpha phase it extracts the defined custom elements.

## Disclaimer

**This is my first ever webpack plugin, and I know, it needs some polishing**

## How to use 

Install as a npm dependency
    
    npm i -D metadata-extractor-webpack-plugin


Attach the plugin to the webpack configuration : 

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
                new MetadataExtractorWebpackPlugin()
            ]
    
        }
    };

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
    

there is a working example under the example folder;

