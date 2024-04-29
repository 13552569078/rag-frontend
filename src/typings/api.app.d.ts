
declare namespace ApiApplication {

    type IdelParams = {
     application_ids:string[];
      user_id?: string;
    }

    type IaddParams = {
        application_id?: string;
        user_id?: string;
        application_name:string;
        llm_model_name: string;
        application_description: string;
        application_prompt: string;
        kb_ids: string[]
       }
  }