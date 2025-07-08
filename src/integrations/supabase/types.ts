export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          id: string
          lead_id: string | null
          salesperson_id: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          lead_id?: string | null
          salesperson_id?: string | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          lead_id?: string | null
          salesperson_id?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_salesperson_id_fkey"
            columns: ["salesperson_id"]
            isOneToOne: false
            referencedRelation: "salespeople"
            referencedColumns: ["id"]
          },
        ]
      }
      canvassers: {
        Row: {
          active: boolean
          assigned_territories: string[] | null
          conversion_rate: number
          created_at: string
          email: string
          hire_date: string
          id: string
          leads_generated: number
          name: string
          phone: string | null
          total_visits: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          assigned_territories?: string[] | null
          conversion_rate?: number
          created_at?: string
          email: string
          hire_date?: string
          id?: string
          leads_generated?: number
          name: string
          phone?: string | null
          total_visits?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          assigned_territories?: string[] | null
          conversion_rate?: number
          created_at?: string
          email?: string
          hire_date?: string
          id?: string
          leads_generated?: number
          name?: string
          phone?: string | null
          total_visits?: number
          updated_at?: string
        }
        Relationships: []
      }
      canvassing_activities: {
        Row: {
          address: string
          canvasser_id: string
          created_at: string
          followup_priority: number | null
          id: string
          notes: string | null
          requires_followup: boolean | null
          result: string
          visit_date: string
          zip_code: string | null
        }
        Insert: {
          address: string
          canvasser_id: string
          created_at?: string
          followup_priority?: number | null
          id?: string
          notes?: string | null
          requires_followup?: boolean | null
          result: string
          visit_date?: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          canvasser_id?: string
          created_at?: string
          followup_priority?: number | null
          id?: string
          notes?: string | null
          requires_followup?: boolean | null
          result?: string
          visit_date?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvassing_activities_canvasser_id_fkey"
            columns: ["canvasser_id"]
            isOneToOne: false
            referencedRelation: "canvassers"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          file_size: number | null
          file_type: string
          file_url: string
          filename: string
          id: string
          lead_id: string
          salesperson_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          filename: string
          id?: string
          lead_id: string
          salesperson_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          filename?: string
          id?: string
          lead_id?: string
          salesperson_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_salesperson_id_fkey"
            columns: ["salesperson_id"]
            isOneToOne: false
            referencedRelation: "salespeople"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          email: string
          id: string
          ip_address: unknown | null
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          source: string | null
          status: string | null
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          email: string
          id?: string
          ip_address?: unknown | null
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          source?: string | null
          status?: string | null
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          email?: string
          id?: string
          ip_address?: unknown | null
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          source?: string | null
          status?: string | null
          submitted_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          content: string
          content_type: string
          field_name: string
          id: string
          section: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: string
          content_type?: string
          field_name: string
          id?: string
          section: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          field_name?: string
          id?: string
          section?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          created_at: string
          id: string
          min_stock: number
          name: string
          price: number
          quantity: number
          supplier: string
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          min_stock?: number
          name: string
          price?: number
          quantity?: number
          supplier: string
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          min_stock?: number
          name?: string
          price?: number
          quantity?: number
          supplier?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          canvasser_id: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          salesperson_id: string | null
          service: string | null
          status: string
          updated_at: string
        }
        Insert: {
          canvasser_id?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          salesperson_id?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          canvasser_id?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          salesperson_id?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_canvasser_id_fkey"
            columns: ["canvasser_id"]
            isOneToOne: false
            referencedRelation: "canvassers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_salesperson_id_fkey"
            columns: ["salesperson_id"]
            isOneToOne: false
            referencedRelation: "salespeople"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_lead_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_lead_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_lead_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_lead_id_fkey"
            columns: ["related_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          client_name: string
          created_at: string
          estimated_amount: number
          id: string
          lead_id: string | null
          notes: string | null
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          estimated_amount: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          estimated_amount?: number
          id?: string
          lead_id?: string | null
          notes?: string | null
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      salespeople: {
        Row: {
          active: boolean
          commission_percentage: number
          created_at: string
          email: string
          id: string
          job_types: string[] | null
          name: string
          phone: string | null
          total_profit: number
          total_sales: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          commission_percentage?: number
          created_at?: string
          email: string
          id?: string
          job_types?: string[] | null
          name: string
          phone?: string | null
          total_profit?: number
          total_sales?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          commission_percentage?: number
          created_at?: string
          email?: string
          id?: string
          job_types?: string[] | null
          name?: string
          phone?: string | null
          total_profit?: number
          total_sales?: number
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          lead_id: string | null
          priority: number | null
          salesperson_id: string
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: number | null
          salesperson_id: string
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          lead_id?: string | null
          priority?: number | null
          salesperson_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_salesperson_id_fkey"
            columns: ["salesperson_id"]
            isOneToOne: false
            referencedRelation: "salespeople"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: {
          admin_email: string
          admin_password: string
          admin_username: string
        }
        Returns: string
      }
      create_canvasser_test_user: {
        Args: { user_email: string; user_password: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
