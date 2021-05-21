class NetlifyConfig {
  data() {
    return {
      permalink: "/admin/config.yml",
    };
  }

  render(data) {
    return `
backend:
  name: github
  repo: finiam/blog.finiam.com
squash_merges: true
publish_mode: editorial_workflow
media_folder: "static/images"
public_folder: "/images"
collections:
  - name: "blog"
    label: "Posts"
    folder: "site/blog"
    extension: "md"
    create: true
    slug: "{{title}}"
    fields:
      - { label: "Layout", name: "layout", widget: "hidden", default: "layouts/post.liquid" }
      - { label: "Tags", name: "tags", widget: "hidden", default: "post" }
      - { label: "Title", name: "title", widget: "string" }
      - label: "Author"
        name: "author"
        widget: "select"
        options: ${JSON.stringify(data["authors"])}
      - label: "Category"
        name: "category"
        widget: "select"
        options: ["design", "development", "team"]
      - { label: "Date", name: "date", widget: "datetime" }
      - { label: "Long Description", name: "long_description", widget: "text" }
      - label: "Metadata"
        name: "metadata"
        widget: "object"
        fields:
          - { label: "Image", name: "image", widget: "image" }
          - { label: "Image Alt Text", name: "image_alt", widget: "string" }
          - { label: "Description", name: "description", widget: "text" }
          - { label: "Keywords", name: "keywords", widget: "string" }
      - { label: "Body", name: "body", widget: "markdown" }
    `;
  }
}

module.exports = NetlifyConfig;
