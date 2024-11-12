export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      contracts: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          type: string;
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          type: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          name?: string;
          type?: string;
          content?: string;
          created_at?: string;
        };
      };
      // Add other tables as needed
    };
  };
}
