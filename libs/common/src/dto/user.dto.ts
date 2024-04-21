export interface UserDto {
  _id: string;
  email: string;
  name: string;
  password?: string;
  providerId?: string;
  roles?: string[];
}
