export interface Participant {
  id?: string;
  name: string;
  phone: string;
  instagram_followed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ParticipantFormData {
  name: string;
  phone: string;
  instagram_followed: boolean;
}
