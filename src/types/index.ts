export interface Item {
  id: string;
  created_at: string;
  name: string;
  description: string;
  image_url?: string;
  price?: number;
}

export interface Favorite {
  user_id: string;
  item_id: string;
  created_at: string;
}
