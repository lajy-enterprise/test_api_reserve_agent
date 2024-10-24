const currentState = {
  values: {
    messages: [
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "HumanMessage"],
        kwargs: {
          content:
            "Quiero reservar un turno para crossfit a las 10 am el martes",
          additional_kwargs: {},
          response_metadata: {},
        },
      },
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "AIMessage"],
        kwargs: {
          lc_serializable: true,
          lc_kwargs: {
            lc_serializable: true,
            lc_kwargs: {
              content:
                "Para ayudarte con la reserva, primero verificaré la disponibilidad para la clase de crossfit el martes a las 10 am. Un momento, por favor.",
              tool_calls: [
                {
                  name: "consulta_disponibilidad_de_turno",
                  args: { day: "martes", activityQuery: "crossfit" },
                  type: "tool_call",
                  id: "call_VPDauPXo00nOiqrpEKPivhB8",
                },
              ],
              invalid_tool_calls: [],
              additional_kwargs: {
                tool_calls: [
                  {
                    id: "call_VPDauPXo00nOiqrpEKPivhB8",
                    type: "function",
                    function: {
                      name: "consulta_disponibilidad_de_turno",
                      arguments: '{"day":"martes","activityQuery":"crossfit"}',
                    },
                  },
                ],
              },
              response_metadata: {
                usage: {
                  prompt_tokens: 254,
                  completion_tokens: 58,
                  total_tokens: 312,
                  prompt_tokens_details: { cached_tokens: 0 },
                  completion_tokens_details: { reasoning_tokens: 0 },
                },
                system_fingerprint: "fp_90354628f2",
              },
              id: "chatcmpl-AM1UlKB8lCiyEufqNnVjbxY7Kqlvg",
            },
            lc_namespace: ["langchain_core", "messages"],
            content:
              "Para ayudarte con la reserva, primero verificaré la disponibilidad para la clase de crossfit el martes a las 10 am. Un momento, por favor.",
            additional_kwargs: {
              tool_calls: [
                {
                  id: "call_VPDauPXo00nOiqrpEKPivhB8",
                  type: "function",
                  function: {
                    name: "consulta_disponibilidad_de_turno",
                    arguments: '{"day":"martes","activityQuery":"crossfit"}',
                  },
                },
              ],
            },
            response_metadata: {
              usage: {
                prompt_tokens: 254,
                completion_tokens: 58,
                total_tokens: 312,
                prompt_tokens_details: { cached_tokens: 0 },
                completion_tokens_details: { reasoning_tokens: 0 },
              },
              system_fingerprint: "fp_90354628f2",
            },
            id: "chatcmpl-AM1UlKB8lCiyEufqNnVjbxY7Kqlvg",
            tool_calls: [
              {
                name: "consulta_disponibilidad_de_turno",
                args: { day: "martes", activityQuery: "crossfit" },
                type: "tool_call",
                id: "call_VPDauPXo00nOiqrpEKPivhB8",
              },
            ],
            invalid_tool_calls: [],
            usage_metadata: {
              output_tokens: 58,
              input_tokens: 254,
              total_tokens: 312,
              input_token_details: { cache_read: 0 },
              output_token_details: { reasoning: 0 },
            },
          },
          lc_namespace: ["langchain_core", "messages"],
          content:
            "Para ayudarte con la reserva, primero verificaré la disponibilidad para la clase de crossfit el martes a las 10 am. Un momento, por favor.",
          additional_kwargs: {
            tool_calls: [
              {
                id: "call_VPDauPXo00nOiqrpEKPivhB8",
                type: "function",
                function: {
                  name: "consulta_disponibilidad_de_turno",
                  arguments: '{"day":"martes","activityQuery":"crossfit"}',
                },
              },
            ],
          },
          response_metadata: {
            tokenUsage: {
              promptTokens: 254,
              completionTokens: 58,
              totalTokens: 312,
            },
            finish_reason: "tool_calls",
            usage: {
              prompt_tokens: 254,
              completion_tokens: 58,
              total_tokens: 312,
              prompt_tokens_details: { cached_tokens: 0 },
              completion_tokens_details: { reasoning_tokens: 0 },
            },
            system_fingerprint: "fp_90354628f2",
          },
          id: "chatcmpl-AM1UlKB8lCiyEufqNnVjbxY7Kqlvg",
          tool_calls: [
            {
              name: "consulta_disponibilidad_de_turno",
              args: { day: "martes", activityQuery: "crossfit" },
              type: "tool_call",
              id: "call_VPDauPXo00nOiqrpEKPivhB8",
            },
          ],
          invalid_tool_calls: [],
          usage_metadata: {
            output_tokens: 58,
            input_tokens: 254,
            total_tokens: 312,
            input_token_details: { cache_read: 0 },
            output_token_details: { reasoning: 0 },
          },
        },
      },
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "ToolMessage"],
        kwargs: {
          content:
            '[{"07:00":true},{"08:00":true},{"09:00":true},{"10:00":true},{"11:00":true},{"15:00":true},{"16:00":true},{"17:00":true},{"18:00":true},{"19:00":true},{"20:00":true},{"21:00":true}]',
          tool_call_id: "call_VPDauPXo00nOiqrpEKPivhB8",
          name: "consulta_disponibilidad_de_turno",
          additional_kwargs: {},
          response_metadata: {},
        },
      },
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "AIMessage"],
        kwargs: {
          lc_serializable: true,
          lc_kwargs: {
            lc_serializable: true,
            lc_kwargs: {
              content:
                "El turno para crossfit a las 10 am el martes está disponible. Por favor, proporciona tu DNI para completar la reserva.",
              tool_calls: [],
              invalid_tool_calls: [],
              additional_kwargs: {},
              response_metadata: {
                usage: {
                  prompt_tokens: 367,
                  completion_tokens: 27,
                  total_tokens: 394,
                  prompt_tokens_details: { cached_tokens: 0 },
                  completion_tokens_details: { reasoning_tokens: 0 },
                },
                system_fingerprint: "fp_90354628f2",
              },
              id: "chatcmpl-AM1UnX3ECR8dUaoBrIfSfmF6aK0Gj",
            },
            lc_namespace: ["langchain_core", "messages"],
            content:
              "El turno para crossfit a las 10 am el martes está disponible. Por favor, proporciona tu DNI para completar la reserva.",
            additional_kwargs: {},
            response_metadata: {
              usage: {
                prompt_tokens: 367,
                completion_tokens: 27,
                total_tokens: 394,
                prompt_tokens_details: { cached_tokens: 0 },
                completion_tokens_details: { reasoning_tokens: 0 },
              },
              system_fingerprint: "fp_90354628f2",
            },
            id: "chatcmpl-AM1UnX3ECR8dUaoBrIfSfmF6aK0Gj",
            tool_calls: [],
            invalid_tool_calls: [],
            usage_metadata: {
              output_tokens: 27,
              input_tokens: 367,
              total_tokens: 394,
              input_token_details: { cache_read: 0 },
              output_token_details: { reasoning: 0 },
            },
          },
          lc_namespace: ["langchain_core", "messages"],
          content:
            "El turno para crossfit a las 10 am el martes está disponible. Por favor, proporciona tu DNI para completar la reserva.",
          additional_kwargs: {},
          response_metadata: {
            tokenUsage: {
              promptTokens: 367,
              completionTokens: 27,
              totalTokens: 394,
            },
            finish_reason: "stop",
            usage: {
              prompt_tokens: 367,
              completion_tokens: 27,
              total_tokens: 394,
              prompt_tokens_details: { cached_tokens: 0 },
              completion_tokens_details: { reasoning_tokens: 0 },
            },
            system_fingerprint: "fp_90354628f2",
          },
          id: "chatcmpl-AM1UnX3ECR8dUaoBrIfSfmF6aK0Gj",
          tool_calls: [],
          invalid_tool_calls: [],
          usage_metadata: {
            output_tokens: 27,
            input_tokens: 367,
            total_tokens: 394,
            input_token_details: { cache_read: 0 },
            output_token_details: { reasoning: 0 },
          },
        },
      },
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "HumanMessage"],
        kwargs: {
          content: "21123456",
          additional_kwargs: {},
          response_metadata: {},
        },
      },
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "AIMessage"],
        kwargs: {
          lc_serializable: true,
          lc_kwargs: {
            lc_serializable: true,
            lc_kwargs: {
              content: "",
              tool_calls: [
                {
                  name: "addReserveTurn",
                  args: {
                    dni: "21123456",
                    dia: "martes",
                    hora: "10:00",
                    activity: "crossfit",
                    confirm: true,
                  },
                  type: "tool_call",
                  id: "call_tQqWR4Dz9eUqQeaYboSXshHr",
                },
              ],
              invalid_tool_calls: [],
              additional_kwargs: {
                tool_calls: [
                  {
                    id: "call_tQqWR4Dz9eUqQeaYboSXshHr",
                    type: "function",
                    function: {
                      name: "addReserveTurn",
                      arguments:
                        '{"dni":"21123456","dia":"martes","hora":"10:00","activity":"crossfit"}',
                    },
                  },
                ],
              },
              response_metadata: {
                usage: {
                  prompt_tokens: 404,
                  completion_tokens: 32,
                  total_tokens: 436,
                  prompt_tokens_details: { cached_tokens: 0 },
                  completion_tokens_details: { reasoning_tokens: 0 },
                },
                system_fingerprint: "fp_90354628f2",
              },
              id: "chatcmpl-AM1VNmENQhJeppklbKgYI4psgeqGk",
            },
            lc_namespace: ["langchain_core", "messages"],
            content: "",
            additional_kwargs: {
              tool_calls: [
                {
                  id: "call_tQqWR4Dz9eUqQeaYboSXshHr",
                  type: "function",
                  function: {
                    name: "addReserveTurn",
                    arguments:
                      '{"dni":"21123456","dia":"martes","hora":"10:00","activity":"crossfit"}',
                  },
                },
              ],
            },
            response_metadata: {
              usage: {
                prompt_tokens: 404,
                completion_tokens: 32,
                total_tokens: 436,
                prompt_tokens_details: { cached_tokens: 0 },
                completion_tokens_details: { reasoning_tokens: 0 },
              },
              system_fingerprint: "fp_90354628f2",
            },
            id: "chatcmpl-AM1VNmENQhJeppklbKgYI4psgeqGk",
            tool_calls: [
              {
                name: "addReserveTurn",
                args: {
                  dni: "21123456",
                  dia: "martes",
                  hora: "10:00",
                  activity: "crossfit",
                  confirm: true,
                },
                type: "tool_call",
                id: "call_tQqWR4Dz9eUqQeaYboSXshHr",
              },
            ],
            invalid_tool_calls: [],
            usage_metadata: {
              output_tokens: 32,
              input_tokens: 404,
              total_tokens: 436,
              input_token_details: { cache_read: 0 },
              output_token_details: { reasoning: 0 },
            },
          },
          lc_namespace: ["langchain_core", "messages"],
          content: "",
          additional_kwargs: {
            tool_calls: [
              {
                id: "call_tQqWR4Dz9eUqQeaYboSXshHr",
                type: "function",
                function: {
                  name: "addReserveTurn",
                  arguments:
                    '{"dni":"21123456","dia":"martes","hora":"10:00","activity":"crossfit"}',
                },
              },
            ],
          },
          response_metadata: {
            tokenUsage: {
              promptTokens: 404,
              completionTokens: 32,
              totalTokens: 436,
            },
            finish_reason: "tool_calls",
            usage: {
              prompt_tokens: 404,
              completion_tokens: 32,
              total_tokens: 436,
              prompt_tokens_details: { cached_tokens: 0 },
              completion_tokens_details: { reasoning_tokens: 0 },
            },
            system_fingerprint: "fp_90354628f2",
          },
          id: "chatcmpl-AM1VNmENQhJeppklbKgYI4psgeqGk",
          tool_calls: [
            {
              name: "addReserveTurn",
              args: {
                dni: "21123456",
                dia: "martes",
                hora: "10:00",
                activity: "crossfit",
                confirm: true,
              },
              type: "tool_call",
              id: "call_tQqWR4Dz9eUqQeaYboSXshHr",
            },
          ],
          invalid_tool_calls: [],
          usage_metadata: {
            output_tokens: 32,
            input_tokens: 404,
            total_tokens: 436,
            input_token_details: { cache_read: 0 },
            output_token_details: { reasoning: 0 },
          },
        },
      },
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "ToolMessage"],
        kwargs: {
          content: '{\n  "message": "Turno agregado con exito"\n}',
          tool_call_id: "call_tQqWR4Dz9eUqQeaYboSXshHr",
          name: "addReserveTurn",
          additional_kwargs: {},
          response_metadata: {},
        },
      },
      {
        lc: 1,
        type: "constructor",
        id: ["langchain_core", "messages", "AIMessage"],
        kwargs: {
          lc_serializable: true,
          lc_kwargs: {
            lc_serializable: true,
            lc_kwargs: {
              content:
                "Tu turno para crossfit a las 10 am el martes ha sido reservado con éxito. ¡Disfruta de tu entrenamiento!",
              tool_calls: [],
              invalid_tool_calls: [],
              additional_kwargs: {},
              response_metadata: {
                usage: {
                  prompt_tokens: 463,
                  completion_tokens: 27,
                  total_tokens: 490,
                  prompt_tokens_details: { cached_tokens: 0 },
                  completion_tokens_details: { reasoning_tokens: 0 },
                },
                system_fingerprint: "fp_90354628f2",
              },
              id: "chatcmpl-AM1VQjtqFZ0UcZnoOb7Ejf6j4EoZ8",
            },
            lc_namespace: ["langchain_core", "messages"],
            content:
              "Tu turno para crossfit a las 10 am el martes ha sido reservado con éxito. ¡Disfruta de tu entrenamiento!",
            additional_kwargs: {},
            response_metadata: {
              usage: {
                prompt_tokens: 463,
                completion_tokens: 27,
                total_tokens: 490,
                prompt_tokens_details: { cached_tokens: 0 },
                completion_tokens_details: { reasoning_tokens: 0 },
              },
              system_fingerprint: "fp_90354628f2",
            },
            id: "chatcmpl-AM1VQjtqFZ0UcZnoOb7Ejf6j4EoZ8",
            tool_calls: [],
            invalid_tool_calls: [],
            usage_metadata: {
              output_tokens: 27,
              input_tokens: 463,
              total_tokens: 490,
              input_token_details: { cache_read: 0 },
              output_token_details: { reasoning: 0 },
            },
          },
          lc_namespace: ["langchain_core", "messages"],
          content:
            "Tu turno para crossfit a las 10 am el martes ha sido reservado con éxito. ¡Disfruta de tu entrenamiento!",
          additional_kwargs: {},
          response_metadata: {
            tokenUsage: {
              promptTokens: 463,
              completionTokens: 27,
              totalTokens: 490,
            },
            finish_reason: "stop",
            usage: {
              prompt_tokens: 463,
              completion_tokens: 27,
              total_tokens: 490,
              prompt_tokens_details: { cached_tokens: 0 },
              completion_tokens_details: { reasoning_tokens: 0 },
            },
            system_fingerprint: "fp_90354628f2",
          },
          id: "chatcmpl-AM1VQjtqFZ0UcZnoOb7Ejf6j4EoZ8",
          tool_calls: [],
          invalid_tool_calls: [],
          usage_metadata: {
            output_tokens: 27,
            input_tokens: 463,
            total_tokens: 490,
            input_token_details: { cache_read: 0 },
            output_token_details: { reasoning: 0 },
          },
        },
      },
    ],
  },
  next: [],
  tasks: [],
  metadata: {
    source: "update",
    step: 9,
    writes: {
      agent: {
        resrveDetails: {
          dia: "martes",
          dni: "21123456",
          hora: "10:00",
          activity: "crossfit",
        },
      },
    },
    parents: {},
  },
  config: {
    configurable: {
      thread_id: "95c61033-2dd3-45d9-b8c9-e28d123756c2",
      checkpoint_id: "1ef925f6-a105-6b60-8009-cc4ef200561e",
      checkpoint_ns: "",
    },
  },
  createdAt: "2024-10-24T23:26:37.078Z",
  parentConfig: {
    configurable: {
      thread_id: "95c61033-2dd3-45d9-b8c9-e28d123756c2",
      checkpoint_ns: "",
      checkpoint_id: "1ef925f5-9901-6d20-8008-de8767c2feb5",
    },
  },
};
