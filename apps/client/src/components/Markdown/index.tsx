import ReactMarkdown from 'react-markdown';

const ALLOWED_ELEMENTS = ['strong', 'em', 'p', 'br'];

type MarkdownProps = {
	children: string;
	className?: string;
};

const Markdown = ({ children, className }: MarkdownProps) => (
	<ReactMarkdown className={className} allowedElements={ALLOWED_ELEMENTS} unwrapDisallowed>{children}</ReactMarkdown>
);

export default Markdown;
