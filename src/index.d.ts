declare module 'runtime-metadata-extractor-webpack-plugin' {


    interface MetadataExtractorWebpackPluginOptions {
        outputFileName: string;
        captureInit : Function;
        captureExtract : Function;
    }

    export class MetadataExtractorWebpackPlugin {
        constructor(options: MetadataExtractorWebpackPluginOptions);
    }
}