import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default async function(eleventyConfig) {
    // plugins
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);

    // copy files that are not content (images, CSS, ...)
    eleventyConfig.addPassthroughCopy({ "node_modules/picnic/picnic.min.css": "/"});
    eleventyConfig.addPassthroughCopy({ "node_modules/prismjs/themes/prism-tomorrow.min.css": "/"});
    eleventyConfig.addPassthroughCopy("img/*");
    eleventyConfig.addPassthroughCopy("custom.css");

    // files market with "draft: true" in the frontmatter are excluded in the prod build
    eleventyConfig.addPreprocessor("drafts", "*", (data, _) => {
		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

    // shortcodes
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
};

