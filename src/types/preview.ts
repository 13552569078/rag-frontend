interface Res$1Type {
  text: string;
  confidence: number;
  text_region: Array<number>;
}

interface Segment_layout$2Type {
  res: Array<Res$1Type>;
  bbox: Array<number>;
  text: string;
  api_bbox: Array<number>;
  is_first: boolean;
  need_ocr: boolean;
  type?: string;
}

interface Pages$3Type {
  index: number;
  file_id: null;
  segment_layout: Array<Segment_layout$2Type>;
  orig_image_minio_path: string;
  marked_image_minio_path: string;
}

interface IpreviewData {
  minio_base: string;
  kb_id: string;
  pages: Array<Pages$3Type>;
  file_id: string;
  user_id: string;
  file_name: string;
  page_number: number;
}

interface Isource {
  file_name: string;
  score: string;
  content: string;
  open: boolean;
  page_url: string;
  bbox: Array<number>;
}

export type { IpreviewData, Segment_layout$2Type, Isource };
