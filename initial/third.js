import CeramicClient from "@ceramicnetwork/http-client";
const API_URL = "https://yourceramicnode.com";
const ceramic = async () => {
  const result = await new CeramicClient(API_URL);

  return result;
};
console.log(ceramic);
const streamId =
  "kjzl6cwe1jw147ww5d8pswh1hjh686mut8v1br10dar8l9a3n1wf8z38l0bg8qa";

const stream = async () => {
  console.log(ceramic);

  const result = await ceramic.loadStream(streamId);

  return result;
};

console.log(stream.id);
