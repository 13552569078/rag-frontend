
declare namespace ApiDocument {

  type Idel = {
    kb_ids:string[];
    user_id?: string;
  }

  type Irename = {
    kb_id:string;
    new_kb_name:string
    user_id?: string;
  }

  type IaddBaseKnowParams = {
    user_id?:string;
    kb_name:string
  }

  type IbaseKnowParams = {
    kb_name?: string;
    user_id?: string;
  };

  type IbaseKnowDetailParams = {
    kb_id: string;
  };

  type FileListParams = {
    user_id?: string;
    kb_id: string;
  };

  type DelListParams = {
    user_id?: string;
    kb_id: string;
    file_ids: string[]
  }

  type FileList = {
    total: Record<string, unknown>;
    details: Array<unknown>;
  }

  type baseDetail = {
    kb_id:string;
    kb_name:string;
    timestamp:string;
    page_size:string;
    file_count:string;
    }

    type IsuggestParams = {
      user_id?: string;
      kb_ids: string;
      file_ids?: string;
      count: number;
    };
    
    type Idigest = {
      kb_id: string;
      file_ids?: string[];
    };

    type IPreview = {
      file_id: string;
    }

    type IhistoryParams = {
      kb_ids:string[];
      file_ids?:string[];
      chat_types:number[]
    }

    type IChunkListParams = 
    {
      kb_id: string;
      file_id: string;
      page_num: number;
      page_size: number;
      keyword: string;
    }

    type IChunkListDelParams = {
      kb_id?: string;
      file_id?: string;
      chunk_id: string;
    }

    type IChunkPpdateParams = {
      kb_id: string;
      file_id: string;
      chunk_id: string;
      question: string;
      content: string;
    }

    type IChunkAddParams = {
      kb_id: string;
      file_id: string;
      file_name: string;
      question: string;
      content: string;
    }
}

interface IfileList {
  kb_id:string;
  kb_name:string;
  timestamp:string;
  page_size:string;
  file_count:string;
}