const DEFENCES = [
  {
    name: "character limit",
    id: "CHARACTER_LIMIT",
    info: "limit the number of characters in the user input. this is a form of prompt validation.",
  },
  {
    name: "random sequence enclosure",
    id: "RANDOM_SEQUENCE_ENCLOSURE",
    info: "enclose the prompt between a random string and instruct bot to only follow enclosed instructions. this is a form of prompt validation.",
  },
  {
    name: "xml tagging",
    id: "XML_TAGGING",
    info: "enclose the users prompt between <user_input> tags and escapes xml characters in raw input. this is a form of prompt validation.",
  },
  {
    name: "email whitelist",
    id: "EMAIL_WHITELIST",
    info: "only allow emails to those on a whitelist. they can be full email addresses, or domains in the format '*@scottlogic.com'",
    isActive: false,
    isTriggered: false,
  }
];

export default DEFENCES;
