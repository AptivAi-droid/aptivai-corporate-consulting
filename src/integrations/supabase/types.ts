export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_assessments: {
        Row: {
          answers: Json
          assessment_type: string
          completed_at: string | null
          created_at: string
          id: string
          questions: Json
          recommendations: Json | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          answers?: Json
          assessment_type: string
          completed_at?: string | null
          created_at?: string
          id?: string
          questions?: Json
          recommendations?: Json | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          assessment_type?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          questions?: Json
          recommendations?: Json | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_chat_sessions: {
        Row: {
          agent_type: string
          created_at: string
          id: string
          session_data: Json | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_type: string
          created_at?: string
          id?: string
          session_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_type?: string
          created_at?: string
          id?: string
          session_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      consultation_bookings: {
        Row: {
          booking_data: Json
          consultation_type: string
          created_at: string
          id: string
          preferred_times: Json | null
          scheduled_for: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          booking_data?: Json
          consultation_type: string
          created_at?: string
          id?: string
          preferred_times?: Json | null
          scheduled_for?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          booking_data?: Json
          consultation_type?: string
          created_at?: string
          id?: string
          preferred_times?: Json | null
          scheduled_for?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      course_content: {
        Row: {
          category_id: string | null
          content_type: string
          course_id: string
          created_at: string
          description: string | null
          duration: number | null
          file_size: number | null
          file_url: string | null
          id: string
          is_free: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          content_type: string
          course_id: string
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_free?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          content_type?: string
          course_id?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_free?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_content_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          student_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          student_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_published: boolean
          price: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_published?: boolean
          price?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_published?: boolean
          price?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_searchable: boolean | null
          keywords: string[] | null
          module_number: number | null
          section: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_searchable?: boolean | null
          keywords?: string[] | null
          module_number?: number | null
          section?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_searchable?: boolean | null
          keywords?: string[] | null
          module_number?: number | null
          section?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_faq: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          keywords: string[] | null
          question: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          question: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          question?: string
        }
        Relationships: []
      }
      lead_intelligence: {
        Row: {
          ai_readiness_score: number | null
          company_info: Json | null
          company_size: string | null
          created_at: string
          id: string
          industry: string | null
          last_interaction: string | null
          pain_points: Json | null
          priority_level: string | null
          recommended_solutions: Json | null
          user_id: string | null
        }
        Insert: {
          ai_readiness_score?: number | null
          company_info?: Json | null
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          last_interaction?: string | null
          pain_points?: Json | null
          priority_level?: string | null
          recommended_solutions?: Json | null
          user_id?: string | null
        }
        Update: {
          ai_readiness_score?: number | null
          company_info?: Json | null
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          last_interaction?: string | null
          pain_points?: Json | null
          priority_level?: string | null
          recommended_solutions?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          interaction_history: Json | null
          interests: Json | null
          learning_style: Json | null
          preferred_content_types: Json | null
          skill_level: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_history?: Json | null
          interests?: Json | null
          learning_style?: Json | null
          preferred_content_types?: Json | null
          skill_level?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interaction_history?: Json | null
          interests?: Json | null
          learning_style?: Json | null
          preferred_content_types?: Json | null
          skill_level?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      grant_admin_role_to_user: {
        Args: { user_email: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_knowledge_base: {
        Args: { search_query: string }
        Returns: {
          category: string
          content: string
          id: string
          module_number: number
          relevance: number
          section: string
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "instructor", "student"],
    },
  },
} as const
