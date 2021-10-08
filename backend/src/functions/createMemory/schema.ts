export default {
  type: "object",
  properties: {
    title: { type: "string" },
    caption: { type: "string" },
    location: { type: "string" },
    feeling: { type: "string" },
  },
  required: ["title", "caption", "location", "feeling"],
} as const;
