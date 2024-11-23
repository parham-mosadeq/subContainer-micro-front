import React, { useEffect, useRef, useState } from "react";
import "./background-plugin.styles.css";
import { PluginUiProps } from "@medad-mce/core";
import { onImageUploadRequest$ } from "../events/background-image.events";
import { Button, Modal } from "@medad-mce/components";

export default function BackgroundPlugin(props: PluginUiProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const subscription = onImageUploadRequest$.subscribe({
      next: (data) => {
        setImage(data.currentImageBuffer);
        setIsOpen(true);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onClose = () => {
    formRef.current?.reset();
    setImage(undefined);
    setIsOpen(false);
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.currentTarget.files?.length) return;
    const file = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString();
      setImage(result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.editor?.execCommand("insert_background_image", false, image);
    onClose();
  };

  const onDelete = () => {
    setImage(undefined);
    props.editor?.execCommand("insert_background_image", false, "");
    onClose();
  };

  if (!isOpen) return <></>;
  return (
    <Modal title="عکس پس زمینه" open={isOpen} onClose={onClose}>
      <form
        ref={formRef}
        action="#"
        onSubmit={onSubmit}
        className="flex flex-col gap-y-4"
      >
        <figure>
          <label htmlFor="file-upload">
            {!image ? (
              <div className="p-5 border-[#aaa] border-dashed border-2 text-center w-96 h-96">
                آپلود عکس
              </div>
            ) : (
              <img
                className="max-w-96 max-h-96"
                src={image}
                width={512}
                alt="new image"
              />
            )}
            <input
              hidden
              type="file"
              onChange={onFileUpload}
              id="file-upload"
            />
          </label>
        </figure>
        <figure className="flex gap-2 flex-row-reverse">
          <Button variant="primary" type="submit">
            ثبت
          </Button>
          <Button variant="secondary" onClick={onDelete}>
            حذف
          </Button>
          <Button variant="secondary" type="reset" onClick={onClose}>
            انصراف
          </Button>
        </figure>
      </form>
    </Modal>
  );
}
