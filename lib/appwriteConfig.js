import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Role,
  Storage,
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
const storage = new Storage(client);

export const getUserLabels = async () => {
  let data;
  try {
    data = (await account.get()).labels;
  } catch (error) {
    data = error;
  } finally {
    return data;
  }
};

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
  let passedData = { username: data.username, profession: data.profession };

  if (data.avatar) {
    const [avatarUrl] = await Promise.all([uploadFile(data.avatar, "image")]);
    passedData = { ...passedData, avatar: avatarUrl };
  }

  try {
    const res = await databases.updateDocument(
      databaseId,
      userCollectionId,
      id,
      passedData,
      permissions
    );
    return res;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateHistory = async (id, data, permissions) => {
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

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }
  } catch (error) {
    throw new Error(error);
  }

  return fileUrl;
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createCourses = async (form) => {
  console.log(form);
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]); // call function on the same time
    const newCourse = await databases.createDocument(
      databaseId,
      courseCollectionId,
      ID.unique(),
      {
        title: form.name,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        prompt: form.prompt,
        summary: form.summary,
        description: form.description,
        categories: form.categories,
      }
    );
    console.log(newCourse);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createCategories = async (name) => {
  try {
    const newCategory = await databases.createDocument(
      databaseId,
      categoriesCollectionId,
      ID.unique(),
      { category_name: name }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const updateCategory = async (id, updateName) => {
  try {
    const updatedCategory = await databases.updateDocument(
      databaseId,
      categoriesCollectionId,
      id,
      { category_name: updateName }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    await databases.deleteDocument(databaseId, categoriesCollectionId, id);
  } catch (error) {
    throw new Error(error);
  }
};
