import type { BaseMessage } from '@langchain/core/messages'
import { Annotation } from '@langchain/langgraph'
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y): BaseMessage[] => x.concat(y),
  }),
  confirm: Annotation<boolean>,
})

export default StateAnnotation
