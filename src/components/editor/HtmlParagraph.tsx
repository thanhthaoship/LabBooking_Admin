import { Paragraph } from "../Typography";

interface IProps {
  html?: string;
}

export default function HtmlParagraph({ html }: IProps) {
  return (
    <>{html && <Paragraph dangerouslySetInnerHTML={{ __html: `${html}` }} />}</>
  );
}
