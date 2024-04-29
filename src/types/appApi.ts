// 智能应用卡片
export interface IApplication {
  appName?: string;
  appModel?: string;
  appDesc?: string;
  appKnowbase?: string[];
  appTag?: string;
}

// 智能应用卡片List
export interface IApplicationList {
  application_description: string;
  application_id: string;
  invoke_count: number;
  application_name: string;
  application_prompt: string;
  h5_link: string;
  llm_model_name: string;
  timestamp: string;
}

export interface IApplicationCreate {
  application_description: string;
  application_id: string;
  application_name: string;
  application_prompt: string;
  h5_link: string;
  kb_ids: string[];
  llm_model_name: string;
  timestamp: string;
}
