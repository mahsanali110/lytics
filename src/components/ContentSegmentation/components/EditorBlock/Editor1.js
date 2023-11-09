// import React, { useState, useEffect, useRef } from 'react';

// import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
// import { convertToRaw, ContentState, convertFromHTML, EditorState } from 'draft-js';
// import { commonActions } from 'modules/common/actions';
// import { useDispatch } from 'react-redux';
// import draftToHtml from 'draftjs-to-html';
// import { Button } from 'antd';
// import { stateFromHTML } from 'draft-js-import-html';
// import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar';
// import {
//   ItalicButton,
//   BoldButton,
//   UnderlineButton,
//   CodeButton,
//   HeadlineOneButton,
//   HeadlineTwoButton,
//   HeadlineThreeButton,
//   UnorderedListButton,
//   OrderedListButton,
//   BlockquoteButton,
//   CodeBlockButton,
// } from '@draft-js-plugins/buttons';
// import './editor.scss';
// // import buttonStyles from './buttonStyles.module.css';
// // import toolbarStyles from './toolbarStyles.module.css';
// const toolbarPlugin = createToolbarPlugin({
//   structure: [
//     ItalicButton,
//     BoldButton,
//     UnderlineButton,
//     CodeButton,
//     HeadlineOneButton,
//     HeadlineTwoButton,
//     HeadlineThreeButton,
//     UnorderedListButton,
//     OrderedListButton,
//     BlockquoteButton,
//     CodeBlockButton,
//   ],
//   theme: {
//     toolbarStyles: {
//       toolbar: 'toolbar',
//     },
//     buttonStyles: {
//       button: 'toolbar-button',
//       buttonWrapper: 'toolbar-button-wrapper',
//       active: 'toolbar-button-active',
//     },
//   },
// });
// const { Toolbar } = toolbarPlugin;
// const plugins = [toolbarPlugin];
// function Editor1({ textFile, setTextFile }) {
//   const dispatch = useDispatch();
//   // const [convert,setconvert]=useState('');
//   // const blocksFromHTML = convertFromHTML(textFile);
//   // const contentState = ContentState.createFromBlockArray(
//   //   blocksFromHTML.contentBlocks,
//   //   blocksFromHTML.entityMap
//   // );
//   // const test = EditorState.createWithContent(contentState);
//   //   const test2 = convertToRaw(test.getCurrentContent());
//   //   console.log(test2.blocks[0].text);
//   //   const convert=test2.blocks[0].text;
//   //   console.log(convert);
//   // console.log(test2?.simplecontent?.simplecontent?.blocks[0]?.text);
//   console.log(textFile);
//   const [editorState, setEditorState] = useState(createEditorStateWithText(`${textFile}`));
//   const editor = useRef(null);

//   useEffect(() => {
//     setEditorState(createEditorStateWithText(`${textFile}`));
//   }, []);

//   // useEffect(()=>
//   // {
//   //     setEditorState(createEditorStateWithText(`${textFile}`))
//   // },[])
//   const saveText = () => {
//     dispatch(commonActions.showProgramInfo(true));
//     const rawContent = convertToRaw(editorState.getCurrentContent());
//     setTextFile(draftToHtml(rawContent));
//   };

//   const focus = () => {
//     editor.current.focus();
//   };
//   return (
//     <div>
//       {/* {console.log(this.props.textFile)} */}
//       <div className="editor" onClick={focus}>
//         <Editor
//           editorState={editorState}
//           onChange={editorState => setEditorState(editorState)}
//           plugins={plugins}
//           ref={editor}
//         />
//         <Toolbar className="toolbar">
//           {externalProps => (
//             <>
//               <BoldButton {...externalProps} />
//               <ItalicButton {...externalProps} />
//               <UnderlineButton {...externalProps} />
//               <HeadlineOneButton {...externalProps} />
//               <HeadlineTwoButton {...externalProps} />
//               <HeadlineThreeButton {...externalProps} />
//               <UnorderedListButton {...externalProps} />
//               <OrderedListButton {...externalProps} />
//             </>
//           )}
//         </Toolbar>
//       </div>
//       <Button
//         type="primary"
//         onClick={saveText}
//         style={{
//           height: '2rem',
//           width: '5rem',
//           borderRadius: '5px',
//           border: 'none',
//           display: 'block',
//           marginLeft: 'auto',
//           marginRight: 'auto',
//           backgroundColor: '#EF233C',
//         }}
//       >
//         Save
//       </Button>
//     </div>
//   );
// }

// export default Editor1;

// import logo from './logo.svg';
// import './App.css';
import { useEffect, useRef } from 'react';
import {Editor} from '@tinymce/tinymce-react';

function Editor1({title,setTitle}) {
  const editorRef = useRef();
  const handle=(content)=>
  {
    // console.log(editorRef.current.getContent())
    console.log(content);
    setTitle(content);
  }
  // useEffect(()=>
  // {
  //   editorRef.setContent('<p>hello123</p>',{format:});
  // })
  const add=(evt,editor) => editorRef.current = editor;
  return (
    <div>
      <Editor 
      apiKey="u1uuljgsgfdlmm2q3jhmy1jsgati928gouyy0e2wmdci0687"
      // value={'hello'}
      onEditorChange={handle}
      onInit={(evt,editor) => editorRef.current = editor}
      init={{

        menubar: false,
        toolbar: false,
        branding:false,
        statusbar: false,
        height: 5 ,
        placeholder:"Enter Title of Article...",
        // width:530,
        // content_css:'./editor.scss',
        plugins: "link image code",
        content_style: "body { background-color: #5C6275;color:white;font-size: 16pt;} .tox:not{background-color:black}",
        // toolbar: 'undo redo h1 h2 h3 backcolor forecolor bold italic alignleft aligncenter alignright',
        
      }}
      />
      {/* <button onClick={handle}>Submit</button> */}
    </div>
  );
}

export default Editor1;
