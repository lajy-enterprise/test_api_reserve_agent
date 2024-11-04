import type { BaseMessage } from "@langchain/core/messages";
import { type Reserve } from "./schemas/reserve_schema";
import { Annotation } from "@langchain/langgraph";

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y): BaseMessage[] => x.concat(y),
  }),
  confirm: Annotation<Boolean>,
  // reserveDetails: Annotation<Reserve>,
});

export default StateAnnotation;
