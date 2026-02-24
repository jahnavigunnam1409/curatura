// Auto-aligned with the Supabase schema in supabase/schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };

      artworks: {
        Row: {
          id: string;
          title: string;
          artist: string;
          year: number;
          theme: string;
          story_line: string;
          color: string;
          aspect_ratio: "portrait" | "landscape" | "square";
          image_url: string | null;
          selection_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          artist: string;
          year: number;
          theme: string;
          story_line: string;
          color: string;
          aspect_ratio: "portrait" | "landscape" | "square";
          image_url?: string | null;
          selection_count?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          artist?: string;
          year?: number;
          theme?: string;
          story_line?: string;
          color?: string;
          aspect_ratio?: "portrait" | "landscape" | "square";
          image_url?: string | null;
          selection_count?: number;
        };
      };

      frames: {
        Row: {
          id: string;
          title: string;
          is_template: boolean;
          created_by: string | null;
          original_frame_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          is_template?: boolean;
          created_by?: string | null;
          original_frame_id?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          is_template?: boolean;
          original_frame_id?: string | null;
        };
      };

      frame_artworks: {
        Row: {
          id: string;
          frame_id: string;
          artwork_id: string;
          position: number;
        };
        Insert: {
          id?: string;
          frame_id: string;
          artwork_id: string;
          position: number;
        };
        Update: {
          position?: number;
        };
      };

      curations: {
        Row: {
          id: string;
          title: string;
          curator_name: string;
          user_id: string | null;
          is_template: boolean;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          curator_name: string;
          user_id?: string | null;
          is_template?: boolean;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          curator_name?: string;
          is_public?: boolean;
        };
      };

      curation_frames: {
        Row: {
          id: string;
          curation_id: string;
          frame_id: string;
          position: number;
        };
        Insert: {
          id?: string;
          curation_id: string;
          frame_id: string;
          position: number;
        };
        Update: {
          position?: number;
        };
      };

      interaction_logs: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          artwork_id: string | null;
          curation_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          artwork_id?: string | null;
          curation_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
}

// ── Convenience row types ────────────────────────────────────────────────────
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Artwork = Database["public"]["Tables"]["artworks"]["Row"];
export type Frame = Database["public"]["Tables"]["frames"]["Row"];
export type FrameArtwork = Database["public"]["Tables"]["frame_artworks"]["Row"];
export type Curation = Database["public"]["Tables"]["curations"]["Row"];
export type CurationFrame = Database["public"]["Tables"]["curation_frames"]["Row"];
export type InteractionLog = Database["public"]["Tables"]["interaction_logs"]["Row"];

// ── Composite types used in the UI ───────────────────────────────────────────
export interface FrameWithArtworks extends Frame {
  artworkIds: string[];
}

export interface CurationWithFrames extends Curation {
  frames: FrameWithArtworks[];
}
