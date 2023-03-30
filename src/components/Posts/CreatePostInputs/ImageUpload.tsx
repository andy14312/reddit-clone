import { Button, Flex, Image, Input, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFile: string;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  onSelectImage,
  selectedFile,
  setSelectedFile,
  setSelectedTab,
}) => {
  const selectFileInputRef = useRef<HTMLInputElement>(null);
  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxWidth="400px" maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("post")}>
              Back to post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          width="100%"
          height="200px"
          border="1px dashed"
          padding={5}
          borderColor="gray.200"
          borderRadius={4}
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => {
              selectFileInputRef.current?.click();
            }}
          >
            Upload
          </Button>
          <input
            ref={selectFileInputRef}
            type="file"
            hidden
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
