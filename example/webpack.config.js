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