const quillModules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  },
};
export default quillModules;
