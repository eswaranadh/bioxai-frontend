export const OWNER = "biocypher";
export const REPO = "biochatter-next";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

export const DOCS_URL = 'https://biocypher.org'

export const DEFAULT_CORS_HOST = "https://a.nextweb.fun";
export const DEFAULT_API_HOST = `${DEFAULT_CORS_HOST}/api/proxy`;
export const OPENAI_BASE_URL = "https://api.openai.com";
export const LOCAL_BASE_URL = "http://localhost:5001"

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Welcome = "/welcome",
  Masks = "/masks",
  Auth = "/auth",
  RAG = "/rag",
  KG = "/kg",
  Projects = "/projects"
}

export enum ApiPath {
  Cors = "/api/cors",
  OpenAI = "/api/openai",
  RAG = "/api/rag",
  KG = "/api/kg",
  TokenUsage = "/api/tokenusage",
  Projects = "/api/projects"
}

export enum SlotID {
  AppBody = "app-body",
  CustomModel = "custom-model",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "biochatter-next",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
  RAG = "rag-store",
  KG = "kg-store",
}

export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

export const STORAGE_KEY = "chatgpt-next-web";

export const REQUEST_TIMEOUT_MS = 60000 * 3; // 3 mins

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export enum ServiceProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
}

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

export const BiochatterPath = {
  ChatPath: "v1/chat/completions",
  NewDocument: "v1/rag/newdocument",
  AllDocuments: "v1/rag/alldocuments",
  Document: "v1/rag/document",
  RAGConnectionStatus: "v1/rag/connectionstatus",
  KGConnectionStatus: "v1/kg/connectionstatus",
  TokenUsage: "v1/tokenusage",
  Projects: "v1/projects"
};

export const Azure = {
  ExampleEndpoint: "https://{resource-url}/openai/deployments/{deploy-id}",
};

export const BUILTIN_MASKS = [
  {
    avatar: "1f47e",
    name: "GitHub Copilot",
    context: [
      {
        role: "system",
        content:
          'You are an AI programming assistant.\n\nWhen asked for you name, you must respond with "GitHub Copilot".\n\nFollow these rules:\n- Use markdown syntax in your responses\n- Do not mention that you are an AI language model\n- Do not mention anything about ethics, safety, or potential harm\n- Do not apologize or express concerns\n- Do not mention OpenAI, ChatGPT, or GPT\n- Do not use phrases like "I apologize", "I\'m sorry", "I cannot", "I do not", etc.\n- Do not use phrases like "However", "Moreover", etc. at the start of paragraphs\n- Do not use "please" or "thank you"\n- Do not give warnings or suggestions about verification\n- Do not introduce lists with "Here\'s", "Here are", etc.\n- Keep responses brief and concise\n\nYou must follow these rules in all responses.',
      },
    ],
    modelConfig: {
      model: "gpt-4",
      temperature: 0.3,
      max_tokens: 2000,
      presence_penalty: 0,
      frequency_penalty: 0,
      sendMemory: true,
      historyMessageCount: 4,
      compressMessageLengthThreshold: 1000,
    },
    lang: "en",
    builtin: true,
    hideContext: true,
  },
];

export const BUILTIN_MASK_STORE = {
  builtin: {
    masks: BUILTIN_MASKS,
  },
  save() {
    // noop
  },
};

export const DEFAULT_MASK_STATE = {
  loading: false,
  maskEditId: undefined,
  shouldSyncMasks: false,
};

export const DEFAULT_SYNC_STATE = {
  loading: false,
  sourceId: "",
  targetId: "",
};

export const DEFAULT_CHAT_STATE = {
  showPromptModal: false,
  showSyncModal: false,
  currentErrorMessage: "",
  containerExpanded: true,
};

export const DEFAULT_TOKEN_USAGE = {
  tokens: {
    total_tokens: 0,
    completion_tokens: 0,
    prompt_tokens: 0,
  },
  auth_type: "Server",
};

export const HDR_CONTENT_TYPE = "Content-Type";
export const HDR_APPLICATION_JSON = "application/json";
export const ERROR_BIOSERVER_OK = "OK";

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: {{cutoff}}
Current model: {{model}}
Current time: {{time}}
Latex inline: $x^2$
Latex block: $$e=mc^2$$
`;

export const SUMMARIZE_MODEL = "gpt-3.5-turbo";

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-1106-preview": "2023-04",
  "gpt-4-vision-preview": "2023-04",
};

export const DEFAULT_MODELS = [{
  name: "gpt-4o",
  available: true,
}, {
  name: "gpt-4",
  available: true,
}, {
  name: "gpt-3.5-turbo",
  available: true,
}] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;

// biochatter-server error
export const ERROR_BIOSERVER_UNKNOWN = 5100
export const ERROR_BIOSERVER_MILVUS_UNKNOWN = 5101
export const ERROR_BIOSERVER_MILVUS_CONNECT_FAILED = 5102
export const ERROR_BIOSERVER_EXCEEDS_TOKEN_LIMIT = 5103
