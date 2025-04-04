import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

import RichTextFileDownloader from "./RichTextFileDownloader.vue";

export default Node.create({
  name: "vueComponent",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      fileUrl: { default: "" },
      fileType: { default: "" },
      fileName: { default: "" },
      fileSize: { default: "" }
    };
  },

  parseHTML() {
    return [
      {
        tag: "file-download"
      }
    ];
  },

  addCommands() {
    return {
      insertFileDownload:
          (attrs: {
            fileUrl: string;
            fileType: string;
            fileName: string;
            fileSize: string;
          }) =>
            ({ chain }) => {
              return chain()
                .focus()
                .insertContent({
                  type: "vueComponent",
                  attrs
                })
                .run();
            }
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["file-download", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(RichTextFileDownloader);
  }
});
