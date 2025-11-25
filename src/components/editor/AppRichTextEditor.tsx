"use client";

import {
  insertImages,
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAddImage,
  MenuButtonAlignCenter,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonHorizontalRule,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
} from "mui-tiptap";

import { MediaModel } from "@/config/models/media";
import { Stack } from "@mui/material";
import ColorKit from "@tiptap/extension-color";
import ImageKit from "@tiptap/extension-image";
import LinkHandlerKit from "@tiptap/extension-link";
import TextAlignKit from "@tiptap/extension-text-align";
import StyleKit from "@tiptap/extension-text-style";
import UnderlineKit from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import MediaSelector from "../media/MediaSelector";
import { H6, Span } from "../Typography";

export interface IRichTextEditorProps {
  label: string;
  handleChange: (value: string | undefined) => void;
  value?: string;
  error?: boolean;
  helperText?: string;
}

interface IHandleInsertImage {
  media: MediaModel;
}

const AppRichTextEditor = ({
  value,
  label,
  error,
  helperText,
  handleChange = () => {},
}: IRichTextEditorProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const editor = useEditor({
    content: value,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      StyleKit,
      ColorKit,
      TextAlignKit,
      UnderlineKit,
      LinkHandlerKit,
      LinkBubbleMenuHandler,
      ImageKit,
    ],
  });

  const richTextValue = editor?.getHTML();
  const handleChooseImage = ({ media }: IHandleInsertImage) => {
    insertImages({
      editor: editor,
      images: [{ src: media.fileUrl, alt: media.title, title: media.title }],
    });
  };

  useEffect(() => {
    handleChange(richTextValue);
  }, [richTextValue]);

  return (
    <Stack gap={1}>
      <H6>{label}</H6>
      <RichTextEditorProvider editor={editor}>
        <RichTextField
          variant="outlined"
          controls={
            <MenuControlsContainer>
              <MenuSelectHeading tooltipTitle="Chọn tiêu đề" />
              <MenuDivider />
              <MenuButtonBold tooltipLabel="Chữ đậm" />
              <MenuButtonItalic tooltipLabel="Chữ nghiêng" />
              <MenuButtonUnderline tooltipLabel="Chữ gạch dưới" />
              <MenuButtonAlignLeft tooltipLabel="Căn lề trái" />
              <MenuButtonAlignCenter tooltipLabel="Căn lề giữa" />
              <MenuButtonAlignRight tooltipLabel="Căn lề phải" />
              <MenuButtonTextColor tooltipLabel="Màu chữ" />
              <MenuButtonBulletedList tooltipLabel="Danh sách dấu chấm" />
              <MenuButtonOrderedList tooltipLabel="Danh sách đánh số" />
              <LinkBubbleMenu
                labels={{
                  editLinkAddTitle: "Chèn đường dẫn",
                  editLinkEditTitle: "Chỉnh sửa đường dẫn",
                  editLinkCancelButtonLabel: "Hủy",
                  editLinkSaveButtonLabel: "Lưu",
                  editLinkHrefInputLabel: "Đường dẫn",
                  editLinkTextInputLabel: "Tiêu đề",
                  viewLinkRemoveButtonLabel: "Xóa",
                  viewLinkEditButtonLabel: "Chỉnh sửa",
                }}
              />
              <MenuButtonEditLink tooltipLabel="Chèn đường dẫn" />
              <MenuButtonAddImage
                tooltipLabel="Thêm ảnh"
                onClick={() => setOpen(true)}
              />
              <MenuButtonBlockquote tooltipLabel="Đoạn trích dẫn" />
              <MenuButtonStrikethrough tooltipLabel="Gạch bỏ chữ" />
              <MenuButtonHorizontalRule tooltipLabel="Chèn đường kẻ ngang" />
            </MenuControlsContainer>
          }
        />
      </RichTextEditorProvider>
      <MediaSelector
        open={open}
        showPreview={false}
        setOpen={setOpen}
        allowChooseMultiple={false}
        allowConfirmSelect={false}
        allowDelete={false}
        onSelect={(media: MediaModel) => handleChooseImage({ media })}
        label="Chọn ảnh"
      />
      {error && <Span>{helperText}</Span>}
    </Stack>
  );
};

export default AppRichTextEditor;
