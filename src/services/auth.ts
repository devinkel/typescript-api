import bcrypt from 'bcrypt';

export class AuthService {

    /**
     * 
     * @param password 
     * @param salt 
     * @returns encrypted password
    */
    public static async hashPassword(password: string, salt = 10): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    /**
     * 
     * @param password 
     * @param hashPassword 
     * @returns boolean if the same password
    */
    public static async comparePasswords(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword)
    }
}