import { CreateUserParams, GetMenuParams, SignInParams } from "@/type"
import { Account, Avatars, Client, ID, Query, Storage, TablesDB } from "react-native-appwrite"


export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_PUBLIC_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATEFORM_URI,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    projectName: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    userTable: process.env.EXPO_PUBLIC_APPWRITE_USER_TABLE_ID,
    menuTable: process.env.EXPO_PUBLIC_APPWRITE_MENU_TABLE_ID,
    customizationTable: process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_TABLE_ID,
    menuCustomizationTable: process.env.EXPO_PUBLIC_APPWRITE_MENUCUSTOMIZATION_TABLE_ID,
    categoriesTable: process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_TABLE_ID
}

export const client = new Client()
client
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform!)

export const account = new Account(client)
export const database = new TablesDB(client)
export const storage = new Storage(client)
const avatar = new Avatars(client)

export const createUser = async ({ name, email, password }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)

        if (!newAccount) throw Error

        await signIn({ email, password })

        const avatarUrl = avatar.getInitialsURL(name)

        return await database.createRow(
            appwriteConfig.databaseId!,
            appwriteConfig.userTable!,
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
            appwriteConfig.userTable!,
            [Query.equal("accountId", currentAccount.$id)]
        )
        if (!currentUser) throw Error

        return currentUser.rows[0]
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if (category) queries.push(Query.equal("category", category));
        if (query) queries.push(Query.search("name", query));

        const menu = await database.listRows(
            appwriteConfig.databaseId!,
            appwriteConfig.menuTable!,
            queries
        )

        return menu.rows
    } catch (error) {
        throw new Error(error as string)
    }
}

export const getCategories = async () => {
    try {
        const categories = await database.listRows(
            appwriteConfig.databaseId!,
            appwriteConfig.categoriesTable!
        )

        return categories.rows
    } catch (error) {
        throw new Error(error as string)
    }
}