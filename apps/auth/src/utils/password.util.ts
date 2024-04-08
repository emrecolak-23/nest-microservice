import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  storedPassword: string,
) {
  const hash = await hashPassword(password);
  console.log(hash, storedPassword);
  return await bcrypt.compare(password, storedPassword);
}
