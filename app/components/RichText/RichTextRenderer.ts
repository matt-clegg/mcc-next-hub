import type { JSONContent } from "@tiptap/core";
import type { DefineComponent, VNode } from "vue";
import { NuxtImg, NuxtLink } from "#components";

interface Tag {
  tag: string;
  attrs?: Record<string, any>;
}

export interface NodeSchema {
// the output of the function should be a tag or an array of tags or a singleTag
  (node: JSONContent): any;
}

export interface MarkSchema {
  (node: JSONContent): any;
}
export interface RenderSchema {
  nodes: { [key: string]: NodeSchema };
  marks: { [key: string]: MarkSchema };
}

const pick = function (attrs: Record<string, any>, allowed: string[]) {
  const h = {} as Record<string, any>;

  for (const key in attrs) {
    const value = attrs[key];
    if (allowed.includes(key) && value !== null)
      h[key] = value;
  }
  return h;
};

const isEmailLinkType = (type: string) => type === "email";

const DefaultSchema: RenderSchema = {
  nodes: {

    horizontal_rule() {
      return {
        singleTag: "hr"
      };
    },
    blockquote() {
      return {
        tag: "blockquote"
      };
    },
    bulletList() {
      return {
        tag: "ul"
      };
    },
    code_block(node) {
      return {
        tag: [
          "pre",
          {
            tag: "code",
            attrs: node.attrs
          }
        ]
      };
    },
    hard_break() {
      return {
        singleTag: "br"
      };
    },
    heading(node) {
      return {
        tag: `h${node.attrs?.level}`
      };
    },
    image(node) {
      const attrs = node.attrs;
      if (!attrs)
        return null;

      return {
        singleTag: [
          {
            tag: "img",
            attrs: pick(attrs, ["src", "alt", "title"])
          }
        ]
      };
    },
    listItem() {
      return {
        tag: "li"
      };
    },
    orderedList() {
      return {
        tag: "ol"
      };
    },
    paragraph() {
      return {
        tag: "p"
      };
    }
  },
  marks: {
    bold() {
      return {
        tag: "b"
      };
    },
    strike() {
      return {
        tag: "strike"
      };
    },
    underline() {
      return {
        tag: "u"
      };
    },
    strong() {
      return {
        tag: "strong"
      };
    },
    code() {
      return {
        tag: "code"
      };
    },
    italic() {
      return {
        tag: "i"
      };
    },
    link(node) {
      const attrs = { ...node.attrs };
      const { linktype = "url" } = node.attrs;

      if (isEmailLinkType(linktype))
        attrs.href = `mailto:${attrs.href}`;

      if (attrs.anchor) {
        attrs.href = `${attrs.href}#${attrs.anchor}`;
        delete attrs.anchor;
      }

      return {
        tag: [
          {
            tag: "a",
            attrs
          }
        ]
      };
    },
    styled(node) {
      return {
        tag: [
          {
            tag: "span",
            attrs: node.attrs
          }
        ]
      };
    },
    subscript() {
      return {
        tag: "sub"
      };
    },
    superscript() {
      return {
        tag: "sup"
      };
    },
    anchor() {
      return {
        tag: "a"
      };
    },
    highlight() {
      return {
        tag: "mark"
      };
    },
    textStyle(node) {
      return {
        tag: [
          {
            tag: "span",
            attrs: node.attrs
          }
        ]
      };
    }
  }
};

type NodeType = keyof (typeof DefaultSchema.nodes);
type MarkType = keyof (typeof DefaultSchema.marks);

const TiptapRender: DefineComponent<{
  data: { type: PropType<JSONContent>; required: true };
  schema: { type: PropType<RenderSchema>; default: typeof DefaultSchema };
}> = defineComponent({
  name: "RichText",
  props: {
    data: { type: Object as PropType<JSONContent>, required: true },
    schema: { type: Object as PropType<RenderSchema>, required: false }
  },
  setup(props) {
    const schema = props.schema || DefaultSchema;

    return () => {
      if (props.data && Array.isArray(props.data.content)) {
        const results = props.data.content.map((node) => {
          // use NuxtImg for images
          if (node.type === "image") {
            return h(NuxtImg, {
              provider: "cloudinary",
              format: "webp",
              quality: 75,
              src: node.attrs.src,
              alt: node.attrs.alt,
              title: node.attrs.title,
              loading: "lazy",
              width: 700,
              sizes: "90vw md:570px lg:700px"
            });
          }

          // example component for a specific node type
          // if (node.type === "Example")
          //   return h(ExampleComponent, node.attrs);

          // for other nodes, render them using the schema
          return renderNode(node, schema);
        }).filter(node => !!node);

        return results;
      }

      return null;
    };
  }
});

function renderNode(item: JSONContent, schema: RenderSchema) {
  // node
  let node;

  // Convert data to standard schema
  const nodeSchema = schema.nodes[item.type as NodeType];
  if (typeof nodeSchema === "function")
    node = nodeSchema(item);

  // console.log(node)

  // // Single (non-wrapper) tags
  if (node && node.singleTag)
    return renderTag(node.singleTag, node.attrs);

  // Wrapper tag(s)
  if (node && node.tag) {
    const tag = node.tag;
    const content = item.content;
    return renderTag(tag, node.attrs, typeof content === "string" ? content : h(TiptapRender, { data: { content } as JSONContent, schema }));
  }

  // Text Node
  if (item.text) {
    // if there is no marks, return the text
    if (!item.marks || !item.marks.length)
      return item.text;

    // Build mark wrappers from the inside out
    return item.marks
      .map((mark) => {
        const node = schema.marks[mark.type as MarkType];

        if (typeof node === "function")
          return node(mark) ?? null;

        return null;
      })
      .filter(mark => !!mark)
      .reverse()
      .reduce((content: string | VNode, mark: Tag) => {
        return renderTag(mark.tag, mark.attrs, content);
      }, item.text);
  }

  return null;
}

function renderTag(tag: string | Array<string | Tag>, attrs?: Record<string, any>, content?: string | VNode) {
  if (Array.isArray(tag)) {
    // Array of single tags: reverse order and build from inside out.
    return tag.slice().reverse().reduce((innerNode: VNode | null | string, tagItem: string | Tag) => {
      if (typeof tagItem === "string") {
        return h(tagItem, undefined, [innerNode]);
      }

      else {
        if (tagItem.tag === "a")
          return h(NuxtLink, { ...tagItem.attrs }, () => [innerNode]);
        return h(tagItem.tag, tagItem.attrs, innerNode ? [innerNode] : undefined);
      }
    }, content ?? null);
  }
  else if (typeof tag === "string") {
    // Just a single tag name string
    return h(tag, attrs, content ? [content] : undefined);
  }

  return null;
}

export default TiptapRender;
