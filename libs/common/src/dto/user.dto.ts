export interface UserDto {
  id: number;
  email: string;
  password: string;
  roles?: string[];
}
