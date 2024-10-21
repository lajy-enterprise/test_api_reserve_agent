const state = [
  {
    lc: 1,
    type: "constructor",
    id: ["langchain_core", "messages", "HumanMessage"],
    kwargs: {
      content: "quiero reservar un turno para crossfit",
      additional_kwargs: {},
      response_metadata: {},
    },
  },
  {
    lc: 1,
    type: "constructor",
    id: ["langchain_core", "messages", "AIMessageChunk"],
    kwargs: {
      content:
        "Claro, puedo ayudarte con eso. Necesito algunos detalles:\n\n1. Tu nombre completo.\n2. Tu DNI.\n3. La hora del turno que deseas reservar (en punto, por ejemplo, '10:00' o '11:00').\n\nPor favor, proporciona esta información para proceder con la reserva.",
      additional_kwargs: {},
      response_metadata: {
        usage: {
          prompt_tokens: 235,
          completion_tokens: 64,
          total_tokens: 299,
          prompt_tokens_details: { cached_tokens: 0 },
          completion_tokens_details: { reasoning_tokens: 0 },
        },
      },
      tool_call_chunks: [],
      id: "chatcmpl-AJYgmYhWVkNKnexjISur8JJvPeTIG",
      usage_metadata: {
        input_tokens: 235,
        output_tokens: 64,
        total_tokens: 299,
      },
      tool_calls: [],
      invalid_tool_calls: [],
    },
  },
];

const stateBeforeInterrupt = [
  {
    lc: 1,
    type: "constructor",
    id: ["langchain_core", "messages", "HumanMessage"],
    kwargs: {
      content: "mariano 325 11:00",
      additional_kwargs: {},
      response_metadata: {},
    },
  },
  {
    lc: 1,
    type: "constructor",
    id: ["langchain_core", "messages", "AIMessageChunk"],
    kwargs: {
      content: "",
      additional_kwargs: {
        tool_calls: [
          {
            index: 0,
            id: "call_HX4aLtoRqR1Vz4By8tkvDWrD",
            type: "function",
            function: {
              name: "reservacion_de_turno_para_crossfit",
              arguments: '{"nombre":"mariano","dni":"325","turn":"11:00"}',
            },
          },
        ],
      },
      response_metadata: {
        usage: {
          prompt_tokens: 235,
          completion_tokens: 32,
          total_tokens: 267,
          prompt_tokens_details: { cached_tokens: 0 },
          completion_tokens_details: { reasoning_tokens: 0 },
        },
      },
      tool_call_chunks: [
        {
          name: "reservacion_de_turno_para_crossfit",
          args: '{"nombre":"mariano","dni":"325","turn":"11:00"}',
          id: "call_HX4aLtoRqR1Vz4By8tkvDWrD",
          index: 0,
          type: "tool_call_chunk",
        },
      ],
      id: "chatcmpl-AJYhwCiwYNKYZHyEmFH0EEyheBiy1",
      usage_metadata: {
        input_tokens: 235,
        output_tokens: 32,
        total_tokens: 267,
      },
      tool_calls: [
        {
          name: "reservacion_de_turno_para_crossfit",
          args: { nombre: "mariano", dni: "325", turn: "11:00" },
          id: "call_HX4aLtoRqR1Vz4By8tkvDWrD",
          type: "tool_call",
        },
      ],
      invalid_tool_calls: [],
    },
  },
];
