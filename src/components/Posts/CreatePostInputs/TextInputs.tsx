import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

type TextInputsProps = {
  textInputs: {
    postTitle: string;
    postBody: string;
  };
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onInputChange,
  handleCreatePost,
  loading,
}) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="postTitle"
        value={textInputs.postTitle}
        onChange={onInputChange}
        fontSize="0.9rem"
        borderRadius={4}
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
          boxShadow: "none",
        }}
      />
      <Textarea
        name="postBody"
        value={textInputs.postBody}
        onChange={onInputChange}
        height="100px"
        fontSize="0.9rem"
        borderRadius={4}
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
          boxShadow: "none",
        }}
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!textInputs.postTitle}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
