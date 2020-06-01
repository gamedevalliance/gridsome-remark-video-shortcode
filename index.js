const visit = require('unist-util-visit');

module.exports = function attacher(options = {}) {
    const transformer = this.data('transformer')

    return async function transform(tree, file, callback) {
        const shortcodes = []

        visit(tree, 'shortcode', node => shortcodes.push(node))

        for (const node of shortcodes) {
            if (node.identifier === "Video") {
                const path = file.data.node
                    ? transformer.resolveNodeFilePath(file.data.node, node.attributes.src)
                    : node.attributes.src

                try {
                    const asset = await transformer.assets.add(path)
                    node.attributes.src = asset.src
                } catch (err) {
                    callback(err)
                    return
                }

                standaloneAttr = Object.keys(node.attributes).filter(attribute => !["src", "poster"].includes(attribute));

                var posterAttr = "";
                if (Object.keys(node.attributes).includes("poster")) {
                    var posterAttr = `poster="${node.attributes.poster}"`
                }

                node.type = 'html';
                node.value =
                    `<video ${standaloneAttr.join(" ")} ${posterAttr}>
                    <source type="video/mp4" src="${node.attributes.src}"></source>
                </video>`
            }
        }

        callback()
    }
}