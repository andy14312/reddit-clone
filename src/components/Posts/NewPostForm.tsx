import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BiPoll } from "react-icons/bi";
import TabItem from "./TabItem";
import TextInputs from "./CreatePostInputs/TextInputs";
import ImageUpload from "./CreatePostInputs/ImageUpload";
import { IPost } from "@/src/atoms/postsAtom";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/src/firebase/clientApp";
import { POSTS_COLLECTION_NAME } from "@/src/firebase/posts";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/src/hooks/useSelectFile";

type NewPostFormProps = {
  user: User;
};

const formTabs: TabItem[] = [
  {
    name: "post",
    title: "Post",
    icon: IoDocumentText,
  },
  {
    name: "media",
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    name: "link",
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    name: "poll",
    title: "Poll",
    icon: BiPoll,
  },
  {
    name: "talk",
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
  name: string;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].name);
  const [textInputs, setTextInputs] = useState({
    postTitle: "",
    postBody: "",
  });
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { selectedFile, onSelectFile, setSelectedFile } = useSelectFile();

  const handleCreatePost = async () => {
    // create new post object -> type Post
    const { communityId } = router.query;
    const newPost: IPost = {
      communityId: communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: textInputs.postTitle,
      body: textInputs.postBody,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    setIsError(false);
    // store the post in db
    try {
      const postDocRef = await addDoc(
        collection(firestore, POSTS_COLLECTION_NAME),
        newPost
      );

      // check for selectedfile
      // if there is a file, we store the file in firebase storage
      // store in storage -> getDownloadURL (return imageURL)
      // update the post doc by adding the imageURL
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, { imageURL: downloadURL });
      }
    } catch (error: any) {
      console.error("handle create post error: ", error.message);
      setIsError(true);
    }
    setLoading(false);
    // redirect back to the community page using router
    router.back();
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      mt={2}
      fontSize="0.8rem"
    >
      <Flex width="100%">
        {formTabs.map((tabItem: TabItem) => {
          return (
            <TabItem
              item={tabItem}
              selected={tabItem.name === selectedTab}
              key={tabItem.name}
              setSelectedTab={setSelectedTab}
            />
          );
        })}
      </Flex>
      <Flex padding={4}>
        {selectedTab === "post" && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onInputChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "media" && (
          <ImageUpload
            onSelectImage={onSelectFile}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
          />
        )}
      </Flex>
      {isError && (
        <Alert status="error">
          <AlertIcon />
          <Text>There is an error while creating this post!</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
