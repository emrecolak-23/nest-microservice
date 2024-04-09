export interface UserDto {
  readonly _id: string;
  email: string;
  password: string;
  roles?: string[];
}
