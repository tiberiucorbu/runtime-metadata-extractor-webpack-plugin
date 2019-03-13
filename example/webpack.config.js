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