import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ghcolors } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MyComponentProps {
  codeString: string;
}

const CodeBlock: React.FC<MyComponentProps> = ({ codeString }) => {
  return (
    <SyntaxHighlighter
      language="javascript"
      className="code-wrap"
      style={ghcolors}
    >
      {codeString}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
