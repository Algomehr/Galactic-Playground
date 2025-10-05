import React from 'react';

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const elements = React.useMemo(() => {
    const nodes = [];
    let lastIndex = 0;
    // Regex for bold, italic, and latex (simple inline). Non-greedy match for content.
    const regex = /\*\*(.*?)\*\*|\*(.*?)\*|\$(.*?)\$/g;
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      // 1. Push the plain text before the match
      if (match.index > lastIndex) {
        nodes.push(text.substring(lastIndex, match.index));
      }

      // 2. Identify the content type and push the element
      const [, boldContent, italicContent, latexContent] = match;
      
      if (boldContent !== undefined) {
        nodes.push(<strong key={match.index}>{boldContent}</strong>);
      } else if (italicContent !== undefined) {
        nodes.push(<em key={match.index}>{italicContent}</em>);
      } else if (latexContent !== undefined) {
        nodes.push(<code key={match.index} className="bg-gray-800 text-cyan-300 font-mono p-1 rounded-md text-sm">{latexContent}</code>);
      }
      
      // 3. Update the last index
      lastIndex = regex.lastIndex;
    }

    // 4. Push any remaining plain text
    if (lastIndex < text.length) {
      nodes.push(text.substring(lastIndex));
    }

    return nodes.map((node, index) => (
      <React.Fragment key={index}>{node}</React.Fragment>
    ));
  }, [text]);

  // Use whitespace-pre-line to respect newlines from the AI's response
  return <div className="whitespace-pre-line">{elements}</div>;
};

export default MarkdownRenderer;