import "./App.css";
// import { Editor } from "@tinymce/tinymce-react";

// export default function Editors() {
//   return (
//     <div className="w-screen h-screen bg-gray-500 px-3">
//       <h1>Editor</h1>
//       <Editor
//         apiKey="eonshfcuta9bnde9v48t62iope15appdnqlt2a76lgdpprnd"
//         init={{
//           plugins: [
//             // Core editing features
//             "anchor",
//             "autolink",
//             "charmap",
//             "codesample",
//             "emoticons",
//             "image",
//             "link",
//             "lists",
//             "media",
//             "searchreplace",
//             "table",
//             "visualblocks",
//             "wordcount",
//             // Your account includes a free trial of TinyMCE premium features
//             // Try the most popular premium features until Dec 7, 2024:
//             "checklist",
//             "mediaembed",
//             "casechange",
//             "export",
//             "formatpainter",
//             "pageembed",
//             "a11ychecker",
//             "tinymcespellchecker",
//             "permanentpen",
//             "powerpaste",
//             "advtable",
//             "advcode",
//             "editimage",
//             "advtemplate",
//             "ai",
//             "mentions",
//             "tinycomments",
//             "tableofcontents",
//             "footnotes",
//             "mergetags",
//             "autocorrect",
//             "typography",
//             "inlinecss",
//             "markdown",
//             // Early access to document converters
//             "importword",
//             "exportword",
//             "exportpdf",
//           ],
//           toolbar:
//             "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
//           tinycomments_mode: "embedded",
//           tinycomments_author: "Author name",
//           mergetags_list: [
//             { value: "First.Name", title: "First Name" },
//             { value: "Email", title: "Email" },
//           ],
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           ai_request: (request: unknown, respondWith: any) => {
//             console.log(request);
//             return respondWith.string(() =>
//               Promise.reject("See docs to implement AI Assistant")
//             );
//           },
//           exportpdf_converter_options: {
//             format: "Letter",
//             margin_top: "1in",
//             margin_right: "1in",
//             margin_bottom: "1in",
//             margin_left: "1in",
//           },
//           exportword_converter_options: { document: { size: "Letter" } },
//           importword_converter_options: {
//             formatting: {
//               styles: "inline",
//               resets: "inline",
//               defaults: "inline",
//             },
//           },
//         }}
//         initialValue="Welcome to TinyMCE!"
//       />
//     </div>
//   );
// }

import {
  backgroundConstants,
  BackgroundPlugin,
  borderConstants,
  BorderPlugin,
  ConditionPlugin,
  conditionsConstants,
  floatingConstants,
  FloatingPlugin,
  layoutsConstants,
  LayoutsPlugin,
  listConstants,
  ListPlugin,
  paddingConstants,
  PaddingPlugin,
  pageNumberConstants,
  PageNumberPlugin,
  shapesConstants,
  ShapesPlugin,
  templateConstants,
  TemplatePlugin,
  VariablePlugin,
  variablesConstants,
} from "./lib";
import { TinyMceEditor, TinyMceEditorProvider } from "@medad-mce/editor";
import messageBroker from "./utils/message-broker";
import { useEffect, useState } from "react";
export default function Editors() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("Requesting token from Host App...");
    messageBroker.sendMessage("get_token", (token) => {
      console.log("Received token:", token);
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  if (!isLoggedIn) {
    return <>not logged in</>;
  } else
    return (
      <div className="w-full h-[600px]">
        <h1>Editor</h1>
        <TinyMceEditorProvider
          plugins={[
            new BorderPlugin(),
            new BackgroundPlugin(),
            new ConditionPlugin(),
            new FloatingPlugin(),
            new LayoutsPlugin(),
            new ListPlugin(),
            new PaddingPlugin(),
            new PageNumberPlugin(),
            new ShapesPlugin(),
            new TemplatePlugin(),
            new VariablePlugin(),
          ]}>
          <TinyMceEditor
            apiKey="eonshfcuta9bnde9v48t62iope15appdnqlt2a76lgdpprnd"
            initialValue={`<div class='line-wrapper'> &nbsp; </div>`}
            init={{
              pagebreak_split_block: true,
              pagebreak_separator:
                '<div class="page-break" style="page-break-after: always;"></div>',
              height: "100%",
              width: "100%",
              menubar: true,
              resize: false,
              forced_root_block: "div",
              forced_root_block_attrs: { class: "line-wrapper" },
              toolbar: `${borderConstants.BUTTONS.default} | undo redo | ${backgroundConstants.BUTTONS.default} | ${conditionsConstants.BUTTONS.insert} | ${paddingConstants.BUTTONS.padding} | 
            ${floatingConstants.BUTTONS.floating_element_btn} | ${layoutsConstants.BUTTONS.layouts} | ${listConstants.BUTTONS.insert} | 
            ${pageNumberConstants.BUTTONS.pageNumber} | ${pageNumberConstants.BUTTONS.totalPage} | ${shapesConstants.BUTTONS.insert_shape} | ${shapesConstants.COMMANDS.on_insert_shape} 
            | ${templateConstants.BUTTONS.addFooter} | ${templateConstants.BUTTONS.addFooter} | ${variablesConstants.BUTTONS.insert_variable}
            `,
              fullscreen_native: true,
              language: "fa",
              content_css: ["/editor.css"],
            }}
          />
        </TinyMceEditorProvider>
      </div>
    );
}
