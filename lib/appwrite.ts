import { CreateUserParams, SignInParams } from "@/type"
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite"


export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_PUBLIC_ENDPOINT,
    platform: "com.realfalcon.fooddelivery",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    projectName: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userTable: "user"
}

export const client = new Client()
client
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client)
export const database = new TablesDB(client)
const avatar = new Avatars(client)

export const createUser = async ({ name, email, password }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)

        if (!newAccount) throw Error

        await signIn({ email, password })

        const avatarUrl = avatar.getInitialsURL(name)

        return await database.createRow(
            appwriteConfig.databaseId!,
            appwriteConfig.userTable,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                name,
                avatar: avatarUrl
            }
        )


    } catch (error) {
        throw new Error(error as string)
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) throw Error

        const currentUser = await database.listRows(
            appwriteConfig.databaseId!,
            appwriteConfig.userTable,
            [Query.equal("accountId", currentAccount.$id)]
        )
        if(!currentUser) throw Error

        return currentUser.rows[0]
    } catch (error) {
        throw new Error(error as string)
    }
}