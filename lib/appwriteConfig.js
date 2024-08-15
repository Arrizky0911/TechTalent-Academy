import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.triumphants.aic",
  projectId: "669faea80027c7fe7864",
  databaseId: "669fb0be00188dbf9cd1",
  userCollectionId: "66a186190014d4a2eeb7",
  courseCollectionId: "66b04c3a002a942a1c06",
  categoriesCollectionId: "66b08b89002bda890444",
  storageId: "669fb0760034c8879f84",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  courseCollectionId,
  categoriesCollectionId,
  storageId,
} = appwriteConfig;

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async (username, email, password) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error();

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        user_id: newAccount.$id,
        email,
        avatar: avatarUrl,
        username,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("user_id", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    console.log(currentAccount.$id);
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (id, data, permissions) => {
  console.log(data);
  try {
    const res = await databases.updateDocument(
      databaseId,
      userCollectionId,
      id,
      data,
      permissions
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    await deleteCurrentUser();
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllCourses = async () => {
  try {
    const courses = await databases.listDocuments(
      databaseId,
      courseCollectionId
    );
    return courses.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getCourseById = async (id) => {
  try {
    const course = await databases.listDocuments(
      databaseId,
      courseCollectionId,
      [Query.equal("$id", id)]
    );

    return course.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const searchCategories = async (query) => {
  try {
    const categories = await databases.listDocuments(
      databaseId,
      categoriesCollectionId,
      [Query.search("category_name", query)]
    );
    return categories.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      databaseId,
      categoriesCollectionId
    );

    return categories.documents;
  } catch (error) {
    console.log(error.message);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCurrentUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log("NO ACTIVE SESSION TO DELETE, LOGIN SUCCESS");
  }
};
