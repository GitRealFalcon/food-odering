import { ID } from "react-native-appwrite";
import { appwriteConfig, database, storage } from "./appwrite";
import dummyData from "./data";
import * as FileSystem from "expo-file-system";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await database.listRows(
        appwriteConfig.databaseId!,
        collectionId
    );

    await Promise.all(
        list.rows.map((doc) =>
            database.deleteRow(appwriteConfig.databaseId!, collectionId, doc.$id)
        )
    );
}

async function clearStorage(): Promise<void> {
    const list = await storage.listFiles(appwriteConfig.bucketId!);

    await Promise.all(
        list.files.map((file) =>
            storage.deleteFile(appwriteConfig.bucketId!, file.$id)
        )
    );
}

async function uploadImageToStorage(imageUrl: string) {
    try {
        const filename =
            imageUrl.split("/").pop()?.split("?")[0] ??
            `image-${Date.now()}.jpg`;

        const localUri = FileSystem.cacheDirectory + filename;

        const download = await FileSystem.downloadAsync(
            imageUrl,
            localUri
        );
        console.log(download);
        
        if (download.status !== 200) {
            throw new Error(`Download failed: ${download.status}`);
        }

        const info = await FileSystem.getInfoAsync(download.uri);
        // console.log("Downloaded file:", info);

        const file = await storage.createFile({
            bucketId: appwriteConfig.bucketId!,
            fileId: ID.unique(),
            file: {
                uri: download.uri,
                name: filename,
                type: "image/png",
                size: info.size!,
            },
        });

        return storage.getFileView(
            appwriteConfig.bucketId!,
            file.$id
        ).toString();
    } catch (err) {
        console.error("Upload Image Error", err);
        throw err;
    }
}

async function seed(): Promise<void> {
    // 1. Clear all
    await clearAll(appwriteConfig.categoriesTable!);
    await clearAll(appwriteConfig.customizationTable!);
    await clearAll(appwriteConfig.menuTable!);
    await clearAll(appwriteConfig.menuCustomizationTable!);
    await clearStorage();

    console.log("🪄 Clear All Data");

    // 2. Create Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
        const doc = await database.createRow(
            appwriteConfig.databaseId!,
            appwriteConfig.categoriesTable!,
            ID.unique(),
            cat
        );
        categoryMap[cat.name] = doc.$id;
    }

    console.log("Categories Created");

    // 3. Create Customizations
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
        const doc = await database.createRow(
            appwriteConfig.databaseId!,
            appwriteConfig.customizationTable!,
            ID.unique(),
            {
                name: cus.name,
                price: cus.price,
                type: cus.type,
            }
        );
        customizationMap[cus.name] = doc.$id;
    }

    console.log("Customization Created");

    // 4. Create Menu Items
    const menuMap: Record<string, string> = {};
    let index = 1
    for (const item of data.menu) {
        // const uploadedImage = await uploadImageToStorage(item.image_url);

       try {
         const doc = await database.createRow(
             appwriteConfig.databaseId!,
             appwriteConfig.menuTable!,
             ID.unique(),
             {
                 name: item.name,
                 description: item.description,
                 image_url: item.image_url,
                 price: item.price,
                 rating: item.rating,
                 calories: item.calories,
                 protein: item.protein,
                 category: categoryMap[item.category_name],
             }
         );
 
         console.log("Menu Created: ", index);
         index++
 
 
         menuMap[item.name] = doc.$id;
 
         // 5. Create menu_customizations
         for (const cusName of item.customizations) {
             await database.createRow(
                 appwriteConfig.databaseId!,
                 appwriteConfig.menuCustomizationTable!,
                 ID.unique(),
                 {
                     menu: doc.$id,
                     customizations: customizationMap[cusName],
                 }
             );
         }
       } catch (error) {
        console.log("Menu Error", error);
        
       }
    }

    console.log("✅ Seeding complete.");
}

export default seed;