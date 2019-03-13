const puppeteer = require('puppeteer');
const path = require('path');
const crypto = require('crypto')

class MetadataExtractorWebpackPlugin {

    constructor(options) {
        this.options = options;
    }

    async captureCustomElements(asset) {
        const source = asset.source();
        await this.page.goto(`data:text/html,<script>${source}</script>`, {waitUntil: 'networkidle2'});
        const customElements = await this.page.evaluate(this.options.captureExtract);
        return customElements;
    }

    async captureCutomElements(assets) {
        const keys = Object.keys(assets);
        const results = [];
        for (const key of keys) {
            await this.before();
            const asset = assets[key];
            const customElements = await this.captureCustomElements(asset);
            if (Object.keys(customElements).length) {
                results.push({asset: keys, elements: customElements});
            }
            await this.after()
        }
        return results;
    }

    resolvePackage(compilation) {
        const packagePath = path.resolve(compilation.options.context, 'package.json');
        const packageContents = require(packagePath);
        return packageContents.name
    }


    async before() {
        this.content = '';
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        this.page.evaluateOnNewDocument(this.options.captureInit);
    };

    async apply(compiler) {

        compiler.hooks.afterEmit.tapAsync('runtime-metadata-extractor-plugin', async (compilation, callback) => {

            const elementsMapping = await this.captureCutomElements(compilation.assets);
            if (elementsMapping.length) {
                const extractedMetadata = {assets: elementsMapping, packageId: this.resolvePackage(compilation)};
                this.content = JSON.stringify(extractedMetadata);
                const resultCompilation = compiler.createCompilation();
                this.hasher = crypto.createHash('md5');
                this.hasher.update(this.content);
                resultCompilation.assets = {
                    [this.options.outputFileName]: {
                        content: this.content,
                        hash: this.hasher.digest('hex'),
                        size: this.content.length,
                        source: () => this.content
                    }
                };

                compiler.emitAssets(resultCompilation, callback);
            }
        });
    }

    async after() {
        await this.browser.close();
    };

}


module.exports = MetadataExtractorWebpackPlugin;