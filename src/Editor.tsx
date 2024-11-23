import { Editor } from "@tinymce/tinymce-react";

export default function Editors() {
  return (
    <div className="w-screen h-screen bg-gray-500 px-3">
      <h1>Editor</h1>
      <Editor
        apiKey="eonshfcuta9bnde9v48t62iope15appdnqlt2a76lgdpprnd"
        init={{
          plugins: [
            // Core editing features
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until Dec 7, 2024:
            "checklist",
            "mediaembed",
            "casechange",
            "export",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "ai",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            // Early access to document converters
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ai_request: (request: unknown, respondWith: any) => {
            console.log(request);
            return respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant")
            );
          },
          exportpdf_converter_options: {
            format: "Letter",
            margin_top: "1in",
            margin_right: "1in",
            margin_bottom: "1in",
            margin_left: "1in",
          },
          exportword_converter_options: { document: { size: "Letter" } },
          importword_converter_options: {
            formatting: {
              styles: "inline",
              resets: "inline",
              defaults: "inline",
            },
          },
        }}
        initialValue="Welcome to TinyMCE!"
      />
    </div>
  );
}
